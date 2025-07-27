import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  FileText, FileImage, FileSpreadsheet, Presentation, 
  Globe, Download, Upload, Scissors, RotateCw,
  Archive, Lock, Unlock, Image, Edit3, Settings
} from "lucide-react";

const toolCategories = [
  {
    title: "Convert",
    description: "Transform documents between formats",
    color: "from-blue-500 to-blue-600",
    tools: [
      { name: "PDF to Word", icon: FileText, description: "Convert PDF to editable DOC/DOCX" },
      { name: "PDF to Excel", icon: FileSpreadsheet, description: "Extract tables to spreadsheet format" },
      { name: "PDF to PowerPoint", icon: Presentation, description: "Convert presentations from PDF" },
      { name: "PDF to JPG", icon: FileImage, description: "Convert PDF pages to images" },
      { name: "HTML to PDF", icon: Globe, description: "Convert web pages to PDF" },
      { name: "Word to PDF", icon: Upload, description: "Convert DOC/DOCX to PDF" },
    ]
  },
  {
    title: "Edit",
    description: "Modify and organize your documents",
    color: "from-purple-500 to-purple-600",
    tools: [
      { name: "Edit PDF", icon: Edit3, description: "Add text, images, and annotations" },
      { name: "Merge PDF", icon: FileText, description: "Combine multiple PDFs into one" },
      { name: "Split PDF", icon: Scissors, description: "Separate PDF into pages" },
      { name: "Rotate PDF", icon: RotateCw, description: "Rotate pages as needed" },
      { name: "Compress PDF", icon: Archive, description: "Reduce file size efficiently" },
      { name: "Organize PDF", icon: Settings, description: "Reorder and manage pages" },
    ]
  },
  {
    title: "Secure",
    description: "Protect your sensitive documents",
    color: "from-green-500 to-green-600",
    tools: [
      { name: "Protect PDF", icon: Lock, description: "Add password encryption" },
      { name: "Unlock PDF", icon: Unlock, description: "Remove password protection" },
      { name: "Watermark PDF", icon: Image, description: "Add text or image watermarks" },
      { name: "Digital Signature", icon: FileText, description: "Sign documents electronically" },
    ]
  }
];

export const ToolsGrid = () => {
  const navigate = useNavigate();
  return (
    <div className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Professional PDF Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to work with PDF documents. All tools are completely free 
            with no limitations, registrations, or hidden costs.
          </p>
        </div>

        {/* Tools categories */}
        <div className="space-y-16">
          {toolCategories.map((category, categoryIndex) => (
            <div key={category.title} className="animate-fade-in-up" style={{ animationDelay: `${categoryIndex * 0.2}s` }}>
              {/* Category header */}
              <div className="text-center mb-12">
                <div className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${category.color} text-white font-semibold text-lg mb-4`}>
                  {category.title}
                </div>
                <p className="text-muted-foreground text-lg">{category.description}</p>
              </div>

              {/* Tools grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool, toolIndex) => (
                  <Card 
                    key={tool.name} 
                    className="tool-card-hover p-6 shadow-card cursor-pointer group border-2 border-transparent hover:border-primary/20"
                    style={{ animationDelay: `${(categoryIndex * 0.2) + (toolIndex * 0.1)}s` }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {tool.description}
                        </p>
                        <Button 
                          size="sm" 
                          onClick={() => navigate('/convert')}
                          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow text-white font-medium rounded-lg"
                        >
                          Use Tool
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Popular tools section */}
        <div className="mt-20 text-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Most Popular Tools
            </h3>
            <p className="text-muted-foreground text-lg mb-8">
              Start with these frequently used PDF tools
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/convert')}
                className="bg-gradient-primary hover:opacity-90 text-white font-medium px-8 py-3 rounded-full shadow-card"
              >
                PDF to Word
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/convert')}
                className="border-primary/30 text-primary hover:bg-primary/10 font-medium px-8 py-3 rounded-full"
              >
                Compress PDF
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/convert')}
                className="border-primary/30 text-primary hover:bg-primary/10 font-medium px-8 py-3 rounded-full"
              >
                Merge PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};