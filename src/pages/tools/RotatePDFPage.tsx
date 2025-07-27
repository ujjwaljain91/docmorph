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
import { rotatePDF, ProcessingProgress, downloadFile } from '@/utils/pdfUtils';

export const RotatePDFPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({ progress: 0, status: '' });
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(90);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRotate = async () => {
    if (files.length === 0) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      const result = await rotatePDF(files[0], rotationAngle, undefined, setProgress);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rotation failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const filename = files[0]?.name.replace('.pdf', '_rotated.pdf') || 'rotated.pdf';
      downloadFile(result, filename);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress({ progress: 0, status: '' });
  };

  const rotationOptions = [
    { angle: 90, label: '90° Clockwise', icon: '↻' },
    { angle: 180, label: '180° Flip', icon: '↺' },
    { angle: 270, label: '270° Clockwise', icon: '↺' },
    { angle: -90, label: '90° Counter-clockwise', icon: '↺' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <ToolHeader
            title="Rotate PDF Pages"
            description="Rotate all pages in your PDF document. Fix orientation issues and prepare documents for printing."
            badgeText="PDF Rotator"
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
                description="Rotate pages to fix orientation"
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

          {/* Rotation Options */}
          {files.length > 0 && !processing && !result && (
            <div className="mb-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Rotation Direction
                </h3>
                
                <RadioGroup 
                  value={rotationAngle.toString()} 
                  onValueChange={(value) => setRotationAngle(parseInt(value))}
                  className="mb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rotationOptions.map((option) => (
                      <div key={option.angle} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.angle.toString()} id={option.angle.toString()} />
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="text-2xl">{option.icon}</div>
                          <Label htmlFor={option.angle.toString()} className="font-medium cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <div className="text-center">
                  <Button 
                    onClick={handleRotate}
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 text-white font-semibold py-4 px-8 rounded-full"
                  >
                    Rotate PDF
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
                downloadText="Download Rotated PDF"
              />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-8">
              <Card className="p-6 border-destructive/20 bg-destructive/5">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-destructive mb-2">
                    Rotation Failed
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