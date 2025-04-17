
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArtistDetail } from "@/components/artist-detail";
import { ArtistEditForm } from "@/components/artist-edit-form";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

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
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [artists, setArtists] = useState(mockArtists);
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState("All Areas");
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);

  // Filter artists based on search query and area
  const filteredArtists = artists.filter((artist) => {
    const matchesSearch = 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = 
      areaFilter === "All Areas" || artist.location.area === areaFilter;
    return matchesSearch && matchesArea;
  });

  const handleCreateOrUpdateArtist = (newArtist: any) => {
    if (newArtist.id && artists.some(a => a.id === newArtist.id)) {
      // Update existing artist
      setArtists(artists.map(artist => 
        artist.id === newArtist.id ? newArtist : artist
      ));
    } else {
      // Create new artist
      setArtists([newArtist, ...artists]);
    }
  };

  const handleDeleteArtist = () => {
    if (!selectedArtist) return;
    
    // In a real app, this would call the API
    setArtists(artists.filter(artist => artist.id !== selectedArtist.id));
    
    toast({
      title: "Artist deleted",
      description: `${selectedArtist.name} has been deleted successfully.`,
    });
    
    setIsDeleteDialogOpen(false);
    setSelectedArtist(null);
  };

  const openViewDialog = (artist: any) => {
    setSelectedArtist(artist);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (artist: any) => {
    setSelectedArtist(artist);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (artist: any) => {
    setSelectedArtist(artist);
    setIsDeleteDialogOpen(true);
  };

  const canManageArtists = hasPermission("manage_artists");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artists</h1>
          <p className="text-muted-foreground">
            Manage all artists in your Miraki Artistry Hub.
          </p>
        </div>
        {canManageArtists && (
          <Button 
            className="flex items-center gap-2"
            onClick={() => {
              setSelectedArtist(null);
              setIsCreateDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Artist
          </Button>
        )}
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
                    <DropdownMenuItem 
                      className="flex items-center gap-2"
                      onClick={() => openViewDialog(artist)}
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    
                    {canManageArtists && (
                      <>
                        <DropdownMenuItem 
                          className="flex items-center gap-2"
                          onClick={() => openEditDialog(artist)}
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-destructive focus:text-destructive"
                          onClick={() => openDeleteDialog(artist)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </>
                    )}
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

      {/* View Artist Dialog */}
      {selectedArtist && (
        <ArtistDetail
          artist={selectedArtist}
          open={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
        />
      )}

      {/* Create/Edit Artist Dialog */}
      <ArtistEditForm
        artist={isCreateDialogOpen ? undefined : selectedArtist}
        open={isCreateDialogOpen || isEditDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
        }}
        onSave={handleCreateOrUpdateArtist}
      />

      {/* Delete Confirmation Dialog */}
      {selectedArtist && (
        <ConfirmationDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteArtist}
          title="Delete Artist"
          description={`Are you sure you want to delete "${selectedArtist.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />
      )}
    </div>
  );
}
