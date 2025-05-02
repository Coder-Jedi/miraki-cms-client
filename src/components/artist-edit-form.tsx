import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/image-upload";
import { Artist } from "@/types";
import { useCreateArtist, useUpdateArtist, useUploadArtistProfileImage, useArtistAreas } from "@/hooks/use-artists";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const artistFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  location: z.object({
    area: z.string().min(1, "Area is required"),
  }).optional(),
  profileImage: z.string().optional(),
  socialLinks: z.object({
    website: z.string().url("Invalid website URL").optional().or(z.literal("")),
    instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
    twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
    facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  }).optional(),
  popularity: z.number().min(0).max(5).optional(),
  featured: z.boolean().optional(),
});

type ArtistFormValues = z.infer<typeof artistFormSchema>;

interface ArtistEditFormProps {
  artist?: Artist | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArtistEditForm({ artist, open, onOpenChange }: ArtistEditFormProps) {
  const { toast } = useToast();
  const { data: areasData, isLoading: isLoadingAreas } = useArtistAreas();
  const areas = areasData?.data?.areas || [];

  const form = useForm<ArtistFormValues>({
    resolver: zodResolver(artistFormSchema),
    defaultValues: {
      name: artist?.name || "",
      bio: artist?.bio || "",
      location: {
        area: artist?.location?.area || "",
      },
      profileImage: artist?.profileImage || "",
      socialLinks: {
        website: artist?.socialLinks?.website || "",
        instagram: artist?.socialLinks?.instagram || "",
        twitter: artist?.socialLinks?.twitter || "",
        facebook: artist?.socialLinks?.facebook || "",
      },
      popularity: artist?.popularity || 0,
      featured: artist?.featured || false,
    },
  });

  const createArtist = useCreateArtist();
  const updateArtist = artist ? useUpdateArtist(artist._id) : null;
  const uploadImage = useUploadArtistProfileImage(artist?._id || "");

  const onSubmit = async (values: ArtistFormValues) => {
    try {
      if (artist) {
        await updateArtist?.mutateAsync(values);
        toast({
          title: "Artist Updated",
          description: "The artist profile has been successfully updated.",
        });
      } else {
        await createArtist.mutateAsync(values);
        toast({
          title: "Artist Created",
          description: "The new artist has been successfully added.",
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the artist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file || !file.type.includes('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload a valid image file.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const response = await uploadImage.mutateAsync(file);
      // Use the URL from the response to update the form
      if (response.data && response.data.url) {
        form.setValue("profileImage", response.data.url);
        return response.data.url;
      }
      return null;
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload the profile image. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <ScrollArea className="max-h-[80vh] pr-4">
          <DialogHeader>
            <DialogTitle>
              {artist ? "Edit Artist" : "Add Artist"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        onUpload={handleImageUpload}
                        isUploading={uploadImage.isPending}
                        endpoint="artist"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Artist name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Artist biography text..."
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Location</h3>
                
                <FormField
                  control={form.control}
                  name="location.area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        {isLoadingAreas ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an area" />
                            </SelectTrigger>
                            <SelectContent>
                              {areas.map((area) => (
                                <SelectItem key={area} value={area}>
                                  {area}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Social Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="socialLinks.website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://artistwebsite.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://instagram.com/artistname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://twitter.com/artistname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://facebook.com/artistname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="popularity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Popularity (0-5)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="5" 
                        step="0.1"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      Toggle to mark the artist as featured.
                    </FormDescription>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createArtist.isPending || (updateArtist?.isPending ?? false)}
                >
                  {createArtist.isPending || (updateArtist?.isPending ?? false) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {artist ? "Saving..." : "Creating..."}
                    </>
                  ) : (
                    artist ? "Save Changes" : "Create Artist"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
