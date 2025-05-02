
import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Star,
  StarOff,
  Palette,
  LayoutGrid,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

// Mock collections data
const mockCollections = [
  {
    id: "collection1",
    title: "Summer Inspirations",
    description: "A curated collection of artworks inspired by the colors and vibrancy of summer.",
    coverImage: "https://source.unsplash.com/random/600x400?summer,art",
    artworks: Array.from({ length: 8 }, (_, i) => `artwork${i + 1}`),
    featured: true,
    priority: 1,
  },
  {
    id: "collection2",
    title: "Urban Landscapes",
    description: "Contemporary interpretations of city life and urban environments.",
    coverImage: "https://source.unsplash.com/random/600x400?urban,landscape",
    artworks: Array.from({ length: 6 }, (_, i) => `artwork${i + 10}`),
    featured: true,
    priority: 2,
  },
  {
    id: "collection3",
    title: "Abstract Expressionism",
    description: "Bold and dynamic works focusing on emotional intensity and freedom of expression.",
    coverImage: "https://source.unsplash.com/random/600x400?abstract,art",
    artworks: Array.from({ length: 5 }, (_, i) => `artwork${i + 20}`),
    featured: false,
    priority: 3,
  },
  {
    id: "collection4",
    title: "Traditional Indian Art",
    description: "Classical and folk art traditions from across India.",
    coverImage: "https://source.unsplash.com/random/600x400?indian,art",
    artworks: Array.from({ length: 7 }, (_, i) => `artwork${i + 30}`),
    featured: false,
    priority: 4,
  },
];

export default function ContentCollections() {
  const [collections, setCollections] = useState(mockCollections);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [newCollection, setNewCollection] = useState({
    title: "",
    description: "",
    coverImage: "",
    featured: false,
    artworks: [] as string[],
  });

  const handleCreateCollection = () => {
    // In a real app, this would call the API
    const createdCollection = {
      id: `collection${collections.length + 1}`,
      title: newCollection.title,
      description: newCollection.description,
      coverImage: newCollection.coverImage || "https://source.unsplash.com/random/600x400?art,default",
      artworks: newCollection.artworks,
      featured: newCollection.featured,
      priority: collections.length + 1,
    };

    setCollections([...collections, createdCollection]);
    setIsCreateDialogOpen(false);
    // Reset form
    setNewCollection({
      title: "",
      description: "",
      coverImage: "",
      featured: false,
      artworks: [],
    });
  };

  const handleUpdateCollection = () => {
    // In a real app, this would call the API
    setCollections(
      collections.map(collection => 
        collection._id === selectedCollection._id 
          ? selectedCollection
          : collection
      )
    );
    setIsEditDialogOpen(false);
  };

  const handleDeleteCollection = (id: string) => {
    // In a real app, this would call the API
    setCollections(collections.filter(collection => collection._id !== id));
  };

  const handleToggleFeatured = (id: string) => {
    // In a real app, this would call the API
    setCollections(
      collections.map(collection => 
        collection._id === id 
          ? { ...collection, featured: !collection.featured } 
          : collection
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">
            Manage curated collections of artworks.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
              <DialogDescription>
                Create a curated collection of artworks.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Collection Title</Label>
                <Input
                  id="title"
                  placeholder="Collection Title"
                  value={newCollection.title}
                  onChange={(e) => setNewCollection({ ...newCollection, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Collection description..."
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <ImageUpload
                  onChange={(url) => setNewCollection({ ...newCollection, coverImage: url || "" })}
                  value={newCollection.coverImage}
                  endpoint="banner"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Select Artworks</Label>
                <div className="p-4 border rounded-md bg-muted/10">
                  <p className="text-sm text-muted-foreground">
                    In a real application, you would have a searchable list of artworks to add to the collection.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={newCollection.featured}
                  onCheckedChange={(checked) => setNewCollection({ ...newCollection, featured: checked as boolean })}
                />
                <Label htmlFor="featured">Featured Collection</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCollection}>Create Collection</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Collections Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {collections.map((collection) => (
          <Card key={collection._id} className={`${collection.featured ? 'border-primary/50' : ''}`}>
            <div className="relative aspect-[3/2] rounded-t-md overflow-hidden">
              <img
                src={collection.coverImage}
                alt={collection.title}
                className="object-cover w-full h-full"
              />
              {collection.featured && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary">Featured</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{collection.title}</h3>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Palette className="h-3 w-3" />
                      <span>{collection.artworks.length} artworks</span>
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {collection.description}
                </p>
                
                <div className="flex justify-between items-center pt-2">
                  <Button
                    variant={collection.featured ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleToggleFeatured(collection._id)}
                  >
                    {collection.featured ? (
                      <>
                        <StarOff className="h-3.5 w-3.5" />
                        <span>Unfeature</span>
                      </>
                    ) : (
                      <>
                        <Star className="h-3.5 w-3.5" />
                        <span>Feature</span>
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        setSelectedCollection(collection);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex items-center gap-1 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteCollection(collection._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Collection Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>
              Make changes to the existing collection.
            </DialogDescription>
          </DialogHeader>
          {selectedCollection && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Collection Title</Label>
                <Input
                  id="edit-title"
                  value={selectedCollection.title}
                  onChange={(e) => setSelectedCollection({ ...selectedCollection, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedCollection.description}
                  onChange={(e) => setSelectedCollection({ ...selectedCollection, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <ImageUpload
                  onChange={(url) => setSelectedCollection({ ...selectedCollection, coverImage: url || selectedCollection.coverImage })}
                  value={selectedCollection.coverImage}
                  endpoint="banner"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Selected Artworks ({selectedCollection.artworks.length})</Label>
                <div className="p-4 border rounded-md bg-muted/10 flex flex-wrap gap-2">
                  {selectedCollection.artworks.map((artworkId: string) => (
                    <Badge key={artworkId} variant="secondary" className="flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      <span>{artworkId}</span>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-featured"
                  checked={selectedCollection.featured}
                  onCheckedChange={(checked) => setSelectedCollection({ ...selectedCollection, featured: checked as boolean })}
                />
                <Label htmlFor="edit-featured">Featured Collection</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCollection}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
