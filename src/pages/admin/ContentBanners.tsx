import { useState } from "react";
import { 
  useBanners, 
  useCreateBanner, 
  useUpdateBanner, 
  useDeleteBanner,
  useUpdateBannerStatus,
  useUpdateBannerPriority,
  useReorderBanners
} from "@/hooks/use-banners";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/image-upload";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { Banner } from "@/types";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function ContentBanners() {
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const { data: banners, isLoading } = useBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const updateStatus = useUpdateBannerStatus();
  const updatePriority = useUpdateBannerPriority();
  const reorderBanners = useReorderBanners();
  const { toast } = useToast();

  const handleCreateBanner = async (imageUrl: string) => {
    try {
      await createBanner.mutateAsync({
        imageUrl,
        active: true,
        priority: (banners?.data?.length || 0) + 1
      });
      toast({
        title: "Success",
        description: "Banner created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create banner",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, active: boolean) => {
    try {
      await updateStatus.mutateAsync({ id, active });
      toast({
        title: "Success",
        description: "Banner status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      await deleteBanner.mutateAsync(id);
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination || !banners?.data) return;

    const items = Array.from(banners.data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      await reorderBanners.mutateAsync(items.map(item => item._id));
      toast({
        title: "Success",
        description: "Banner order updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner order",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Banners</h1>
        <ImageUpload
          onUpload={handleCreateBanner}
          render={(onClick) => (
            <Button onClick={onClick}>
              Add New Banner
            </Button>
          )}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="banners">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {banners?.data?.map((banner, index) => (
                <Draggable
                  key={banner._id}
                  draggableId={banner._id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={banner.imageUrl}
                          alt="Banner"
                          className="w-40 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <Switch
                              checked={banner.active}
                              onCheckedChange={(checked) =>
                                handleUpdateStatus(banner._id, checked)
                              }
                            />
                            <span className={banner.active ? "text-green-600" : "text-red-600"}>
                              {banner.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <div className="mt-2">
                            Priority: {banner.priority}
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteBanner(banner._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
