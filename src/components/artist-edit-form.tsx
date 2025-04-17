
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
import { ImageUpload } from "@/components/image-upload";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

// Areas for filtering
const areas = ["Kala Ghoda", "Bandra", "Juhu", "Powai", "Andheri"];

interface ArtistEditFormProps {
  artist?: any;
  open: boolean;
  onClose: () => void;
  onSave: (artist: any) => void;
}

export function ArtistEditForm({ artist, open, onClose, onSave }: ArtistEditFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isNew = !artist?.id;
  
  const [form, setForm] = useState({
    name: artist?.name || "",
    bio: artist?.bio || "",
    area: artist?.location?.area || "",
    website: artist?.socialLinks?.website || "",
    instagram: artist?.socialLinks?.instagram || "",
    profileImage: artist?.profileImage || "",
  });
  
  const handleSubmit = () => {
    if (!form.name) {
      toast({
        title: "Validation Error",
        description: "Artist name is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      const updatedArtist = {
        ...artist,
        name: form.name,
        bio: form.bio,
        profileImage: form.profileImage || "https://source.unsplash.com/random/300x300?portrait=new",
        location: {
          area: form.area || "Bandra",
        },
        socialLinks: {
          website: form.website || null,
          instagram: form.instagram || null,
        },
        id: artist?.id || `artist${Date.now()}`, // Generate ID for new artist
        popularity: artist?.popularity || (4 + Math.random()).toFixed(1),
        artworksCount: artist?.artworksCount || 0,
      };
      
      onSave(updatedArtist);
      
      toast({
        title: isNew ? "Artist Created" : "Artist Updated",
        description: `${form.name} has been ${isNew ? "created" : "updated"} successfully.`,
      });
      
      onClose();
    }, 1000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[85vh]">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>{isNew ? "Add New Artist" : "Edit Artist"}</DialogTitle>
            <DialogDescription>
              {isNew 
                ? "Create a new artist profile for the platform." 
                : "Update the artist profile information."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Artist Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                placeholder="Artist biography..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <Select 
                value={form.area}
                onValueChange={(value) => setForm({ ...form, area: value })}
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website (optional)</Label>
                <Input
                  id="website"
                  placeholder="https://artistwebsite.com"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram (optional)</Label>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/artist"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <ImageUpload
                onChange={(url) => setForm({ ...form, profileImage: url || "" })}
                value={form.profileImage}
                endpoint="artist"
              />
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
                isNew ? "Create Artist" : "Update Artist"
              )}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
