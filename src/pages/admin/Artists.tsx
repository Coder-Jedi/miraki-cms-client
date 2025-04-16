
import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  Edit, 
  Trash2, 
  EyeIcon,
  MoreHorizontal,
  MapPin,
  Instagram,
  Globe,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/image-upload";

// Mock artists data based on API response structure
const mockArtists = Array.from({ length: 9 }, (_, i) => ({
  id: `artist${i + 1}`,
  name: `Artist ${i + 1}`,
  bio: `Artist ${i + 1} is a contemporary ${
    ['painter', 'sculptor', 'photographer', 'digital artist', 'illustrator'][i % 5]
  } whose work explores various themes through ${
    ['vibrant colors', 'bold strokes', 'minimalist compositions', 'intricate details', 'innovative techniques'][i % 5]
  }.`,
  profileImage: `https://source.unsplash.com/random/300x300?portrait=${i + 1}`,
  location: {
    area: ["Kala Ghoda", "Bandra", "Juhu", "Powai", "Andheri"][i % 5],
  },
  socialLinks: {
    website: i % 3 === 0 ? `https://artist${i+1}.com` : null,
    instagram: `https://instagram.com/artist${i+1}`,
  },
  popularity: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
  artworksCount: Math.floor(Math.random() * 20) + 1,
}));

// Areas for filtering
const areas = ["All Areas", "Kala Ghoda", "Bandra", "Juhu", "Powai", "Andheri"];

export default function Artists() {
  const [artists, setArtists] = useState(mockArtists);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState("All Areas");
  const [newArtist, setNewArtist] = useState({
    name: "",
    bio: "",
    area: "",
    website: "",
    instagram: "",
    profileImage: "",
  });

  // Filter artists based on search query and area
  const filteredArtists = artists.filter((artist) => {
    const matchesSearch = 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = 
      areaFilter === "All Areas" || artist.location.area === areaFilter;
    return matchesSearch && matchesArea;
  });

  const handleCreateArtist = () => {
    // In a real app, this would call the API
    // Here we're just updating the local state for demo purposes
    const newArtistItem = {
      id: `artist${artists.length + 1}`,
      name: newArtist.name,
      bio: newArtist.bio,
      profileImage: newArtist.profileImage || "https://source.unsplash.com/random/300x300?portrait=new",
      location: {
        area: newArtist.area || "Bandra",
      },
      socialLinks: {
        website: newArtist.website || null,
        instagram: newArtist.instagram || null,
      },
      popularity: "4.0",
      artworksCount: 0,
    };

    setArtists([newArtistItem, ...artists]);
    setIsCreateDialogOpen(false);
    // Reset form
    setNewArtist({
      name: "",
      bio: "",
      area: "",
      website: "",
      instagram: "",
      profileImage: "",
    });
  };

  const handleDeleteArtist = (id: string) => {
    // In a real app, this would call the API
    setArtists(artists.filter(artist => artist.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artists</h1>
          <p className="text-muted-foreground">
            Manage all artists in your Miraki Artistry Hub.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Artist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Artist</DialogTitle>
              <DialogDescription>
                Create a new artist profile for the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Artist Name"
                  value={newArtist.name}
                  onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  placeholder="Artist biography..."
                  value={newArtist.bio}
                  onChange={(e) => setNewArtist({ ...newArtist, bio: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Select 
                  onValueChange={(value) => setNewArtist({ ...newArtist, area: value })}
                >
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.slice(1).map((area) => (
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
                    value={newArtist.website}
                    onChange={(e) => setNewArtist({ ...newArtist, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram (optional)</Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/artist"
                    value={newArtist.instagram}
                    onChange={(e) => setNewArtist({ ...newArtist, instagram: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <ImageUpload
                  onChange={(url) => setNewArtist({ ...newArtist, profileImage: url || "" })}
                  value={newArtist.profileImage}
                  endpoint="artist"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateArtist}>Create Artist</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artists..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Area: {areaFilter}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {areas.map((area) => (
                <DropdownMenuItem 
                  key={area}
                  onClick={() => setAreaFilter(area)}
                >
                  {area}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setAreaFilter("All Areas");
          }}>
            Clear
          </Button>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArtists.map((artist) => (
          <Card key={artist.id} className="overflow-hidden">
            <div className="relative h-[260px]">
              <img
                src={artist.profileImage}
                alt={artist.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium line-clamp-1">{artist.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{artist.location.area}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mr-2">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <EyeIcon className="h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2 text-destructive focus:text-destructive"
                      onClick={() => handleDeleteArtist(artist.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm line-clamp-2 mb-3">{artist.bio}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3 mr-1" />
                    {artist.artworksCount} {artist.artworksCount === 1 ? 'Artwork' : 'Artworks'}
                  </Badge>
                  <div className="flex items-center text-sm">
                    <span className="text-yellow-500 mr-1">★</span>
                    {artist.popularity}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {artist.socialLinks.instagram && (
                    <a 
                      href={artist.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {artist.socialLinks.website && (
                    <a 
                      href={artist.socialLinks.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
