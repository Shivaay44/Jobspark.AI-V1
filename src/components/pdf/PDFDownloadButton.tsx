import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { generateAndDownloadPDF } from "../../services/pdfService";

interface Props {
  fileName: string;
  document: React.ReactElement;
}

export default function PDFDownloadButton({
  fileName,
  document,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [downloads, setDownloads] = useState<number>(() => {
    return Number(localStorage.getItem("jobspark_downloads") || 0);
  });

  const handleDownload = async () => {
    if (loading) return;
    const currentDownloads = Number(localStorage.getItem("jobspark_downloads") || 0);

    if (currentDownloads >= 10) {
      toast.error("Beta download limit reached.");
      return;
    }

    const toastId = toast.loading("Preparing and transmitting your high-quality PDF Resume...");
    try {
      setLoading(true);

      await generateAndDownloadPDF({
        fileName,
        document,
      });

      const nextDownloads = currentDownloads + 1;
      localStorage.setItem("jobspark_downloads", String(nextDownloads));
      setDownloads(nextDownloads);

      toast.success("PDF downloaded successfully", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error(
        "Unable to generate PDF. Please try a simpler template or regenerate the resume.",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  const remaining = Math.max(0, 10 - downloads);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/30 cursor-pointer text-white hover:brightness-110 disabled:opacity-50"
      >
        {loading ? (
          "Generating PDF..."
        ) : (
          <>
            <Download className="w-6 h-6 text-white" />
            Download PDF
          </>
        )}
      </button>
      <p className="text-sm text-slate-500 text-center mt-1">
        {remaining} PDF downloads remaining
      </p>
    </div>
  );
}
