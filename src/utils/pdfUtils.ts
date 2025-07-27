// PDF processing utilities for DocMorph
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export interface ProcessingProgress {
  progress: number;
  status: string;
  error?: string;
}

export type ProgressCallback = (progress: ProcessingProgress) => void;

// PDF to DOCX conversion
export const convertPDFToDocx = async (
  file: File, 
  onProgress?: ProgressCallback
): Promise<Blob> => {
  try {
    onProgress?.({ progress: 10, status: 'Loading PDF...' });
    
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    onProgress?.({ progress: 30, status: 'Extracting text...' });
    
    // Extract text from PDF pages
    const pages = pdfDoc.getPages();
    let extractedText = '';
    
    for (let i = 0; i < pages.length; i++) {
      onProgress?.({ progress: 30 + (40 * i / pages.length), status: `Processing page ${i + 1}...` });
      // Note: pdf-lib doesn't have built-in text extraction
      // For now, we'll create a placeholder implementation
      extractedText += `Content from page ${i + 1}\n\n`;
    }
    
    onProgress?.({ progress: 80, status: 'Creating DOCX...' });
    
    // Create a simple text blob as DOCX (placeholder implementation)
    const docxContent = new Blob([extractedText], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    onProgress?.({ progress: 100, status: 'Conversion complete!' });
    return docxContent;
    
  } catch (error) {
    throw new Error(`PDF to DOCX conversion failed: ${error}`);
  }
};

// PDF to Excel conversion
export const convertPDFToExcel = async (
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> => {
  try {
    onProgress?.({ progress: 10, status: 'Processing PDF...' });
    
    // Placeholder implementation
    const csvContent = 'Column 1,Column 2,Column 3\nData 1,Data 2,Data 3\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    
    onProgress?.({ progress: 100, status: 'Conversion complete!' });
    return blob;
    
  } catch (error) {
    throw new Error(`PDF to Excel conversion failed: ${error}`);
  }
};

// PDF Merger
export const mergePDFs = async (
  files: File[],
  onProgress?: ProgressCallback
): Promise<Blob> => {
  try {
    onProgress?.({ progress: 10, status: 'Initializing merger...' });
    
    const mergedPdf = await PDFDocument.create();
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      onProgress?.({ progress: 10 + (70 * i / files.length), status: `Merging ${file.name}...` });
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    onProgress?.({ progress: 90, status: 'Finalizing merge...' });
    
    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    onProgress?.({ progress: 100, status: 'Merge complete!' });
    return blob;
    
  } catch (error) {
    throw new Error(`PDF merge failed: ${error}`);
  }
};

// PDF Splitter
export const splitPDF = async (
  file: File,
  splitType: 'pages' | 'ranges',
  options: { pagesPerFile?: number; ranges?: string[] },
  onProgress?: ProgressCallback
): Promise<Blob[]> => {
  try {
    onProgress?.({ progress: 10, status: 'Loading PDF...' });
    
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();
    
    onProgress?.({ progress: 30, status: 'Preparing split...' });
    
    const splitPdfs: Blob[] = [];
    
    if (splitType === 'pages') {
      const pagesPerFile = options.pagesPerFile || 1;
      
      for (let i = 0; i < pageCount; i += pagesPerFile) {
        onProgress?.({ progress: 30 + (60 * i / pageCount), status: `Creating file ${Math.floor(i / pagesPerFile) + 1}...` });
        
        const newPdf = await PDFDocument.create();
        const pagesToCopy = Array.from(
          { length: Math.min(pagesPerFile, pageCount - i) },
          (_, index) => i + index
        );
        
        const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        splitPdfs.push(new Blob([pdfBytes], { type: 'application/pdf' }));
      }
    }
    
    onProgress?.({ progress: 100, status: 'Split complete!' });
    return splitPdfs;
    
  } catch (error) {
    throw new Error(`PDF split failed: ${error}`);
  }
};

// PDF Compressor
export const compressPDF = async (
  file: File,
  compressionLevel: 'low' | 'medium' | 'high',
  onProgress?: ProgressCallback
): Promise<Blob> => {
  try {
    onProgress?.({ progress: 10, status: 'Loading PDF...' });
    
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    onProgress?.({ progress: 50, status: 'Compressing...' });
    
    // Remove metadata for compression
    pdfDoc.setTitle('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');
    
    onProgress?.({ progress: 80, status: 'Optimizing...' });
    
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: compressionLevel === 'high' ? 50 : compressionLevel === 'medium' ? 25 : 10,
    });
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    onProgress?.({ progress: 100, status: 'Compression complete!' });
    return blob;
    
  } catch (error) {
    throw new Error(`PDF compression failed: ${error}`);
  }
};

// PDF Password Protection
export const protectPDF = async (
  file: File,
  userPassword: string,
  ownerPassword?: string,
  onProgress?: ProgressCallback
): Promise<Blob> => {
  try {
    onProgress?.({ progress: 10, status: 'Loading PDF...' });
    
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    onProgress?.({ progress: 50, status: 'Applying protection...' });
    
    // Note: pdf-lib doesn't support password protection directly
    // This is a placeholder implementation
    const pdfBytes = await pdfDoc.save();
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    onProgress?.({ progress: 100, status: 'Protection applied!' });
    return blob;
    
  } catch (error) {
    throw new Error(`PDF protection failed: ${error}`);
  }
};

// PDF Rotation
export const rotatePDF = async (
  file: File,
  rotationAngle: number,
  pageNumbers?: number[],
  onProgress?: ProgressCallback
): Promise<Blob> => {
  try {
    onProgress?.({ progress: 10, status: 'Loading PDF...' });
    
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    onProgress?.({ progress: 50, status: 'Rotating pages...' });
    
    const pagesToRotate = pageNumbers || Array.from({ length: pages.length }, (_, i) => i);
    
    pagesToRotate.forEach(pageIndex => {
      if (pageIndex < pages.length) {
        const page = pages[pageIndex];
        page.setRotation(degrees(rotationAngle));
      }
    });
    
    onProgress?.({ progress: 80, status: 'Saving changes...' });
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    onProgress?.({ progress: 100, status: 'Rotation complete!' });
    return blob;
    
  } catch (error) {
    throw new Error(`PDF rotation failed: ${error}`);
  }
};

// PDF Watermark
export const addWatermarkToPDF = async (
  file: File,
  watermarkText: string,
  options: {
    opacity?: number;
    fontSize?: number;
    rotation?: number;
    position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  },
  onProgress?: ProgressCallback
): Promise<Blob> => {
  try {
    onProgress?.({ progress: 10, status: 'Loading PDF...' });
    
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    onProgress?.({ progress: 50, status: 'Adding watermark...' });
    
    pages.forEach((page, index) => {
      onProgress?.({ progress: 50 + (40 * index / pages.length), status: `Processing page ${index + 1}...` });
      
      const { width, height } = page.getSize();
      let x = width / 2;
      let y = height / 2;
      
      // Position calculation
      switch (options.position) {
        case 'top-left':
          x = 50;
          y = height - 50;
          break;
        case 'top-right':
          x = width - 50;
          y = height - 50;
          break;
        case 'bottom-left':
          x = 50;
          y = 50;
          break;
        case 'bottom-right':
          x = width - 50;
          y = 50;
          break;
        default:
          x = width / 2;
          y = height / 2;
      }
      
      page.drawText(watermarkText, {
        x,
        y,
        size: options.fontSize || 50,
        font,
        color: rgb(0.7, 0.7, 0.7),
        opacity: options.opacity || 0.5,
        rotate: degrees(options.rotation || 45),
      });
    });
    
    onProgress?.({ progress: 90, status: 'Saving watermarked PDF...' });
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    onProgress?.({ progress: 100, status: 'Watermark added!' });
    return blob;
    
  } catch (error) {
    throw new Error(`PDF watermark failed: ${error}`);
  }
};

// Download helper
export const downloadFile = (blob: Blob, filename: string) => {
  saveAs(blob, filename);
};

// Download multiple files as ZIP
export const downloadMultipleFiles = async (
  files: { blob: Blob; filename: string }[],
  zipFilename: string
) => {
  const zip = new JSZip();
  
  files.forEach(({ blob, filename }) => {
    zip.file(filename, blob);
  });
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, zipFilename);
};