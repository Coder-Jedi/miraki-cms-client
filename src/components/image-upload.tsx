
import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string | null) => void;
  endpoint: "artwork" | "artist" | "banner";
}

export function ImageUpload({ value, onChange, endpoint }: ImageUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Mock image upload - in a real app this would upload to your storage service
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a data URL for preview
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
          toast({
            title: "Image uploaded",
            description: "The image was uploaded successfully.",
          });
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 2MB.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    
    uploadImage(file);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
          <img 
            src={value} 
            alt="Uploaded image" 
            className="h-full w-full object-cover"
          />
          <Button
            onClick={handleRemove}
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-md border-muted-foreground/25 cursor-pointer hover:bg-muted/50 transition">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              SVG, PNG, JPG or GIF (max. 2MB)
            </p>
          </div>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
      
      {isUploading && (
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <div className="bg-primary h-2.5 animate-pulse"></div>
        </div>
      )}
    </div>
  );
}
