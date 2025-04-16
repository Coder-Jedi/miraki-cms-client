
import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  Edit, 
  Trash2, 
  EyeIcon,
  Star,
  StarOff,
  MoreHorizontal,
  Upload
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

// Mock artworks data based on API response structure
const mockArtworks = Array.from({ length: 10 }, (_, i) => ({
  id: `artwork${i + 1}`,
  title: `Artwork ${i + 1}`,
  artist: `Artist ${(i % 3) + 1}`,
  artistId: `artist${(i % 3) + 1}`,
  year: 2023 - (i % 3),
  medium: ["Oil on Canvas", "Acrylic on Paper", "Mixed Media", "Digital Art", "Photography"][i % 5],
  image: `https://source.unsplash.com/random/300x300?art=${i + 1}`,
  price: Math.floor(Math.random() * 5000) + 500,
  category: ["Painting", "Sculpture", "Photography", "Digital Art", "Mixed Media"][i % 5],
  featured: i < 3,
  forSale: i % 4 !== 0,
  location: {
    area: ["Kala Ghoda", "Bandra", "Juhu", "Powai", "Andheri"][i % 5],
  },
}));

// Artwork Categories
const artworkCategories = [
  "All",
  "Painting",
  "Sculpture",
  "Photography",
  "Digital Art",
  "Mixed Media",
  "Ceramics",
  "Illustration",
  "Other",
];

export default function Artworks() {
  const [artworks, setArtworks] = useState(mockArtworks);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    artistId: "",
    year: new Date().getFullYear(),
    medium: "",
    price: "",
    category: "",
    description: "",
    image: "",
    forSale: true,
    featured: false,
  });

  // Filter artworks based on search query and category
  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = 
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      categoryFilter === "All" || artwork.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateArtwork = () => {
    // In a real app, this would call the API
    // Here we're just updating the local state for demo purposes
    const newArtworkItem = {
      id: `artwork${artworks.length + 1}`,
      title: newArtwork.title,
      artist: "New Artist", // This would come from the selected artist
      artistId: newArtwork.artistId,
      year: Number(newArtwork.year),
      medium: newArtwork.medium,
      image: newArtwork.image || "https://source.unsplash.com/random/300x300?art=new",
      price: Number(newArtwork.price),
      category: newArtwork.category as any,
      featured: newArtwork.featured,
      forSale: newArtwork.forSale,
      location: {
        area: "Bandra", // This would be set from the form
      },
    };

    setArtworks([newArtworkItem, ...artworks]);
    setIsCreateDialogOpen(false);
    // Reset form
    setNewArtwork({
      title: "",
      artistId: "",
      year: new Date().getFullYear(),
      medium: "",
      price: "",
      category: "",
      description: "",
      image: "",
      forSale: true,
      featured: false,
    });
  };

  const handleDeleteArtwork = (id: string) => {
    // In a real app, this would call the API
    setArtworks(artworks.filter(artwork => artwork.id !== id));
  };

  const handleToggleFeatured = (id: string) => {
    // In a real app, this would call the API
    setArtworks(
      artworks.map(artwork => 
        artwork.id === id 
          ? { ...artwork, featured: !artwork.featured } 
          : artwork
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artworks</h1>
          <p className="text-muted-foreground">
            Manage all artworks in your Miraki Artistry Hub.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Artwork
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Artwork</DialogTitle>
              <DialogDescription>
                Upload and catalog a new artwork to the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Artwork Title"
                    value={newArtwork.title}
                    onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist">Artist</Label>
                  <Select 
                    onValueChange={(value) => setNewArtwork({ ...newArtwork, artistId: value })}
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
                    value={newArtwork.year}
                    onChange={(e) => setNewArtwork({ ...newArtwork, year: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medium">Medium</Label>
                  <Input
                    id="medium"
                    placeholder="Oil on Canvas"
                    value={newArtwork.medium}
                    onChange={(e) => setNewArtwork({ ...newArtwork, medium: e.target.value })}
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
                    value={newArtwork.price}
                    onChange={(e) => setNewArtwork({ ...newArtwork, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    onValueChange={(value) => setNewArtwork({ ...newArtwork, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {artworkCategories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the artwork..."
                  value={newArtwork.description}
                  onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Artwork Image</Label>
                <ImageUpload
                  onChange={(url) => setNewArtwork({ ...newArtwork, image: url || "" })}
                  value={newArtwork.image}
                  endpoint="artwork"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="forSale"
                    checked={newArtwork.forSale}
                    onChange={(e) => setNewArtwork({ ...newArtwork, forSale: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="forSale">Available for Sale</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newArtwork.featured}
                    onChange={(e) => setNewArtwork({ ...newArtwork, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="featured">Featured Artwork</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateArtwork}>Create Artwork</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artworks..."
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
                <span>Category: {categoryFilter}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {artworkCategories.map((category) => (
                <DropdownMenuItem 
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setCategoryFilter("All");
          }}>
            Clear
          </Button>
        </div>
      </div>

      {/* Artworks Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredArtworks.map((artwork) => (
          <Card key={artwork.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="object-cover w-full h-full"
              />
              {artwork.featured && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary">Featured</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium line-clamp-1">{artwork.title}</h3>
                  <p className="text-sm text-muted-foreground">{artwork.artist}</p>
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
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2"
                      onClick={() => handleToggleFeatured(artwork.id)}
                    >
                      {artwork.featured ? (
                        <>
                          <StarOff className="h-4 w-4" />
                          <span>Remove Featured</span>
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4" />
                          <span>Mark as Featured</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2 text-destructive focus:text-destructive"
                      onClick={() => handleDeleteArtwork(artwork.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {artwork.category}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {artwork.location.area}
                  </Badge>
                </div>
                <p className="font-medium">₹{artwork.price}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
