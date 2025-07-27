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
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { addWatermarkToPDF, ProcessingProgress, downloadFile } from '@/utils/pdfUtils';

export const WatermarkPDFPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({ progress: 0, status: '' });
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Watermark options
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState([0.5]);
  const [fontSize, setFontSize] = useState([50]);
  const [rotation, setRotation] = useState([45]);
  const [position, setPosition] = useState<'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('center');

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddWatermark = async () => {
    if (files.length === 0 || !watermarkText.trim()) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      const result = await addWatermarkToPDF(
        files[0],
        watermarkText,
        {
          opacity: opacity[0],
          fontSize: fontSize[0],
          rotation: rotation[0],
          position
        },
        setProgress
      );
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Watermark failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const filename = files[0]?.name.replace('.pdf', '_watermarked.pdf') || 'watermarked.pdf';
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <ToolHeader
            title="Add Watermark to PDF"
            description="Add text watermarks to your PDF documents. Perfect for branding, copyright protection, and document security."
            badgeText="PDF Watermark"
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
                description="Add watermark to protect your document"
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

          {/* Watermark Options */}
          {files.length > 0 && !processing && !result && (
            <div className="mb-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Watermark Settings
                </h3>
                
                <div className="space-y-6">
                  {/* Watermark Text */}
                  <div>
                    <Label htmlFor="watermarkText" className="text-sm font-medium">
                      Watermark Text
                    </Label>
                    <Input
                      id="watermarkText"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="Enter watermark text..."
                      className="mt-2"
                    />
                  </div>

                  {/* Position */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Position
                    </Label>
                    <RadioGroup 
                      value={position} 
                      onValueChange={(value) => setPosition(value as typeof position)}
                    >
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="top-left" id="top-left" />
                          <Label htmlFor="top-left" className="text-sm">Top Left</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="center" id="center" />
                          <Label htmlFor="center" className="text-sm">Center</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="top-right" id="top-right" />
                          <Label htmlFor="top-right" className="text-sm">Top Right</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bottom-left" id="bottom-left" />
                          <Label htmlFor="bottom-left" className="text-sm">Bottom Left</Label>
                        </div>
                        <div></div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bottom-right" id="bottom-right" />
                          <Label htmlFor="bottom-right" className="text-sm">Bottom Right</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Opacity */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Opacity: {Math.round(opacity[0] * 100)}%
                    </Label>
                    <Slider
                      value={opacity}
                      onValueChange={setOpacity}
                      max={1}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Font Size */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Font Size: {fontSize[0]}px
                    </Label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={100}
                      min={12}
                      step={2}
                      className="w-full"
                    />
                  </div>

                  {/* Rotation */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Rotation: {rotation[0]}°
                    </Label>
                    <Slider
                      value={rotation}
                      onValueChange={setRotation}
                      max={360}
                      min={0}
                      step={15}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <Button 
                    onClick={handleAddWatermark}
                    disabled={!watermarkText.trim()}
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 text-white font-semibold py-4 px-8 rounded-full"
                  >
                    Add Watermark
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
                downloadText="Download Watermarked PDF"
              />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-8">
              <Card className="p-6 border-destructive/20 bg-destructive/5">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-destructive mb-2">
                    Watermark Failed
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