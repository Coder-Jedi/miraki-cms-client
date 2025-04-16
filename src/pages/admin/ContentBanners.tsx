
import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  LinkIcon,
  ImageIcon,
  Eye,
  EyeOff,
  GripVertical,
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
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

// Mock banners data
const mockBanners = [
  {
    id: "banner1",
    title: "Summer Art Collection",
    subtitle: "Explore the vibrant colors of summer",
    image: "https://source.unsplash.com/random/1200x400?art,summer",
    link: "/collections/summer",
    active: true,
    priority: 1,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "banner2",
    title: "Featured Artists",
    subtitle: "Discover Mumbai's emerging talent",
    image: "https://source.unsplash.com/random/1200x400?artists,exhibition",
    link: "/artists/featured",
    active: true,
    priority: 2,
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "banner3",
    title: "Photography Special",
    subtitle: "Urban landscapes through the lens",
    image: "https://source.unsplash.com/random/1200x400?photography,urban",
    link: "/category/photography",
    active: false,
    priority: 3,
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function ContentBanners() {
  const [banners, setBanners] = useState(mockBanners);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    active: true,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const handleCreateBanner = () => {
    // In a real app, this would call the API
    const createdBanner = {
      id: `banner${banners.length + 1}`,
      title: newBanner.title,
      subtitle: newBanner.subtitle,
      image: newBanner.image || "https://source.unsplash.com/random/1200x400?art,default",
      link: newBanner.link,
      active: newBanner.active,
      priority: banners.length + 1,
      startDate: new Date(newBanner.startDate).toISOString(),
      endDate: new Date(newBanner.endDate).toISOString(),
    };

    setBanners([...banners, createdBanner]);
    setIsCreateDialogOpen(false);
    // Reset form
    setNewBanner({
      title: "",
      subtitle: "",
      image: "",
      link: "",
      active: true,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
  };

  const handleUpdateBanner = () => {
    // In a real app, this would call the API
    setBanners(
      banners.map(banner => 
        banner.id === selectedBanner.id 
          ? selectedBanner
          : banner
      )
    );
    setIsEditDialogOpen(false);
  };

  const handleDeleteBanner = (id: string) => {
    // In a real app, this would call the API
    setBanners(banners.filter(banner => banner.id !== id));
  };

  const handleToggleActive = (id: string) => {
    // In a real app, this would call the API
    setBanners(
      banners.map(banner => 
        banner.id === id 
          ? { ...banner, active: !banner.active } 
          : banner
      )
    );
  };

  const handleMoveBanner = (id: string, direction: "up" | "down") => {
    const index = banners.findIndex(banner => banner.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === banners.length - 1)
    ) {
      return; // Can't move further
    }

    const newBanners = [...banners];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    // Swap priorities
    const targetPriority = newBanners[targetIndex].priority;
    newBanners[targetIndex].priority = newBanners[index].priority;
    newBanners[index].priority = targetPriority;
    
    // Swap positions
    [newBanners[index], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[index]];
    
    setBanners(newBanners);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
          <p className="text-muted-foreground">
            Manage homepage banners and promotional content.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Banner</DialogTitle>
              <DialogDescription>
                Add a promotional banner to display on the homepage.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Banner Title"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                <Input
                  id="subtitle"
                  placeholder="Banner Subtitle"
                  value={newBanner.subtitle}
                  onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link">Link URL</Label>
                <Input
                  id="link"
                  placeholder="/collections/summer"
                  value={newBanner.link}
                  onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newBanner.startDate}
                    onChange={(e) => setNewBanner({ ...newBanner, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newBanner.endDate}
                    onChange={(e) => setNewBanner({ ...newBanner, endDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <ImageUpload
                  onChange={(url) => setNewBanner({ ...newBanner, image: url || "" })}
                  value={newBanner.image}
                  endpoint="banner"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={newBanner.active}
                  onCheckedChange={(checked) => setNewBanner({ ...newBanner, active: checked as boolean })}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBanner}>Create Banner</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {banners
          .sort((a, b) => a.priority - b.priority)
          .map((banner) => (
            <Card key={banner.id} className={`border ${!banner.active ? 'border-dashed opacity-70' : ''}`}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3 flex-shrink-0">
                    <div className="relative aspect-[3/1] rounded-md overflow-hidden">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="object-cover w-full h-full"
                      />
                      {!banner.active && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Badge variant="outline">Inactive</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{banner.title}</h3>
                        {banner.subtitle && (
                          <p className="text-muted-foreground">{banner.subtitle}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(banner.startDate).toLocaleDateString()} - {new Date(banner.endDate).toLocaleDateString()}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    {banner.link && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <LinkIcon className="h-3 w-3" />
                        <span>{banner.link}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={banner.active ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleToggleActive(banner.id)}
                        >
                          {banner.active ? (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <EyeOff className="h-3 w-3" />
                              Inactive
                            </span>
                          )}
                        </Badge>
                        <Badge variant="outline">
                          Priority: {banner.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={banner.priority === 1}
                          onClick={() => handleMoveBanner(banner.id, "up")}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={banner.priority === banners.length}
                          onClick={() => handleMoveBanner(banner.id, "down")}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedBanner(banner);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteBanner(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Edit Banner Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>
              Make changes to the existing banner.
            </DialogDescription>
          </DialogHeader>
          {selectedBanner && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  placeholder="Banner Title"
                  value={selectedBanner.title}
                  onChange={(e) => setSelectedBanner({ ...selectedBanner, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-subtitle">Subtitle (Optional)</Label>
                <Input
                  id="edit-subtitle"
                  placeholder="Banner Subtitle"
                  value={selectedBanner.subtitle}
                  onChange={(e) => setSelectedBanner({ ...selectedBanner, subtitle: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-link">Link URL</Label>
                <Input
                  id="edit-link"
                  placeholder="/collections/summer"
                  value={selectedBanner.link}
                  onChange={(e) => setSelectedBanner({ ...selectedBanner, link: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={new Date(selectedBanner.startDate).toISOString().split("T")[0]}
                    onChange={(e) => setSelectedBanner({ 
                      ...selectedBanner, 
                      startDate: new Date(e.target.value).toISOString() 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={new Date(selectedBanner.endDate).toISOString().split("T")[0]}
                    onChange={(e) => setSelectedBanner({ 
                      ...selectedBanner, 
                      endDate: new Date(e.target.value).toISOString() 
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <ImageUpload
                  onChange={(url) => setSelectedBanner({ ...selectedBanner, image: url || selectedBanner.image })}
                  value={selectedBanner.image}
                  endpoint="banner"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-active"
                  checked={selectedBanner.active}
                  onCheckedChange={(checked) => setSelectedBanner({ 
                    ...selectedBanner, 
                    active: checked as boolean 
                  })}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBanner}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
