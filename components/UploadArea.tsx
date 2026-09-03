import { useCallback } from "react";
import { Card } from "./ui/card";
import { CloudUpload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface UploadAreaProps {
  onImageUpload: (file: File) => void;
  error?: string;
}

export function UploadArea({ onImageUpload, error }: UploadAreaProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        if (file.size <= 5 * 1024 * 1024) {
          onImageUpload(file);
        }
      }
    },
    [onImageUpload]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <Card
        className="border-2 border-dashed border-[#667EEA] bg-white/50 backdrop-blur-sm hover:border-[#764BA2] hover:bg-white/70 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <div className="p-12 text-center">
          <CloudUpload className="w-10 h-10 mx-auto mb-4 text-[#667EEA]" />
          <p className="text-[#2D3748] mb-2">
            Drag and drop an image, or click to browse
          </p>
          <p className="text-sm text-[#2D3748]/60">
            JPG or PNG, up to 5MB
          </p>
        </div>
      </Card>

      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />

      {error && (
        <Alert variant="destructive" className="mt-4 bg-[#ED8936]/10 border-[#ED8936]">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
