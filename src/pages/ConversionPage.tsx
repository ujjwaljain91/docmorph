import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, FileText, Download, ArrowLeft, 
  Check, X, AlertCircle, Zap, FileImage, 
  FileSpreadsheet, Presentation, Globe,
  Sparkles, ArrowRight
} from "lucide-react";
import { Navigation } from "@/components/Navigation";

// Tool categories with enhanced visual design
const conversionTools = [
  {
    category: "Document Conversion",
    gradient: "from-blue-500 to-blue-600",
    tools: [
      { 
        name: "PDF to Word", 
        icon: FileText, 
        description: "Convert to editable DOC/DOCX format",
        route: "/pdf-to-word",
        popular: true,
        color: "text-blue-500"
      },
      { 
        name: "PDF to Excel", 
        icon: FileSpreadsheet, 
        description: "Extract tables and data to spreadsheet",
        route: "/convert",
        color: "text-green-500"
      },
      { 
        name: "PDF to PowerPoint", 
        icon: Presentation, 
        description: "Convert presentations from PDF",
        route: "/convert",
        color: "text-orange-500"
      },
    ]
  },
  {
    category: "Image Conversion",
    gradient: "from-purple-500 to-purple-600",
    tools: [
      { 
        name: "PDF to JPG", 
        icon: FileImage, 
        description: "Convert PDF pages to images",
        route: "/convert",
        popular: true,
        color: "text-purple-500"
      },
      { 
        name: "PDF to PNG", 
        icon: FileImage, 
        description: "High-quality image conversion",
        route: "/convert",
        color: "text-pink-500"
      },
    ]
  },
  {
    category: "Web Conversion",
    gradient: "from-cyan-500 to-cyan-600", 
    tools: [
      { 
        name: "HTML to PDF", 
        icon: Globe, 
        description: "Convert web pages to PDF",
        route: "/convert",
        color: "text-cyan-500"
      },
      { 
        name: "URL to PDF", 
        icon: Globe, 
        description: "Convert any website to PDF",
        route: "/convert",
        color: "text-teal-500"
      },
    ]
  }
];

export const ConversionPage = () => {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
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
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-12">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Button>
            
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
              </div>
              <Badge className="mb-4 px-6 py-2 bg-gradient-primary text-white font-medium text-sm rounded-full">
                AI-Powered Conversion
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Choose Your
                <span className="block text-gradient bg-gradient-primary bg-clip-text text-transparent">
                  Conversion Tool
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Select the perfect tool for your document transformation needs. 
                Professional quality, lightning fast, completely free.
              </p>
            </div>
          </div>

          {/* Tool Selection Grid */}
          {!selectedTool && (
            <div className="mb-12">
              {conversionTools.map((category, categoryIndex) => (
                <div key={category.category} className="mb-12 last:mb-0">
                  {/* Category Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${category.gradient} text-white font-semibold text-lg mb-4 shadow-elegant`}>
                      {category.category}
                    </div>
                  </div>

                  {/* Tools Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.tools.map((tool, toolIndex) => (
                      <Card 
                        key={tool.name} 
                        className="group p-6 cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105 border-2 border-transparent hover:border-primary/20 relative overflow-hidden"
                        onClick={() => {
                          if (tool.route !== '/convert') {
                            navigate(tool.route);
                          } else {
                            setSelectedTool(tool.name);
                          }
                        }}
                      >
                        {/* Popular Badge */}
                        {tool.popular && (
                          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium">
                            Popular
                          </Badge>
                        )}
                        
                        {/* Tool Icon */}
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`p-4 rounded-xl bg-gradient-to-r ${category.gradient} text-white group-hover:scale-110 transition-transform duration-300`}>
                            <tool.icon className="h-8 w-8" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors mb-2">
                              {tool.name}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <div className="flex items-center justify-between mt-6">
                          <span className="text-sm font-medium text-muted-foreground">
                            Click to use
                          </span>
                          <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                        
                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Tool Header */}
          {selectedTool && !isProcessing && !isComplete && (
            <div className="mb-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {selectedTool}
                </h2>
                <p className="text-muted-foreground">Upload your PDF files to get started</p>
              </div>
            </div>
          )}

          {/* Upload Area */}
          {(!selectedTool || files.length === 0) && !isProcessing && !isComplete && (
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
                {selectedTool ? `Upload PDF for ${selectedTool}` : 'Drop your PDF files here'}
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
          )}

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

          {/* Show other tools after file upload when a specific tool is selected */}
          {selectedTool && files.length > 0 && !isProcessing && !isComplete && (
            <div className="mb-8">
              <Card className="p-6 border-primary/20 bg-primary/5">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Need a different tool?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You can also try these related tools:
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedTool(null)}
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    Browse All Tools
                  </Button>
                </div>
              </Card>
            </div>
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