
import { useState } from "react";
import { 
  MapPin, 
  Instagram, 
  Globe, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  User,
  Star,
  Calendar,
  Mail,
  Phone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ArtistDetailProps {
  artist: any;
  open: boolean;
  onClose: () => void;
}

export function ArtistDetail({ artist, open, onClose }: ArtistDetailProps) {
  const [showContact, setShowContact] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[85vh]">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl">{artist.name}</DialogTitle>
            <DialogDescription className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 inline" />
              <span>{artist.location.area}, Mumbai</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="aspect-square w-full overflow-hidden rounded-lg mb-4">
                  <img
                    src={artist.profileImage}
                    alt={artist.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {artist.artworksCount} {artist.artworksCount === 1 ? 'Artwork' : 'Artworks'}
                    </Badge>
                    
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      {artist.popularity}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowContact(!showContact)}
                    >
                      {showContact ? "Hide Contact" : "Show Contact"}
                      {showContact ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {showContact && (
                    <Card className="mt-2">
                      <CardContent className="p-3 space-y-2 text-sm">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>artist.{artist.id.replace('artist', '')}@example.com</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>+91 98765 4{artist.id.replace('artist', '')}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="flex justify-center space-x-2 mt-4">
                    {artist.socialLinks.instagram && (
                      <a 
                        href={artist.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {artist.socialLinks.website && (
                      <a 
                        href={artist.socialLinks.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Biography</h3>
                    <p className="text-sm text-muted-foreground">
                      {artist.bio}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Artist Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground mr-2">Artist ID:</span>
                          <span>{artist.id}</span>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground mr-2">Area:</span>
                          <Badge variant="outline">{artist.location.area}</Badge>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground mr-2">Joined:</span>
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground mr-2">Popularity:</span>
                          <span>{artist.popularity} / 5.0</span>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground mr-2">Artworks:</span>
                          <span>{artist.artworksCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Recent Artworks</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-3">
                          <p className="text-center text-muted-foreground text-sm py-6">
                            No artworks available
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
