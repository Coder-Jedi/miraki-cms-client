import { useState, useEffect } from "react";
import { Upload, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string | null>;
  isUploading?: boolean;
  endpoint?: "artist" | "artwork" | "banner"; // Used for analytics or specific handling
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  isUploading = false,
  endpoint,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Simulated progress for better UX when actual progress isn't available
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isUploading) {
      setUploadProgress(0);
      interval = setInterval(() => {
        setUploadProgress(prev => {
          // Stop at 90% until actual upload completes
          if (prev < 90) {
            return prev + 5;
          }
          return prev;
        });
      }, 200);
    } else if (uploadProgress > 0) {
      // When upload completes, show 100%
      setUploadProgress(100);
      // Then reset after showing 100%
      const timeout = setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isUploading, uploadProgress]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPEG, PNG, WebP)");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    try {
      const url = await onUpload(file);
      if (url) {
        onChange(url);
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error("Image upload error:", err);
    }
  };

  const handleRemove = () => {
    onChange("");
    setUploadProgress(0);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-[200px] object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-80 hover:opacity-100"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? "border-primary" : "border-muted"
          } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            id={`image-upload-${endpoint || "default"}`}
            onChange={handleChange}
            disabled={isUploading}
          />
          <label
            htmlFor={`image-upload-${endpoint || "default"}`}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <p>Drag and drop an image, or click to select</p>
              <p className="text-xs mt-1">JPEG, PNG or WebP (max 5MB)</p>
            </div>
          </label>
        </div>
      )}

      {(isUploading || uploadProgress > 0) && (
        <div className="space-y-1">
          <Progress value={uploadProgress} className="w-full h-2" />
          {isUploading && (
            <p className="text-xs text-muted-foreground text-right">
              {uploadProgress}% - Uploading...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
