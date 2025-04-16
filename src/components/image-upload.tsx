
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onChange: (url: string | null) => void;
  onFile?: (file: File | null) => void;
  value?: string;
  disabled?: boolean;
  className?: string;
  endpoint?: "artwork" | "artist" | "banner";
}

export function ImageUpload({
  onChange,
  onFile,
  value,
  disabled,
  className,
  endpoint = "artwork",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the image locally
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      onChange(reader.result as string);
      if (onFile) onFile(file);
    };
    reader.readAsDataURL(file);

    // In a real application, you would upload the file to the server here
    // Example API call (commented out as it's not functional in this demo)
    /*
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    fetch(`https://api.miraki-art.com/v1/admin/upload/${endpoint}`, {
      method: 'POST',
      body: formData,
      // Add auth headers as needed
    })
      .then(response => response.json())
      .then(data => {
        onChange(data.data.url);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        setLoading(false);
      });
    */
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange(null);
    if (onFile) onFile(null);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/20 p-4 transition-all hover:border-primary/50",
        loading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {preview ? (
        <div className="relative w-full h-full min-h-[200px] flex items-center justify-center">
          <img
            src={preview}
            alt="Preview"
            className="max-h-[300px] max-w-full object-contain rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
            disabled={disabled || loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center text-muted-foreground p-6">
            <ImageIcon className="h-10 w-10 mb-2" />
            <p className="text-sm font-medium mb-1">Drag & drop or click to upload</p>
            <p className="text-xs">
              {endpoint === "artwork" && "Upload artwork image (JPG, PNG, WebP)"}
              {endpoint === "artist" && "Upload artist profile (JPG, PNG, WebP)"}
              {endpoint === "banner" && "Upload banner image (JPG, PNG, WebP)"}
            </p>
          </div>
          <label htmlFor={`image-upload-${endpoint}`} className="w-full">
            <div className="flex justify-center">
              <Button 
                type="button" 
                variant="secondary"
                disabled={disabled || loading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
            </div>
            <input
              id={`image-upload-${endpoint}`}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={disabled || loading}
              className="sr-only"
            />
          </label>
        </>
      )}
    </div>
  );
}
