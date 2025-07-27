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
import { FileText, Zap } from 'lucide-react';
import { convertPDFToDocx, ProcessingProgress, downloadFile } from '@/utils/pdfUtils';

export const PDFToWordPage = () => {
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

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      const result = await convertPDFToDocx(files[0], setProgress);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const filename = files[0]?.name.replace('.pdf', '.docx') || 'converted.docx';
      downloadFile(result, filename);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress({ progress: 0, status: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navigation />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <ToolHeader
            title="PDF to Word Converter"
            description="Transform your PDF files into fully editable Word documents. Perfect for editing, reviewing, and reformatting content with professional quality."
            badgeText="🔄 PDF to DOCX"
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
                description="Convert PDF to editable Word document"
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

          {/* Convert Options */}
          {files.length > 0 && !processing && !result && (
            <div className="mb-8">
              <Card className="p-8 shadow-elegant hover:shadow-glow transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-glow">
                      <FileText className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    Ready to Convert
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Your PDF will be converted to a fully editable Word document (.docx) 
                    while preserving formatting and layout.
                  </p>
                  <Button 
                    onClick={handleConvert}
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 text-white font-semibold py-4 px-10 rounded-full shadow-elegant hover:shadow-glow transition-all duration-300"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Convert to Word
                  </Button>
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
                downloadText="Download Word Document"
              />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-8">
              <Card className="p-6 border-destructive/20 bg-destructive/5">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-destructive mb-2">
                    Conversion Failed
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