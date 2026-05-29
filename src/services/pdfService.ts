import { pdf } from "@react-pdf/renderer";
import React from "react";

export interface PDFGenerationOptions {
  fileName: string;
  document: React.ReactElement;
}

function isMobileDevice(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );
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

    // MOBILE FLOW
    if (isMobileDevice()) {
      // Open PDF in new tab
      window.open(url, "_blank");

      return;
    }

    // DESKTOP FLOW
    const link =
      window.document.createElement("a");

    link.href = url;
    link.download = fileName;

    // Append link
    window.document.body.appendChild(link);

    // Trigger download
    link.click();

    // Cleanup
    window.document.body.removeChild(link);

    // Free memory
    URL.revokeObjectURL(url);
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
