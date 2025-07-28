import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { ConversionPage } from "./pages/ConversionPage";
import { PDFToWordPage } from "./pages/tools/PDFToWordPage";
import { PDFToExcelPage } from "./pages/tools/PDFToExcelPage";
import { PDFToPowerPointPage } from "./pages/tools/PDFToPowerPointPage";
import { PDFToJPGPage } from "./pages/tools/PDFToJPGPage";
import { PDFToPNGPage } from "./pages/tools/PDFToPNGPage";
import { HTMLToPDFPage } from "./pages/tools/HTMLToPDFPage";
import { URLToPDFPage } from "./pages/tools/URLToPDFPage";
import { MergePDFPage } from "./pages/tools/MergePDFPage";
import { SplitPDFPage } from "./pages/tools/SplitPDFPage";
import { CompressPDFPage } from "./pages/tools/CompressPDFPage";
import { WatermarkPDFPage } from "./pages/tools/WatermarkPDFPage";
import { RotatePDFPage } from "./pages/tools/RotatePDFPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/convert" element={<ConversionPage />} />
          <Route path="/pdf-to-word" element={<PDFToWordPage />} />
          <Route path="/pdf-to-excel" element={<PDFToExcelPage />} />
          <Route path="/pdf-to-powerpoint" element={<PDFToPowerPointPage />} />
          <Route path="/pdf-to-jpg" element={<PDFToJPGPage />} />
          <Route path="/pdf-to-png" element={<PDFToPNGPage />} />
          <Route path="/html-to-pdf" element={<HTMLToPDFPage />} />
          <Route path="/url-to-pdf" element={<URLToPDFPage />} />
          <Route path="/merge-pdf" element={<MergePDFPage />} />
          <Route path="/split-pdf" element={<SplitPDFPage />} />
          <Route path="/compress-pdf" element={<CompressPDFPage />} />
          <Route path="/watermark-pdf" element={<WatermarkPDFPage />} />
          <Route path="/rotate-pdf" element={<RotatePDFPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
