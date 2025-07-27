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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { compressPDF, ProcessingProgress, downloadFile } from '@/utils/pdfUtils';

export const CompressPDFPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({ progress: 0, status: '' });
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCompress = async () => {
    if (files.length === 0) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      const result = await compressPDF(files[0], compressionLevel, setProgress);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const filename = files[0]?.name.replace('.pdf', '_compressed.pdf') || 'compressed.pdf';
      downloadFile(result, filename);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress({ progress: 0, status: '' });
  };

  const getCompressionDescription = (level: string) => {
    switch (level) {
      case 'low':
        return 'Minimal compression, best quality';
      case 'medium':
        return 'Balanced compression and quality';
      case 'high':
        return 'Maximum compression, smaller file size';
      default:
        return '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <ToolHeader
            title="Compress PDF Files"
            description="Reduce PDF file size while maintaining quality. Perfect for email sharing and web uploads."
            badgeText="PDF Compressor"
            onBack={() => navigate('/')}
          />

          {/* Upload Area */}
          {!processing && !result && (
            <div className="mb-8">
              <FileUploadZone
                onFilesSelected={handleFilesSelected}
                multiple={false}
                maxFiles={1}
                title="Drop your PDF file here"
                description="Reduce file size while maintaining quality"
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
              
              {files.length > 0 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Original size: <span className="font-medium">{formatFileSize(files[0].size)}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Compression Options */}
          {files.length > 0 && !processing && !result && (
            <div className="mb-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Compression Level
                </h3>
                
                <RadioGroup 
                  value={compressionLevel} 
                  onValueChange={(value) => setCompressionLevel(value as 'low' | 'medium' | 'high')}
                  className="mb-6"
                >
                  <div className="space-y-4">
                    {[
                      { value: 'low', label: 'Low Compression', desc: 'Minimal compression, best quality' },
                      { value: 'medium', label: 'Medium Compression', desc: 'Balanced compression and quality (Recommended)' },
                      { value: 'high', label: 'High Compression', desc: 'Maximum compression, smaller file size' }
                    ].map((option) => (
                      <div key={option.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={option.value} className="font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {option.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <Button 
                  onClick={handleCompress}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-white font-semibold py-4 px-8 rounded-full"
                >
                  Compress PDF
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
                  Compression Complete!
                </h3>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Original Size</p>
                    <p className="font-semibold text-foreground">
                      {formatFileSize(files[0]?.size || 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Compressed Size</p>
                    <p className="font-semibold text-success">
                      {formatFileSize(result.size)}
                    </p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Size reduction: {Math.round((1 - result.size / (files[0]?.size || 1)) * 100)}%
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
                    Download Compressed PDF
                  </Button>
                  
                  <div>
                    <Button 
                      variant="ghost"
                      onClick={handleReset}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Compress Another PDF
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
                    Compression Failed
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