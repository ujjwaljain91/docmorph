import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, Mail, Github, Twitter, 
  Heart, Shield, Zap, Users 
} from "lucide-react";

export const Footer = () => {
  const toolCategories = [
    {
      title: "Convert",
      tools: ["PDF to Word", "PDF to Excel", "PDF to JPG", "Word to PDF"]
    },
    {
      title: "Edit", 
      tools: ["Edit PDF", "Merge PDF", "Split PDF", "Compress PDF"]
    },
    {
      title: "Secure",
      tools: ["Protect PDF", "Unlock PDF", "Watermark", "Digital Sign"]
    }
  ];

  const company = [
    { name: "About DocMorph", href: "#" },
    { name: "Our Mission", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/acf9480b-6eee-4a55-8e25-81e8a4434f8b.png" 
                alt="DocMorph" 
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold">DocMorph</span>
            </div>
            <p className="text-white/80 leading-relaxed mb-6 max-w-md">
              Transform your documents with professional PDF tools. 
              Completely free, forever. No limits, no registration required.
            </p>
            
            {/* Core values */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-red-400" />
                <span className="text-sm">Free Forever</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm">Privacy First</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-sm">Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-sm">Community Driven</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Tools columns */}
          {toolCategories.map((category) => (
            <div key={category.title}>
              <h3 className="font-semibold text-lg mb-4 text-white">
                {category.title}
              </h3>
              <ul className="space-y-3">
                {category.tools.map((tool) => (
                  <li key={tool}>
                    <a 
                      href="#" 
                      className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {tool}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Company links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">
              Company
            </h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-white/20" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6 text-sm text-white/70">
            <p>© 2024 DocMorph. Made with ❤️ for the community.</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-white/70">
              <FileText className="h-4 w-4" />
              <span>2M+ files processed today</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-success">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>

        {/* Mission statement */}
        <div className="mt-12 text-center">
          <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl border border-white/10">
            <p className="text-white/90 leading-relaxed">
              <strong>Our Promise:</strong> DocMorph will always remain completely free. 
              We believe everyone deserves access to professional PDF tools without barriers, 
              subscriptions, or limitations.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};