import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, FileText, X, Download, AlertCircle, 
  Check, Loader2, ArrowLeft, Sparkles, Star, Zap
} from 'lucide-react';
import { ProcessingProgress } from '@/utils/pdfUtils';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  multiple?: boolean;
  title?: string;
  description?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  acceptedFileTypes = ['.pdf', 'application/pdf'],
  maxFiles = 10,
  multiple = true,
  title = 'Drop your PDF files here',
  description = 'or click to browse from your computer'
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles,
    multiple
  });

  return (
    <Card 
      {...getRootProps()} 
      className={`group p-8 border-2 border-dashed cursor-pointer transition-all duration-300 ${
        isDragActive 
          ? 'border-primary bg-gradient-to-br from-primary/10 to-secondary/10 scale-[1.02] shadow-glow' 
          : 'border-border hover:border-primary/50 hover:bg-muted/30'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <div className={`inline-flex p-6 rounded-full mb-6 transition-all duration-300 ${
          isDragActive ? 'bg-primary text-white scale-110 shadow-glow' : 'bg-primary/10 text-primary group-hover:scale-105'
        }`}>
          <Upload className="h-12 w-12" />
        </div>
        
        <h3 className="text-2xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground mb-6">
          {description}
        </p>
        
        <Button 
          type="button"
          size="lg"
          className="bg-gradient-primary hover:opacity-90 text-white font-medium px-8 py-3 rounded-full shadow-card hover:shadow-glow transition-all duration-300"
        >
          <Upload className="h-5 w-5 mr-2" />
          Choose PDF Files
        </Button>
        
        <div className="flex items-center justify-center space-x-6 mt-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Up to 100MB</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-green-500" />
            <span>Lightning fast</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <span>100% secure</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  processingState?: 'idle' | 'processing' | 'complete' | 'error';
}

export const FileList: React.FC<FileListProps> = ({ 
  files, 
  onRemoveFile, 
  processingState = 'idle' 
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    switch (processingState) {
      case 'processing':
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      case 'complete':
        return <Check className="h-5 w-5 text-success" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  if (files.length === 0) return null;

  return (
    <Card className="p-6 shadow-card hover:shadow-glow transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Selected Files ({files.length})
        </h3>
        <Badge className="bg-primary/10 text-primary font-medium">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {files.map((file, index) => (
          <div key={index} className="group flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">{file.name}</p>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span className="text-success">Ready to process</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              {processingState === 'idle' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(index)}
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
  );
};

interface ProcessingStatusProps {
  progress: ProcessingProgress;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ progress }) => {
  return (
    <Card className="p-8 text-center shadow-glow border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="mb-6">
        <div className="relative inline-block">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
        </div>
        <div className="max-w-md mx-auto mb-4">
          <Progress value={progress.progress} className="h-3" />
        </div>
        <Badge className="bg-primary/10 text-primary font-medium px-4 py-1">
          {progress.progress}% Complete
        </Badge>
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Processing Your Files...
      </h3>
      <p className="text-muted-foreground mb-2">
        {progress.status}
      </p>
      <p className="text-sm text-muted-foreground">
        Please keep this tab open while we process your files.
      </p>
    </Card>
  );
};

interface CompletionStatusProps {
  onDownload: () => void;
  onReset: () => void;
  downloadText?: string;
}

export const CompletionStatus: React.FC<CompletionStatusProps> = ({ 
  onDownload, 
  onReset, 
  downloadText = 'Download Processed Files' 
}) => {
  return (
    <Card className="p-8 text-center border-success/20 bg-gradient-to-br from-success/5 to-green-50 shadow-glow">
      <div className="relative inline-block mb-6">
        <div className="inline-flex p-4 rounded-full bg-success text-white shadow-elegant">
          <Check className="h-8 w-8" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
        </div>
      </div>
      
      <h3 className="text-2xl font-semibold text-foreground mb-4">
        🎉 Processing Complete!
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Your files have been successfully processed with professional quality. 
        Ready for download!
      </p>
      
      <div className="space-y-4">
        <Button 
          size="lg"
          onClick={onDownload}
          className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-4 rounded-full shadow-elegant hover:shadow-glow transition-all duration-300"
        >
          <Download className="h-5 w-5 mr-2" />
          {downloadText}
        </Button>
        
        <div>
          <Button 
            variant="ghost"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
          >
            Process More Files
          </Button>
        </div>
      </div>
    </Card>
  );
};

interface ToolHeaderProps {
  title: string;
  description: string;
  badgeText: string;
  onBack?: () => void;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ 
  title, 
  description, 
  badgeText, 
  onBack 
}) => {
  return (
    <div className="mb-12">
      {onBack && (
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tools
        </Button>
      )}
      
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow animate-float">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
        </div>
        <Badge className="mb-6 px-6 py-2 bg-gradient-primary text-white font-medium text-sm rounded-full shadow-card">
          {badgeText}
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

interface SecurityNoticeProps {}

export const SecurityNotice: React.FC<SecurityNoticeProps> = () => {
  return (
    <div className="text-center">
      <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
        <AlertCircle className="h-4 w-4" />
        <span>Your files are processed securely and deleted immediately after processing</span>
      </div>
    </div>
  );
};