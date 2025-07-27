import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ToolsGrid } from "@/components/ToolsGrid";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <ToolsGrid />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
