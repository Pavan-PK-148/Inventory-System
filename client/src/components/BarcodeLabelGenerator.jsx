import { jsPDF } from 'jspdf';
import bwipjs from 'bwip-js';
import toast from 'react-hot-toast';

/**
 * Generates an industry-standard 4x2 inch thermal asset sticker PDF
 * @param {Object} product - The complete product entity schema model
 */
export const generateAssetLabelPDF = async (product) => {
  if (!product.barcode) {
    toast.error(`Cannot generate label: No barcode signature mapped to "${product.name}".`);
    return;
  }

  const loadToastId = toast.loading(`Compiling thermal asset matrix for ${product.sku}...`);

  try {
    // 1. Create a 4x2 inch bounding container format vector page
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: [4, 2] // Standard physical distribution warehouse sticker sizes
    });

    // 2. Structural Template Borders and App Branding Header
    doc.setDrawColor('#cbd5e1'); // Slate 300
    doc.setLineWidth(0.015);
    doc.rect(0.1, 0.1, 3.8, 1.8); // Outer design boundary buffer frame

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor('#0f172a'); // Slate 900
    doc.text('STOCKFLOW ENTERPRISE', 0.25, 0.35);

    // Dynamic Warehouse Location Tracking Tag (Right Aligned)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setFillColor('#f1f5f9'); // Slate 100
    doc.rect(2.4, 0.2, 1.35, 0.22, 'F');
    doc.setTextColor('#475569'); // Slate 600
    doc.text(`LOC: ${product.warehouseLocation.toUpperCase()}`, 2.45, 0.35);

    // Divider Line Matrix rule
    doc.setDrawColor('#e2e8f0'); // Slate 200
    doc.line(0.25, 0.48, 3.75, 0.48);

    // 3. Product Descriptive Details Metadata
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor('#0284c7'); // Primary Accents
    doc.text(product.name.substring(0, 32), 0.25, 0.7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor('#64748b'); // Slate 500
    doc.text(`SKU Ref:`, 0.25, 0.9);
    doc.setFont('courier', 'bold');
    doc.setTextColor('#334155');
    doc.text(product.sku, 0.9, 0.9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor('#64748b');
    doc.text(`Category:`, 0.25, 1.05);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#334155');
    doc.text(product.category, 0.9, 1.05);

    // 4. Generate the Alphanumeric Code-128 Barcode Symbol Array
    // Create an unrendered canvas window layer pointer dynamically
    const canvas = document.createElement('canvas');
    
    await bwipjs.toCanvas(canvas, {
      bcid: 'code128',          // Core logistics industry linear symbology standard
      text: product.barcode,     // Raw signature payload
      scale: 4,                  // Sharp high-DPI scaling matrix
      height: 12,                // Bar heights layout
      includetext: true,         // Show human-readable characters at base
      textfont: 'Courier',
      textsize: 8,
      textyalign: 'center',
      paddingtop: 2
    });

    // Convert raw raster pixel matrix arrays to Base64 image streams safely
    const barcodeImageStream = canvas.toDataURL('image/png');

    // Inject optical asset stream image inside the PDF document layout structure
    doc.addImage(barcodeImageStream, 'PNG', 0.25, 1.15, 3.5, 0.58);

    // 5. Trigger download file transmission directly to browser framework runtime logs
    doc.save(`AssetTag-${product.sku}.pdf`);
    
    toast.success('Thermal tag matrix downloaded successfully.', { id: loadToastId });
  } catch (error) {
    console.error('Barcode PDF generator runtime failure:', error);
    toast.error('Fatal internal exception drawing canvas layout stream pipeline.', { id: loadToastId });
  }
};