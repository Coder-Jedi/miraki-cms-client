import { useState } from "react";
import { 
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
  Users,
  Plus,
  ArrowUpDown,
  ExternalLink,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArtistDetail } from "@/components/artist-detail";
import { ArtistEditForm } from "@/components/artist-edit-form";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useArtists, useDeleteArtist } from "@/hooks/use-artists";
import { Artist } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function Artists() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<string | null>(null);

  const { toast } = useToast();
  const { data: artistsResponse, isLoading, error } = useArtists({ 
    page: currentPage, 
    search: searchQuery,
    featured: filterType === "Featured" ? true : undefined,
    sortBy: sortField,
    sortOrder: sortDirection,
  });

  const artists = artistsResponse?.data?.items ?? [];
  // Make sure we have a valid pagination object with sensible defaults
  const pagination = {
    page: artistsResponse?.data?.pagination?.page || currentPage,
    pages: artistsResponse?.data?.pagination?.pages || 1,
    total: artistsResponse?.data?.pagination?.total || artists.length,
    perPage: artistsResponse?.data?.pagination?.limit || 20
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleView = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsDetailOpen(true);
  };

  const handleEdit = (artist: Artist | null) => {
    setSelectedArtist(artist);
    setIsEditOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedArtist) return;

    try {
      await deleteArtistMutation.mutateAsync(selectedArtist._id);
      toast({
        title: "Artist deleted",
        description: "The artist has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedArtist(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the artist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card className="border-none shadow-none">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Artworks</TableHead>
                  <TableHead>Popularity</TableHead>
                  <TableHead>Socials</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-12 w-12 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-md ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      );
    }

    if (error) {
      return (
        <Card>
          <div className="p-8 text-center">
            <div className="text-lg font-semibold text-destructive mb-2">
              Failed to load artists
            </div>
            <p className="text-muted-foreground mb-4">
              There was an error loading the artists. Please try again later.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </Card>
      );
    }

    if (artists.length === 0) {
      return (
        <Card>
          <div className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <div className="text-lg font-semibold mb-2">
              No artists found
            </div>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? "No artists match your search criteria. Try adjusting your filters."
                : "Get started by adding your first artist to the platform."}
            </p>
            <Button onClick={() => handleEdit(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Artist
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <Card className="border-none shadow-none">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort('name')}>
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort('location')}>
                      Location
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort('artworkCount')}>
                      Artworks
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort('popularity')}>
                      Popularity
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Socials</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artists.map((artist) => (
                  <TableRow key={artist._id}>
                    <TableCell>
                      {artist.profileImage ? (
                        <img
                          src={artist.profileImage}
                          alt={artist.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {artist.name}
                        {artist.featured && (
                          <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200 flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {artist.location && (
                        <div className="flex items-center text-sm">
                          <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {artist.location?.area || "N/A"}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {artist.artworks?.length ? (
                        <Badge variant="secondary" className="font-normal">
                          {artist.artworks.length}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {artist.popularity ? (
                        <Badge variant="outline" className="font-normal">
                          {artist.popularity}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {artist.socialLinks?.website && (
                          <a
                            href={artist.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                            title="Website"
                          >
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                        {artist.socialLinks?.instagram && (
                          <a
                            href={artist.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                            title="Instagram"
                          >
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem onClick={() => handleView(artist)} className="cursor-pointer">
                            <EyeIcon className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(artist)} className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedArtist(artist);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="cursor-pointer text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Always show pagination for testing */}
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Math.max(1, currentPage - 1));
                  }}
                  aria-disabled={currentPage <= 1}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: pagination.pages }).map((_, i) => {
                const pageNum = i + 1;
                // Show current page, first, last, and one page before/after current
                if (
                  pageNum === 1 ||
                  pageNum === pagination.pages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                        isActive={pageNum === currentPage}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  (pageNum === 2 && currentPage > 3) ||
                  (pageNum === pagination.pages - 1 && currentPage < pagination.pages - 2)
                ) {
                  return <PaginationItem key={pageNum}><PaginationEllipsis /></PaginationItem>;
                }
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Math.min(pagination.pages, currentPage + 1));
                  }}
                  aria-disabled={currentPage >= pagination.pages}
                  className={currentPage >= pagination.pages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artists</h1>
          <p className="text-muted-foreground">
            Manage artists and their profiles on your platform.
          </p>
        </div>
        <Button onClick={() => handleEdit(null)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Artist
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterType(null)}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Most Popular")}>Most Popular</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Recently Added")}>Recently Added</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Most Artworks")}>Most Artworks</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Featured")}>Featured</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {renderContent()}

      {selectedArtist && (
        <>
          <ArtistDetail
            artist={selectedArtist}
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
          />
          <ArtistEditForm
            artist={selectedArtist}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
          />
        </>
      )}

      {!selectedArtist && (
        <ArtistEditForm
          artist={null}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Artist"
        description="Are you sure you want to delete this artist? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
