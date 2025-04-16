
import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  EyeOff,
  Eye,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  CalendarDays,
  Link,
  ImageIcon
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
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Mock banners
const mockBanners = [
  {
    id: "banner1",
    title: "Summer Art Festival",
    subtitle: "Discover the brightest new talent at Mumbai's premier art festival",
    image: "https://source.unsplash.com/random/1200x600?art,festival",
    link: "/events/summer-art-festival",
    active: true,
    priority: 1,
    startDate: "2025-06-01T00:00:00Z",
    endDate: "2025-07-15T23:59:59Z",
    createdAt: "2025-03-15T10:30:00Z"
  },
  {
    id: "banner2",
    title: "New Collection Launch",
    subtitle: "Explore the latest works from acclaimed artist Priya Sharma",
    image: "https://source.unsplash.com/random/1200x600?art,gallery",
    link: "/collections/priya-sharma",
    active: true,
    priority: 2,
    startDate: null,
    endDate: null,
    createdAt: "2025-03-10T09:15:00Z"
  },
  {
    id: "banner3",
    title: "Art Workshop Series",
    subtitle: "Weekly workshops with India's top artists. Register now!",
    image: "https://source.unsplash.com/random/1200x600?workshop,art",
    link: "/workshops",
    active: true,
    priority: 3,
    startDate: "2025-05-01T00:00:00Z",
    endDate: null,
    createdAt: "2025-02-28T14:20:00Z"
  },
  {
    id: "banner4",
    title: "Mumbai Art Walk",
    subtitle: "Explore the street art of Bandra through guided tours",
    image: "https://source.unsplash.com/random/1200x600?street,art",
    link: "/events/art-walk",
    active: false,
    priority: 4,
    startDate: null,
    endDate: null,
    createdAt: "2025-02-15T11:45:00Z"
  },
  {
    id: "banner5",
    title: "Special Discount for Students",
    subtitle: "20% off all artworks for students. Limited time offer.",
    image: "https://source.unsplash.com/random/1200x600?student,art",
    link: "/offers/student-discount",
    active: false,
    priority: 5,
    startDate: "2025-08-01T00:00:00Z",
    endDate: "2025-09-30T23:59:59Z",
    createdAt: "2025-01-20T16:30:00Z"
  }
];

export default function ContentBanners() {
  const { toast } = useToast();
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
    startDate: "",
    endDate: ""
  });
  const [activeTab, setActiveTab] = useState("all");

  const filteredBanners = activeTab === "all" 
    ? banners 
    : activeTab === "active" 
      ? banners.filter(banner => banner.active)
      : banners.filter(banner => !banner.active);

  const handleCreateBanner = () => {
    // In a real app, this would call the API
    const createdBanner = {
      id: `banner${banners.length + 1}`,
      title: newBanner.title,
      subtitle: newBanner.subtitle,
      image: newBanner.image || "https://source.unsplash.com/random/1200x600?art,default",
      link: newBanner.link,
      active: newBanner.active,
      priority: banners.length + 1,
      startDate: newBanner.startDate || null,
      endDate: newBanner.endDate || null,
      createdAt: new Date().toISOString()
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
      startDate: "",
      endDate: ""
    });

    toast({
      title: "Banner created",
      description: "The new banner has been created successfully.",
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

    toast({
      title: "Banner updated",
      description: "The banner has been updated successfully.",
    });
  };

  const handleDeleteBanner = (id: string) => {
    // In a real app, this would call the API
    setBanners(banners.filter(banner => banner.id !== id));

    toast({
      title: "Banner deleted",
      description: "The banner has been deleted successfully.",
    });
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

    const banner = banners.find(b => b.id === id);
    toast({
      title: banner?.active ? "Banner deactivated" : "Banner activated",
      description: `The banner "${banner?.title}" has been ${banner?.active ? "deactivated" : "activated"}.`,
    });
  };

  const handleMovePriority = (id: string, direction: 'up' | 'down') => {
    const bannerIndex = banners.findIndex(banner => banner.id === id);
    if (
      (direction === 'up' && bannerIndex === 0) || 
      (direction === 'down' && bannerIndex === banners.length - 1)
    ) {
      return; // Can't move further
    }

    const newBanners = [...banners];
    const swapIndex = direction === 'up' ? bannerIndex - 1 : bannerIndex + 1;

    // Update priorities before swap
    const tempPriority = newBanners[bannerIndex].priority;
    newBanners[bannerIndex].priority = newBanners[swapIndex].priority;
    newBanners[swapIndex].priority = tempPriority;

    // Swap positions
    [newBanners[bannerIndex], newBanners[swapIndex]] = [newBanners[swapIndex], newBanners[bannerIndex]];

    setBanners(newBanners);

    toast({
      title: "Banner order updated",
      description: `The banner has been moved ${direction}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Banners</h1>
          <p className="text-muted-foreground">
            Manage promotional banners for your Miraki Artistry Hub.
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
                Add a new promotional banner to display on the website.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Banner Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter banner title"
                    value={newBanner.title}
                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Textarea
                    id="subtitle"
                    placeholder="Enter a brief subtitle or description"
                    value={newBanner.subtitle}
                    onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="link">Link URL</Label>
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="link"
                      placeholder="/collections/summer-art"
                      value={newBanner.link}
                      onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <div className="mt-2">
                  <ImageUpload
                    onChange={(url) => setNewBanner({ ...newBanner, image: url || "" })}
                    value={newBanner.image}
                    endpoint="banner"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended size: 1200x600 pixels. Max file size: 2MB.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="date"
                      value={newBanner.startDate}
                      onChange={(e) => setNewBanner({ ...newBanner, startDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endDate"
                      type="date"
                      value={newBanner.endDate}
                      onChange={(e) => setNewBanner({ ...newBanner, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="active"
                  checked={newBanner.active}
                  onCheckedChange={(checked) => setNewBanner({ ...newBanner, active: checked as boolean })}
                />
                <Label htmlFor="active">Banner Active</Label>
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

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Banners</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Banners List */}
      <div className="space-y-6">
        {filteredBanners.map((banner) => (
          <Card key={banner.id} className={`${banner.active ? '' : 'border-dashed opacity-70'}`}>
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-[300px] h-[200px]">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="object-cover w-full h-full"
                  />
                  {!banner.active && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <Badge variant="secondary" className="text-muted-foreground">Inactive</Badge>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium">{banner.title}</h3>
                      <p className="text-muted-foreground mt-1">{banner.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMovePriority(banner.id, 'up')}
                        disabled={banner.priority === 1}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMovePriority(banner.id, 'down')}
                        disabled={banner.priority === banners.length}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {banner.link && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Link className="h-3 w-3" />
                        <span className="truncate max-w-[160px]">{banner.link}</span>
                      </Badge>
                    )}
                    
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {banner.startDate || banner.endDate ? (
                          <>
                            {banner.startDate ? new Date(banner.startDate).toLocaleDateString() : 'No start'} 
                            {' → '} 
                            {banner.endDate ? new Date(banner.endDate).toLocaleDateString() : 'No end'}
                          </>
                        ) : (
                          'Always active'
                        )}
                      </span>
                    </Badge>
                    
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Created {new Date(banner.createdAt).toLocaleDateString()}</span>
                    </Badge>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleToggleActive(banner.id)}
                    >
                      {banner.active ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          <span>Activate</span>
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        setSelectedBanner(banner);
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
                      onClick={() => handleDeleteBanner(banner.id)}
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

        {filteredBanners.length === 0 && (
          <div className="text-center py-8 border rounded-lg bg-muted/10">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No banners found</h3>
            <p className="text-muted-foreground mt-1">
              {activeTab === "active" 
                ? "You don't have any active banners." 
                : activeTab === "inactive" 
                ? "You don't have any inactive banners."
                : "Start by adding your first banner."}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </div>
        )}
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
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Banner Title</Label>
                  <Input
                    id="edit-title"
                    value={selectedBanner.title}
                    onChange={(e) => setSelectedBanner({ ...selectedBanner, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-subtitle">Subtitle</Label>
                  <Textarea
                    id="edit-subtitle"
                    value={selectedBanner.subtitle}
                    onChange={(e) => setSelectedBanner({ ...selectedBanner, subtitle: e.target.value })}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-link">Link URL</Label>
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit-link"
                      value={selectedBanner.link}
                      onChange={(e) => setSelectedBanner({ ...selectedBanner, link: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <div className="mt-2">
                  <ImageUpload
                    onChange={(url) => setSelectedBanner({ ...selectedBanner, image: url || selectedBanner.image })}
                    value={selectedBanner.image}
                    endpoint="banner"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended size: 1200x600 pixels. Max file size: 2MB.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={selectedBanner.startDate ? new Date(selectedBanner.startDate).toISOString().split('T')[0] : ""}
                      onChange={(e) => setSelectedBanner({ ...selectedBanner, startDate: e.target.value || null })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={selectedBanner.endDate ? new Date(selectedBanner.endDate).toISOString().split('T')[0] : ""}
                      onChange={(e) => setSelectedBanner({ ...selectedBanner, endDate: e.target.value || null })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="edit-active"
                  checked={selectedBanner.active}
                  onCheckedChange={(checked) => setSelectedBanner({ ...selectedBanner, active: checked as boolean })}
                />
                <Label htmlFor="edit-active">Banner Active</Label>
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
