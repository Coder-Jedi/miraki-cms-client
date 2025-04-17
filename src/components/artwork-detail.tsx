
import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  MapPin,
  Star,
  Calendar,
  Tag,
  Info,
  DollarSign,
  User,
  Image as ImageIcon
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

interface ArtworkDetailProps {
  artwork: any;
  open: boolean;
  onClose: () => void;
}

export function ArtworkDetail({ artwork, open, onClose }: ArtworkDetailProps) {
  const [showDetails, setShowDetails] = useState(true);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[85vh]">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl">{artwork.title}</DialogTitle>
            <DialogDescription className="flex items-center">
              <User className="h-3 w-3 mr-1 inline" />
              <span>By {artwork.artist}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 pb-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-md mb-4">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Artwork Info</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {showDetails && (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground mr-2">Year:</span>
                        <span>{artwork.year}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground mr-2">Category:</span>
                        <Badge variant="outline" className="capitalize">
                          {artwork.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground mr-2">Medium:</span>
                        <span>{artwork.medium}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground mr-2">Location:</span>
                        <Badge variant="outline">{artwork.location.area}</Badge>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground mr-2">Price:</span>
                        <span className="font-medium">₹{artwork.price}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground mr-2">Status:</span>
                        <Badge variant={artwork.forSale ? "default" : "secondary"}>
                          {artwork.forSale ? "For Sale" : "Not For Sale"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground mr-2">Featured:</span>
                        <Badge variant={artwork.featured ? "default" : "secondary"}>
                          {artwork.featured ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {artwork.description || "No description available."}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Artist Information</h3>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      {/* Artist avatar placeholder */}
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-3">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      
                      <div>
                        <h4 className="font-medium">{artwork.artist}</h4>
                        <p className="text-sm text-muted-foreground">
                          Artist ID: {artwork.artistId}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Artist Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-4">Other Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Artwork ID:</span> {artwork.id}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span> {new Date().toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Updated:</span> {new Date().toLocaleDateString()}
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
