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
import { mergePDFs, ProcessingProgress, downloadFile } from '@/utils/pdfUtils';

export const MergePDFPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({ progress: 0, status: '' });
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      const result = await mergePDFs(files, setProgress);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Merge failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadFile(result, 'merged.pdf');
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
            title="Merge PDF Files"
            description="Combine multiple PDF files into one document. Maintain quality and preserve bookmarks."
            badgeText="PDF Merger"
            onBack={() => navigate('/')}
          />

          {/* Upload Area */}
          {!processing && !result && (
            <div className="mb-8">
              <FileUploadZone
                onFilesSelected={handleFilesSelected}
                multiple={true}
                title="Drop your PDF files here"
                description="Add multiple PDF files to merge them into one"
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

          {/* Merge Button */}
          {files.length >= 2 && !processing && !result && (
            <div className="mb-8">
              <Card className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Ready to Merge
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {files.length} PDF files will be combined into one document
                  </p>
                  <Button 
                    onClick={handleMerge}
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 text-white font-semibold py-4 px-8 rounded-full"
                  >
                    Merge PDFs
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Need more files notice */}
          {files.length === 1 && !processing && !result && (
            <div className="mb-8">
              <Card className="p-6 border-primary/20 bg-primary/5">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Add More Files
                  </h3>
                  <p className="text-muted-foreground">
                    You need at least 2 PDF files to merge them together
                  </p>
                </div>
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
              <CompletionStatus
                onDownload={handleDownload}
                onReset={handleReset}
                downloadText="Download Merged PDF"
              />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-8">
              <Card className="p-6 border-destructive/20 bg-destructive/5">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-destructive mb-2">
                    Merge Failed
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