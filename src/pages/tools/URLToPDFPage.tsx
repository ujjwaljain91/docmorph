import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { 
  ProcessingStatus, 
  CompletionStatus, 
  ToolHeader, 
  SecurityNotice 
} from '@/components/shared/FileProcessing';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Globe, Zap, Link } from 'lucide-react';

export const URLToPDFPage = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ progress: 0, status: '' });
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!url.trim()) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      // Simulate conversion process
      setProgress({ progress: 25, status: 'Fetching website...' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProgress({ progress: 50, status: 'Rendering page content...' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProgress({ progress: 75, status: 'Generating PDF...' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProgress({ progress: 100, status: 'Conversion complete!' });
      
      // Create mock PDF file
      const mockPDF = new Blob(['Mock PDF content'], { type: 'application/pdf' });
      setResult(mockPDF);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const filename = `${new URL(url).hostname}.pdf`;
      const downloadUrl = URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError(null);
    setProgress({ progress: 0, status: '' });
  };

  const isValidUrl = url.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navigation />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <ToolHeader
            title="URL to PDF Converter"
            description="Convert any website directly to PDF by entering its URL. Perfect for archiving web pages, saving articles, or creating offline documentation."
            badgeText="🔗 URL to PDF"
            onBack={() => navigate('/')}
          />

          {/* Show other tools suggestion after URL input */}
          {isValidUrl && !processing && !result && (
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

          {/* URL Input Area */}
          {!processing && !result && (
            <div className="mb-8">
              <Card className="p-8 border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <div className="inline-flex p-6 rounded-full mb-6 bg-primary/10 text-primary">
                    <Link className="h-12 w-12" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    Enter Website URL
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Enter any website URL to convert it to a PDF document
                  </p>
                  
                  <div className="max-w-2xl mx-auto">
                    <div className="flex gap-4 mb-4">
                      <Input
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1 text-lg py-3"
                      />
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Works with any public website • Captures full page content • Preserves formatting
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Convert Options */}
          {isValidUrl && !processing && !result && (
            <div className="mb-8">
              <Card className="p-8 shadow-elegant hover:shadow-glow transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-glow">
                      <Globe className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    Ready to Convert
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    The website will be captured in full and converted to a PDF document 
                    preserving all content, images, and styling.
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