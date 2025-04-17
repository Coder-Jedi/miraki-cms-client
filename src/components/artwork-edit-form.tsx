
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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

// Artwork Categories
const artworkCategories = [
  "Painting",
  "Sculpture",
  "Photography",
  "Digital Art",
  "Mixed Media",
  "Ceramics",
  "Illustration",
  "Other",
];

// Areas
const areas = ["Kala Ghoda", "Bandra", "Juhu", "Powai", "Andheri"];

interface ArtworkEditFormProps {
  artwork?: any;
  open: boolean;
  onClose: () => void;
  onSave: (artwork: any) => void;
}

export function ArtworkEditForm({ artwork, open, onClose, onSave }: ArtworkEditFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isNew = !artwork?.id;
  
  const [form, setForm] = useState({
    title: artwork?.title || "",
    artistId: artwork?.artistId || "artist1",
    year: artwork?.year || new Date().getFullYear(),
    medium: artwork?.medium || "",
    price: artwork?.price || "",
    category: artwork?.category || "",
    description: artwork?.description || "",
    image: artwork?.image || "",
    forSale: artwork?.forSale ?? true,
    featured: artwork?.featured ?? false,
    location: {
      area: artwork?.location?.area || "Bandra",
    }
  });
  
  const handleSubmit = () => {
    if (!form.title) {
      toast({
        title: "Validation Error",
        description: "Artwork title is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      const updatedArtwork = {
        ...artwork,
        ...form,
        id: artwork?.id || `artwork${Date.now()}`, // Generate ID for new artwork
      };
      
      onSave(updatedArtwork);
      
      toast({
        title: isNew ? "Artwork Created" : "Artwork Updated",
        description: `${form.title} has been ${isNew ? "created" : "updated"} successfully.`,
      });
      
      onClose();
    }, 1000);
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
                <Select 
                  value={form.artistId}
                  onValueChange={(value) => setForm({ ...form, artistId: value })}
                >
                  <SelectTrigger id="artist">
                    <SelectValue placeholder="Select Artist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="artist1">Artist 1</SelectItem>
                    <SelectItem value="artist2">Artist 2</SelectItem>
                    <SelectItem value="artist3">Artist 3</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select 
                  value={form.category}
                  onValueChange={(value) => setForm({ ...form, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {artworkCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
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
