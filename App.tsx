import { useState, useEffect, useRef } from "react";
import { HeroSection } from "./components/HeroSection";
import { UploadArea } from "./components/UploadArea";
import {
  ControlPanel,
  PixelArtSettings,
} from "./components/ControlPanel";
import { PreviewArea } from "./components/PreviewArea";
import { FeatureCards } from "./components/FeatureCards";
import { convertToPixelArt } from "./utils/pixelArtConverter.js";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { Footer } from "./components/Footer";

const presetConfigs: Record<
  string,
  Partial<PixelArtSettings>
> = {
  retro: {
    pixelSize: 16,
    colorCount: 16,
    contrast: 1.2,
    dithering: true,
  },
  classic: {
    pixelSize: 12,
    colorCount: 32,
    contrast: 1.0,
    dithering: false,
  },
  detailed: {
    pixelSize: 8,
    colorCount: 48,
    contrast: 1.1,
    dithering: true,
  },
  modern: {
    pixelSize: 10,
    colorCount: 40,
    contrast: 1.3,
    dithering: false,
  },
};

export default function App() {
  const [settings, setSettings] = useState<PixelArtSettings>({
    preset: "retro",
    pixelSize: 16,
    colorCount: 16,
    contrast: 1.2,
    dithering: true,
  });

  const [originalImage, setOriginalImage] = useState<
    string | null
  >(null);
  const [pixelArtImage, setPixelArtImage] = useState<
    string | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [imageElement, setImageElement] =
    useState<HTMLImageElement | null>(null);
  const [scrollY, setScrollY] = useState(0);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (file: File) => {
    setUploadError("");

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      toast.error(
        "File too large. Please choose an image under 5MB.",
      );
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file");
      toast.error("Invalid file type. Please upload an image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(e.target?.result as string);
        setImageElement(img);
        toast.success("Image uploaded successfully!");
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSettingsChange = (
    newSettings: Partial<PixelArtSettings>,
  ) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };

      // If preset changed, apply preset config
      if (
        newSettings.preset &&
        newSettings.preset !== prev.preset
      ) {
        return {
          ...updated,
          ...presetConfigs[newSettings.preset],
        };
      }

      return updated;
    });
  };

  const processImage = async () => {
    if (!imageElement) return;

    setIsProcessing(true);
    try {
      const result = await convertToPixelArt(imageElement, {
        pixelSize: settings.pixelSize,
        colorCount: settings.colorCount,
        contrast: settings.contrast,
        dithering: settings.dithering,
      });
      setPixelArtImage(result);
      toast.success("Pixel art generated!");

      // Smooth scroll to preview area after a short delay
      setTimeout(() => {
        if (previewRef.current) {
          previewRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 400);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Single source of truth for downloading — PreviewArea just calls this.
  const handleDownload = () => {
    if (!pixelArtImage) return;

    const link = document.createElement("a");
    link.href = pixelArtImage;
    link.download = `pixel-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Pixel art downloaded!");
  };

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-process when settings change
  useEffect(() => {
    if (imageElement) {
      const timer = setTimeout(() => {
        processImage();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [settings, imageElement]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F8FAFC] overflow-x-hidden">
      <div className="container mx-auto py-8">
        {/* Hero with parallax effect */}
        <div
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <HeroSection />
        </div>

        <div className="space-y-8">
          {/* Upload area with subtle parallax */}
          <div
            style={{
              transform: `translateY(${scrollY * 0.15}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <UploadArea
              onImageUpload={handleImageUpload}
              error={uploadError}
            />
          </div>

          {originalImage && (
            <>
              {/* Control panel with parallax */}
              <div
                style={{
                  transform: `translateY(${scrollY * 0.1}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                <ControlPanel
                  settings={settings}
                  onSettingsChange={handleSettingsChange}
                />
              </div>

              {/* Preview area - target for auto-scroll */}
              <div ref={previewRef}>
                <PreviewArea
                  originalImage={originalImage}
                  pixelArtImage={pixelArtImage}
                  isProcessing={isProcessing}
                  onDownload={handleDownload}
                />
              </div>
            </>
          )}

          {/* Feature cards with parallax */}
          <div
            style={{
              transform: `translateY(${scrollY * -0.05}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <FeatureCards />
          </div>
        </div>
      </div>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}
