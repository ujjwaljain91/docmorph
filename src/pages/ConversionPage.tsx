import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, FileText, Download, ArrowLeft, 
  Check, X, AlertCircle, Zap 
} from "lucide-react";
import { Navigation } from "@/components/Navigation";

export const ConversionPage = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        file => file.type === "application/pdf" || file.name.toLowerCase().endsWith('.pdf')
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        file => file.type === "application/pdf" || file.name.toLowerCase().endsWith('.pdf')
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 3000);
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
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Button>
            
            <div className="text-center">
              <Badge className="mb-4 px-4 py-2 bg-gradient-primary text-white font-medium">
                PDF Converter
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Convert Your PDF Files
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload your PDF files and convert them to your desired format. 
                Fast, secure, and completely free.
              </p>
            </div>
          </div>

          {/* Upload Area */}
          <Card className="p-8 mb-8 border-2 border-dashed border-border hover:border-primary/50 transition-colors">
            <div
              className={`text-center ${dragActive ? 'scale-105' : ''} transition-transform duration-200`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className={`inline-flex p-6 rounded-full mb-6 ${dragActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary'} transition-colors duration-200`}>
                <Upload className="h-12 w-12" />
              </div>
              
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Drop your PDF files here
              </h3>
              <p className="text-muted-foreground mb-6">
                or click to browse from your computer
              </p>
              
              <div className="space-y-4">
                <Button 
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-white font-medium px-8 py-3 rounded-full"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose PDF Files
                </Button>
                
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <p className="text-sm text-muted-foreground">
                  Supports PDF files up to 100MB • Completely secure and private
                </p>
              </div>
            </div>
          </Card>

          {/* File List */}
          {files.length > 0 && (
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Selected Files ({files.length})
              </h3>
              
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isComplete ? (
                        <Check className="h-5 w-5 text-success" />
                      ) : isProcessing ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Conversion Options */}
          {files.length > 0 && !isProcessing && !isComplete && (
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Choose Output Format
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { name: "Word", ext: "DOCX", icon: "📄" },
                  { name: "Excel", ext: "XLSX", icon: "📊" },
                  { name: "PowerPoint", ext: "PPTX", icon: "📋" },
                  { name: "JPG", ext: "JPG", icon: "🖼️" }
                ].map((format) => (
                  <Button
                    key={format.ext}
                    variant="outline"
                    className="h-20 flex-col space-y-2 hover:bg-primary hover:text-white transition-colors"
                  >
                    <span className="text-2xl">{format.icon}</span>
                    <span className="font-medium">{format.name}</span>
                    <span className="text-xs opacity-70">.{format.ext}</span>
                  </Button>
                ))}
              </div>
              
              <Button 
                onClick={handleConvert}
                size="lg"
                className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-4 rounded-full"
              >
                <Zap className="h-5 w-5 mr-2" />
                Convert Files Now
              </Button>
            </Card>
          )}

          {/* Processing State */}
          {isProcessing && (
            <Card className="p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Converting Your Files...
              </h3>
              <p className="text-muted-foreground">
                This usually takes a few seconds. Please don't close this tab.
              </p>
            </Card>
          )}

          {/* Complete State */}
          {isComplete && (
            <Card className="p-8 text-center border-success/20 bg-success/5">
              <div className="inline-flex p-4 rounded-full bg-success text-white mb-6">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Conversion Complete!
              </h3>
              <p className="text-muted-foreground mb-6">
                Your files have been successfully converted and are ready for download.
              </p>
              
              <div className="space-y-3">
                <Button 
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-3 rounded-full"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download All Files
                </Button>
                
                <div>
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      setFiles([]);
                      setIsComplete(false);
                      setIsProcessing(false);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Convert More Files
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
              <AlertCircle className="h-4 w-4" />
              <span>Your files are processed securely and deleted immediately after conversion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};