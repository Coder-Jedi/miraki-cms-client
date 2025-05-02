import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Artist, Artwork } from "@/types";
import { useArtworksByArtist } from "@/hooks/use-artworks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Globe, Instagram, Twitter, Facebook, Users, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface ArtistDetailProps {
  artist: Artist;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArtistDetail({ artist, open, onOpenChange }: ArtistDetailProps) {
  const { data: artworksResponse, isLoading: isLoadingArtworks } = useArtworksByArtist(artist._id);
  const artworks = artworksResponse?.data?.items || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Artist Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            {/* Artist Profile */}
            <div className="flex items-start gap-4">
              {artist.profileImage ? (
                <img
                  src={artist.profileImage}
                  alt={artist.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              
              <div>
                <h2 className="text-2xl font-semibold">{artist.name}</h2>
                {artist.location && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {artist.location.area && ` • ${artist.location.area}`}
                  </div>
                )}
                
                <div className="flex items-center gap-3 mt-3">
                  {artist.socialLinks?.website && (
                    <a
                      href={artist.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                  {artist.socialLinks?.instagram && (
                    <a
                      href={artist.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {artist.socialLinks?.twitter && (
                    <a
                      href={artist.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {artist.socialLinks?.facebook && (
                    <a
                      href={artist.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {artist.bio && (
              <div>
                <h3 className="font-semibold mb-2">Bio</h3>
                <p className="text-muted-foreground">{artist.bio}</p>
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-3">
              {artist.popularity && (
                <Badge variant="secondary">
                  Popularity: {artist.popularity}
                </Badge>
              )}
              {artist.featured && (
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                  Featured
                </Badge>
              )}
              <Badge variant="secondary">
                {artworks?.length || artist.artworks?.length || 0} Artworks
              </Badge>
            </div>

            {/* Artworks */}
            <div>
              <h3 className="font-semibold mb-3">Artworks</h3>
              {isLoadingArtworks ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-[200px] rounded-lg" />
                  ))}
                </div>
              ) : artworks?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {artworks?.map((artwork: Artwork) => (
                    <Card key={artwork._id}>
                      <CardContent className="p-2">
                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          className="w-full h-[150px] object-cover rounded-md"
                        />
                        <div className="mt-2">
                          <h4 className="font-medium text-sm truncate">
                            {artwork.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {artwork.category} • {artwork.year}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No artworks found.</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
