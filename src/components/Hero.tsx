import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Zap, Shield } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient"></div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full floating-animation blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-white/5 rounded-full floating-animation blur-2xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-32 h-32 bg-white/15 morph-animation blur-lg"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/acf9480b-6eee-4a55-8e25-81e8a4434f8b.png" 
              alt="DocMorph Logo" 
              className="h-20 w-auto floating-animation"
            />
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
            Transform Your
            <span className="block text-white drop-shadow-lg">
              Documents Instantly
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            The most intuitive PDF toolkit for professionals and everyday users.
            <span className="block font-semibold mt-2">Completely free forever. No limits. No catches.</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-4 rounded-full shadow-elegant hover:shadow-glow transition-all duration-300"
            >
              Start Converting Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white border-2 text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              View All Tools
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="glass-card p-6 rounded-2xl text-center">
              <FileText className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">25+ PDF Tools</h3>
              <p className="text-white/80">Convert, edit, compress, and secure your documents</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl text-center">
              <Zap className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-white/80">Process files instantly with our optimized engine</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl text-center">
              <Shield className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">100% Secure</h3>
              <p className="text-white/80">Your files are processed locally and deleted immediately</p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <p className="text-white/70 text-lg">
              Trusted by <span className="font-bold text-white">2M+ users</span> worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};