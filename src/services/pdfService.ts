import { pdf } from "@react-pdf/renderer";
import React from "react";

export interface PDFGenerationOptions {
  fileName: string;
  document: React.ReactElement;
}

export async function generateAndDownloadPDF({
  fileName,
  document,
}: PDFGenerationOptions): Promise<void> {
  try {
    // Generate PDF blob
    const blob = await pdf(document).toBlob();

    // Create temporary URL
    const url = URL.createObjectURL(blob);

    // UNIFIED COMPATIBILITY DOWNLOAD FLOW (Desktop & Mobile)
    const link = window.document.createElement("a");
    link.href = url;
    link.download = fileName;

    // Append to body to ensure compatibility in all browsers/rendering engines
    window.document.body.appendChild(link);

    // Trigger download directly (avoids popup-blocking by using a link interaction)
    link.click();

    // Small delay before removing the element to guarantee browser registration
    setTimeout(() => {
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 150);
  } catch (error) {
    console.error(
      "PDF generation failed:",
      error
    );

    throw new Error(
      "Unable to generate PDF."
    );
  }
}
