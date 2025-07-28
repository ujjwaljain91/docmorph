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
import { Input } from '@/components/ui/input';
import { Globe, Zap } from 'lucide-react';
import { convertHTMLToPDF, ProcessingProgress, downloadFile } from '@/utils/pdfUtils';

export const HTMLToPDFPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState('');
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
    if (files.length === 0 && !url.trim()) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      let htmlContent = '';
      
      if (files.length > 0) {
        // Read HTML file content
        htmlContent = await files[0].text();
      } else {
        // For URL, we'll create a simple HTML content placeholder
        htmlContent = `<html><body><h1>URL Content</h1><p>Processing URL: ${url}</p></body></html>`;
      }
      
      const result = await convertHTMLToPDF(htmlContent, setProgress);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const filename = url ? 'webpage.pdf' : files[0]?.name.replace('.html', '.pdf') || 'converted.pdf';
      downloadFile(result, filename);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setUrl('');
    setResult(null);
    setError(null);
    setProgress({ progress: 0, status: '' });
  };

  const canConvert = files.length > 0 || url.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navigation />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <ToolHeader
            title="HTML to PDF Converter"
            description="Convert HTML files or web pages into PDF documents. Perfect for archiving web content or creating printable versions."
            badgeText="🌐 HTML to PDF"
            onBack={() => navigate('/')}
          />

          {/* Show other tools suggestion after file upload */}
          {canConvert && !processing && !result && (
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

          {/* Upload Area or URL Input */}
          {!processing && !result && (
            <div className="mb-8 space-y-6">
              <FileUploadZone
                onFilesSelected={handleFilesSelected}
                multiple={false}
                maxFiles={1}
                title="Drop your HTML file here"
                description="Upload HTML file to convert to PDF"
                acceptedFileTypes={['.html', '.htm']}
              />
              
              <div className="text-center">
                <span className="text-muted-foreground bg-background px-4">OR</span>
              </div>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Enter Website URL</h3>
                <div className="flex gap-4">
                  <Input
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter any website URL to convert it to PDF
                </p>
              </Card>
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
          {canConvert && !processing && !result && (
            <div className="mb-8">
              <Card className="p-8 shadow-elegant hover:shadow-glow transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-glow">
                      <Globe className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    Ready to Convert
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {files.length > 0 
                      ? "Your HTML file will be converted to a PDF document preserving styling and layout."
                      : "The website will be captured and converted to a PDF document."
                    }
                  </p>
                  <Button 
                    onClick={handleConvert}
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 text-white font-semibold py-4 px-10 rounded-full shadow-elegant hover:shadow-glow transition-all duration-300"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Convert to PDF
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
                downloadText="Download PDF Document"
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