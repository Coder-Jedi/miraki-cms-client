import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useArtworks, useCreateArtwork, useUpdateArtwork, useDeleteArtwork, useToggleArtworkFeatured } from "@/hooks/use-artworks";
import { useQueryClient } from "@tanstack/react-query";
import type { Artwork, UpdateArtworkDto } from "@/types";
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
  MoreHorizontal
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

export default function Artworks() {
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  
  // API mutations
  const createArtworkMutation = useCreateArtwork();
  const updateArtworkMutation = useUpdateArtwork(selectedArtwork?._id || "");
  const deleteArtworkMutation = useDeleteArtwork();
  const toggleFeatureMutation = useToggleArtworkFeatured();
  
  // Query for fetching artworks
  const { data: artworks, isLoading } = useArtworks();
  const artworkList = artworks?.data?.items ?? [];

  // Filter artworks based on search query and category
  const filteredArtworks = artworkList.filter((artwork) => {
    const matchesSearch = 
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      categoryFilter === "All" || artwork.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Check permissions
  const canManageArtworks = hasPermission('manage_artworks');
  const canManageOwnArtworks = hasPermission('manage_own_artworks');
  
  // Filter artworks based on permissions
  const accessibleArtworks = filteredArtworks.filter(artwork => {
    if (canManageArtworks) return true;
    if (canManageOwnArtworks && artwork.artistId === user?._id) return true;
    return false;
  });

  const handleCreateOrUpdateArtwork = async (artwork: Partial<Artwork>) => {
    try {
      if (artwork._id) {
        // Convert to UpdateArtworkDto before updating
        const updateDto: UpdateArtworkDto = {
          title: artwork.title,
          artistId: artwork.artistId,
          year: artwork.year,
          medium: artwork.medium,
          dimensions: artwork.dimensions,
          image: artwork.image,
          additionalImages: artwork.additionalImages,
          location: artwork.location,
          price: artwork.price,
          category: artwork.category,
          description: artwork.description,
          featured: artwork.featured,
          forSale: artwork.forSale,
        };
        
        // Update existing artwork with the DTO
        await updateArtworkMutation.mutateAsync({
          id: artwork._id,
          data: updateDto
        });
        
        toast({
          title: "Artwork updated",
          description: `${artwork.title} has been updated successfully.`,
        });
        setIsEditDialogOpen(false);
      } else {
        // Create new artwork
        await createArtworkMutation.mutateAsync(artwork);
        toast({
          title: "Artwork created",
          description: `${artwork.title} has been created successfully.`,
        });
        setIsCreateDialogOpen(false);
      }
      
      // Reset the selected artwork
      setSelectedArtwork(null);
      
      // Manually invalidate the artworks query to ensure fresh data
      queryClient.invalidateQueries(['artworks']);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save artwork';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteArtwork = async () => {
    if (!selectedArtwork) return;
    
    try {
      await deleteArtworkMutation.mutateAsync(selectedArtwork._id);
      toast({
        title: "Artwork deleted",
        description: `${selectedArtwork.title} has been deleted successfully.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedArtwork(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete artwork';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const artwork = artworkList.find(a => a._id === id);
      if (artwork) {
        await toggleFeatureMutation.mutateAsync({ id, featured: !artwork.featured });
        toast({
          title: artwork.featured ? "Removed from featured" : "Added to featured",
          description: `${artwork.title} has been ${artwork.featured ? "removed from" : "added to"} featured artworks.`,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update featured status';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
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
        {accessibleArtworks.map((artwork) => (
          <Card key={artwork._id} className="overflow-hidden">
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
                      onClick={() => {
                        setSelectedArtwork(artwork);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    
                    {canManageArtworks && (
                      <>
                        <DropdownMenuItem 
                          className="flex items-center gap-2"
                          onClick={() => {
                            setSelectedArtwork(artwork);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          className="flex items-center gap-2"
                          onClick={() => handleToggleFeatured(artwork._id)}
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
                          onClick={() => {
                            setSelectedArtwork(artwork);
                            setIsDeleteDialogOpen(true);
                          }}
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
          onOpenChange={setIsDeleteDialogOpen}
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
