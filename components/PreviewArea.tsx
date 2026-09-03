import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Download, Loader2 } from "lucide-react";

interface PreviewAreaProps {
  originalImage: string | null;
  pixelArtImage: string | null;
  isProcessing: boolean;
  onDownload?: () => void;
}

export function PreviewArea({
  originalImage,
  pixelArtImage,
  isProcessing,
  onDownload,
}: PreviewAreaProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (pixelArtImage && !isProcessing) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [pixelArtImage, isProcessing]);

  if (!originalImage) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Image */}
        <Card className="overflow-hidden bg-white shadow-lg">
          <div className="p-4 border-b">
            <h3>Original</h3>
          </div>
          <div className="p-6 flex items-center justify-center bg-[#F8FAFC] min-h-[300px]">
            <img
              src={originalImage}
              alt="Original"
              className="max-w-full h-auto rounded-lg shadow-md"
              style={{ imageRendering: "auto" }}
            />
          </div>
        </Card>

        {/* Pixel Art Result */}
        <Card
          className={`overflow-hidden bg-white shadow-lg transition-all duration-500 ${
            showAnimation ? "scale-105 shadow-2xl" : ""
          }`}
        >
          <div className="p-4 border-b">
            <h3>{isProcessing ? "Processing..." : "Result"}</h3>
          </div>
          <div className="p-6 flex items-center justify-center bg-[#F8FAFC] min-h-[300px]">
            {isProcessing ? (
              <Loader2 className="w-10 h-10 animate-spin text-[#667EEA]" />
            ) : pixelArtImage ? (
              <img
                src={pixelArtImage}
                alt="Pixel Art"
                className={`max-w-full h-auto rounded-lg shadow-md transition-all duration-700 ${
                  showAnimation ? "scale-110" : "scale-100"
                }`}
                style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <p className="text-[#2D3748]/60">
                Adjust settings to generate pixel art
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Download Button */}
      {pixelArtImage && !isProcessing && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => onDownload?.()}
            size="lg"
            className="bg-[#667EEA] hover:bg-[#667EEA]/90 text-white px-8"
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>
        </div>
      )}
    </div>
  );
}
