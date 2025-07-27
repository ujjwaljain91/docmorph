import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, FileText, X, Download, AlertCircle, 
  Check, Loader2, ArrowLeft 
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
      className={`p-8 border-2 border-dashed cursor-pointer transition-all duration-200 ${
        isDragActive 
          ? 'border-primary bg-primary/5 scale-105' 
          : 'border-border hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <div className={`inline-flex p-6 rounded-full mb-6 transition-colors duration-200 ${
          isDragActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
        }`}>
          <Upload className="h-12 w-12" />
        </div>
        
        <h3 className="text-2xl font-semibold text-foreground mb-4">
          {title}
        </h3>
        <p className="text-muted-foreground mb-6">
          {description}
        </p>
        
        <Button 
          type="button"
          size="lg"
          className="bg-gradient-primary hover:opacity-90 text-white font-medium px-8 py-3 rounded-full"
        >
          Choose PDF Files
        </Button>
        
        <p className="text-sm text-muted-foreground mt-4">
          Supports PDF files up to 100MB • Completely secure and private
        </p>
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
    <Card className="p-6">
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
    <Card className="p-8 text-center">
      <div className="mb-6">
        <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
        <Progress value={progress.progress} className="w-full max-w-md mx-auto" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Processing Your Files...
      </h3>
      <p className="text-muted-foreground mb-2">
        {progress.status}
      </p>
      <p className="text-sm text-muted-foreground">
        {progress.progress}% complete • Please don't close this tab.
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
    <Card className="p-8 text-center border-success/20 bg-success/5">
      <div className="inline-flex p-4 rounded-full bg-success text-white mb-6">
        <Check className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-4">
        Processing Complete!
      </h3>
      <p className="text-muted-foreground mb-6">
        Your files have been successfully processed and are ready for download.
      </p>
      
      <div className="space-y-3">
        <Button 
          size="lg"
          onClick={onDownload}
          className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-3 rounded-full"
        >
          <Download className="h-5 w-5 mr-2" />
          {downloadText}
        </Button>
        
        <div>
          <Button 
            variant="ghost"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
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
    <div className="mb-8">
      {onBack && (
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tools
        </Button>
      )}
      
      <div className="text-center">
        <Badge className="mb-4 px-4 py-2 bg-gradient-primary text-white font-medium">
          {badgeText}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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