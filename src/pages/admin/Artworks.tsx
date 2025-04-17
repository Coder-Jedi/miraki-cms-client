
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArtworkDetail } from "@/components/artwork-detail";
import { ArtworkEditForm } from "@/components/artwork-edit-form";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

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
  description: `This is a detailed description for Artwork ${i + 1}. It showcases the artist's unique style and creative vision. The piece explores themes of nature, human emotions, and contemporary social issues through a vibrant color palette and intricate compositions.`,
}));

export default function Artworks() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [artworks, setArtworks] = useState(mockArtworks);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);

  // Filter artworks based on search query and category
  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = 
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      categoryFilter === "All" || artwork.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateOrUpdateArtwork = (newArtwork: any) => {
    if (newArtwork.id && artworks.some(a => a.id === newArtwork.id)) {
      // Update existing artwork
      setArtworks(artworks.map(artwork => 
        artwork.id === newArtwork.id ? newArtwork : artwork
      ));
    } else {
      // Create new artwork
      setArtworks([newArtwork, ...artworks]);
    }
  };

  const handleDeleteArtwork = () => {
    if (!selectedArtwork) return;
    
    // In a real app, this would call the API
    setArtworks(artworks.filter(artwork => artwork.id !== selectedArtwork.id));
    
    toast({
      title: "Artwork deleted",
      description: `${selectedArtwork.title} has been deleted successfully.`,
    });
    
    setIsDeleteDialogOpen(false);
    setSelectedArtwork(null);
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
    
    const artwork = artworks.find(a => a.id === id);
    if (artwork) {
      toast({
        title: artwork.featured ? "Removed from featured" : "Added to featured",
        description: `${artwork.title} has been ${artwork.featured ? "removed from" : "added to"} featured artworks.`,
      });
    }
  };

  const openViewDialog = (artwork: any) => {
    setSelectedArtwork(artwork);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (artwork: any) => {
    setSelectedArtwork(artwork);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (artwork: any) => {
    setSelectedArtwork(artwork);
    setIsDeleteDialogOpen(true);
  };

  const canManageArtworks = hasPermission("manage_artworks");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artworks</h1>
          <p className="text-muted-foreground">
            Manage all artworks in your Miraki Artistry Hub.
          </p>
        </div>
        {canManageArtworks && (
          <Button 
            className="flex items-center gap-2"
            onClick={() => {
              setSelectedArtwork(null);
              setIsCreateDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Artwork
          </Button>
        )}
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
                    <DropdownMenuItem 
                      className="flex items-center gap-2"
                      onClick={() => openViewDialog(artwork)}
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    
                    {canManageArtworks && (
                      <>
                        <DropdownMenuItem 
                          className="flex items-center gap-2"
                          onClick={() => openEditDialog(artwork)}
                        >
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
                          onClick={() => openDeleteDialog(artwork)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </>
                    )}
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

      {/* View Artwork Dialog */}
      {selectedArtwork && (
        <ArtworkDetail
          artwork={selectedArtwork}
          open={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
        />
      )}

      {/* Create/Edit Artwork Dialog */}
      <ArtworkEditForm
        artwork={isCreateDialogOpen ? undefined : selectedArtwork}
        open={isCreateDialogOpen || isEditDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
        }}
        onSave={handleCreateOrUpdateArtwork}
      />

      {/* Delete Confirmation Dialog */}
      {selectedArtwork && (
        <ConfirmationDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteArtwork}
          title="Delete Artwork"
          description={`Are you sure you want to delete "${selectedArtwork.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />
      )}
    </div>
  );
}
