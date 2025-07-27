import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { 
  FileUploadZone, 
  FileList, 
  ProcessingStatus, 
  CompletionStatus, 
  ToolHeader, 
  SecurityNotice 
} from '@/components/shared/FileProcessing';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { splitPDF, ProcessingProgress, downloadMultipleFiles } from '@/utils/pdfUtils';

export const SplitPDFPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({ progress: 0, status: '' });
  const [result, setResult] = useState<Blob[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Split options
  const [splitType, setSplitType] = useState<'pages' | 'ranges'>('pages');
  const [pagesPerFile, setPagesPerFile] = useState(1);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSplit = async () => {
    if (files.length === 0) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      const result = await splitPDF(
        files[0], 
        splitType, 
        { pagesPerFile }, 
        setProgress
      );
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Split failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result && files.length > 0) {
      const baseFilename = files[0].name.replace('.pdf', '');
      const filesToDownload = result.map((blob, index) => ({
        blob,
        filename: `${baseFilename}_part_${index + 1}.pdf`
      }));
      
      downloadMultipleFiles(filesToDownload, `${baseFilename}_split.zip`);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress({ progress: 0, status: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <ToolHeader
            title="Split PDF Files"
            description="Separate your PDF into multiple documents. Extract specific pages or split by page ranges."
            badgeText="PDF Splitter"
            onBack={() => navigate('/')}
          />

          {/* Show other tools suggestion after file upload */}
          {files.length > 0 && !processing && !result && (
            <div className="mb-8">
              <Card className="p-4 border-primary/20 bg-primary/5">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Need a different tool? <a href="/" className="text-primary hover:underline">Browse all PDF tools</a>
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Upload Area */}
          {!processing && !result && (
            <div className="mb-8">
              <FileUploadZone
                onFilesSelected={handleFilesSelected}
                multiple={false}
                maxFiles={1}
                title="Drop your PDF file here"
                description="Split your PDF into separate documents"
              />
            </div>
          )}

          {/* File List */}
          {files.length > 0 && !processing && !result && (
            <div className="mb-8">
              <FileList
                files={files}
                onRemoveFile={handleRemoveFile}
                processingState="idle"
              />
            </div>
          )}

          {/* Split Options */}
          {files.length > 0 && !processing && !result && (
            <div className="mb-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Split Options
                </h3>
                
                <RadioGroup 
                  value={splitType} 
                  onValueChange={(value) => setSplitType(value as 'pages' | 'ranges')}
                  className="mb-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pages" id="pages" />
                    <Label htmlFor="pages">Split by number of pages per file</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ranges" id="ranges" />
                    <Label htmlFor="ranges">Split by page ranges (coming soon)</Label>
                  </div>
                </RadioGroup>

                {splitType === 'pages' && (
                  <div className="mb-6">
                    <Label htmlFor="pagesPerFile" className="text-sm font-medium">
                      Pages per file
                    </Label>
                    <Input
                      id="pagesPerFile"
                      type="number"
                      min={1}
                      value={pagesPerFile}
                      onChange={(e) => setPagesPerFile(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-32 mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Each output file will contain {pagesPerFile} page{pagesPerFile !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleSplit}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-white font-semibold py-4 px-8 rounded-full"
                >
                  Split PDF
                </Button>
              </Card>
            </div>
          )}

          {/* Processing State */}
          {processing && (
            <div className="mb-8">
              <ProcessingStatus progress={progress} />
            </div>
          )}

          {/* Complete State */}
          {result && (
            <div className="mb-8">
              <Card className="p-8 text-center border-success/20 bg-success/5">
                <div className="inline-flex p-4 rounded-full bg-success text-white mb-6">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Split Complete!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Your PDF has been split into {result.length} separate files.
                </p>
                
                <div className="space-y-3">
                  <Button 
                    size="lg"
                    onClick={handleDownload}
                    className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-3 rounded-full"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download ZIP ({result.length} files)
                  </Button>
                  
                  <div>
                    <Button 
                      variant="ghost"
                      onClick={handleReset}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Split Another PDF
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-8">
              <Card className="p-6 border-destructive/20 bg-destructive/5">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-destructive mb-2">
                    Split Failed
                  </h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button 
                    onClick={() => setError(null)}
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    Try Again
                  </Button>
                </div>
              </Card>
            </div>
          )}

          <SecurityNotice />
        </div>
      </div>
    </div>
  );
};