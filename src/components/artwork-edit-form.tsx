import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useArtists } from "@/hooks/use-artists";
import { useArtworkCategories, useArtworkAreas, useUploadArtworkImage } from "@/hooks/use-artworks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/image-upload";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ArtworkEditFormProps {
  artwork?: any;
  open: boolean;
  onClose: () => void;
  onSave: (artwork: any) => void;
}

export function ArtworkEditForm({ artwork, open, onClose, onSave }: ArtworkEditFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isNew = !artwork?._id;
  
  // Fetch artists, categories, and areas from API
  const { data: artistsData, isLoading: isLoadingArtists } = useArtists();
  const { data: categoriesData, isLoading: isLoadingCategories } = useArtworkCategories();
  const { data: areasData, isLoading: isLoadingAreas } = useArtworkAreas();
  const uploadImageMutation = useUploadArtworkImage();
  
  // Get the data from the API responses
  const artists = artistsData?.data?.items || [];
  const categories = categoriesData?.data?.categories || [];
  const areas = areasData?.data?.areas || [];
  
  const [form, setForm] = useState({
    title: artwork?.title || "",
    artistId: artwork?.artistId || "",
    year: artwork?.year || new Date().getFullYear(),
    medium: artwork?.medium || "",
    price: artwork?.price || "",
    category: artwork?.category || "",
    description: artwork?.description || "",
    image: artwork?.image || "",
    forSale: artwork?.forSale ?? true,
    featured: artwork?.featured ?? false,
    location: {
      area: artwork?.location?.area || "",
    }
  });

  // If the artwork prop changes, update the form
  useEffect(() => {
    if (artwork) {
      setForm({
        title: artwork.title || "",
        artistId: artwork.artistId || "",
        year: artwork.year || new Date().getFullYear(),
        medium: artwork.medium || "",
        price: artwork.price || "",
        category: artwork.category || "",
        description: artwork.description || "",
        image: artwork.image || "",
        forSale: artwork.forSale ?? true,
        featured: artwork.featured ?? false,
        location: {
          area: artwork.location?.area || "",
        }
      });
    }
  }, [artwork]);
  
  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadImageMutation.mutateAsync({
        file,
        onProgress: (progress) => {
          console.log(`Upload progress: ${progress}%`);
        }
      });
      
      // Store both url and key from the API response
      if (result.data) {
        setForm({
          ...form,
          image: result.data.url,
        });
        return result.data.url;
      }
      return null;
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const handleSubmit = async () => {
    if (!form.title) {
      toast({
        title: "Validation Error",
        description: "Artwork title is required",
        variant: "destructive",
      });
      return;
    }

    if (!form.artistId) {
      toast({
        title: "Validation Error",
        description: "Please select an artist",
        variant: "destructive",
      });
      return;
    }

    if (!form.category) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updatedArtwork = {
        ...artwork,
        ...form,
        price: Number(form.price),
        year: Number(form.year),
      };
      
      onSave(updatedArtwork);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save artwork. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[85vh]">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>{isNew ? "Create New Artwork" : "Edit Artwork"}</DialogTitle>
            <DialogDescription>
              {isNew 
                ? "Upload and catalog a new artwork to the platform." 
                : "Update the artwork details and properties."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Artwork Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist</Label>
                {isLoadingArtists ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select 
                    value={form.artistId}
                    onValueChange={(value) => setForm({ ...form, artistId: value })}
                  >
                    <SelectTrigger id="artist">
                      <SelectValue placeholder="Select Artist" />
                    </SelectTrigger>
                    <SelectContent>
                      {artists.map((artist) => (
                        <SelectItem key={artist._id} value={artist._id}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="Year"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium">Medium</Label>
                <Input
                  id="medium"
                  placeholder="Oil on Canvas"
                  value={form.medium}
                  onChange={(e) => setForm({ ...form, medium: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                {isLoadingCategories ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select 
                    value={form.category}
                    onValueChange={(value) => setForm({ ...form, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              {isLoadingAreas ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select 
                  value={form.location.area}
                  onValueChange={(value) => setForm({ 
                    ...form, 
                    location: { ...form.location, area: value } 
                  })}
                >
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the artwork..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Artwork Image</Label>
              <ImageUpload
                onChange={(url) => setForm({ ...form, image: url || "" })}
                value={form.image}
                endpoint="artwork"
                onUpload={handleImageUpload}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="forSale"
                  checked={form.forSale}
                  onChange={(e) => setForm({ ...form, forSale: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="forSale">Available for Sale</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="featured">Featured Artwork</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter className="px-6 py-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isNew ? "Creating..." : "Updating..."}
                </>
              ) : (
                isNew ? "Create Artwork" : "Update Artwork"
              )}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
