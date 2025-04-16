
import { useState } from "react";
import { 
  Save, 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  Phone,
  Link as LinkIcon,
  Upload,
  Info,
  Globe,
  FileText,
  TruckIcon,
  PackageOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Mock site settings
const mockSettings = {
  siteName: "Miraki Artistry Hub",
  logo: "https://placehold.co/200x80?text=Miraki+Artistry",
  contactEmail: "contact@miraki-art.com",
  contactPhone: "+91 9876543210",
  socialLinks: {
    instagram: "https://instagram.com/miraki-art",
    facebook: "https://facebook.com/miraki-art",
    twitter: "https://twitter.com/miraki-art",
  },
  footerText: "© 2025 Miraki Artistry Hub. All rights reserved.",
  metaDescription: "Miraki Artistry Hub is a platform connecting artists with art enthusiasts in Mumbai, showcasing a diverse range of artworks and supporting local talent.",
  termsUrl: "/terms",
  privacyUrl: "/privacy",
  shippingInfo: "We offer free shipping within Mumbai. For other locations in India, a flat shipping fee of ₹200 applies. International shipping is available at variable rates depending on the destination.",
  returnPolicy: "Artworks can be returned within 7 days of delivery if they arrive damaged or significantly different from their online representation. Custom commissioned works are non-returnable.",
};

export default function Settings() {
  const [settings, setSettings] = useState(mockSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    // In a real app, this would call the API
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
      alert("Settings saved successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-muted-foreground">
            Configure global settings for your Miraki Artistry Hub.
          </p>
        </div>
        <Button 
          className="flex items-center gap-2" 
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact & Social</TabsTrigger>
          <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Basic information about your platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Input
                    id="footerText"
                    value={settings.footerText}
                    onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-[200px] h-[80px] bg-muted/20 rounded-md flex items-center justify-center overflow-hidden">
                    <img src={settings.logo} alt="Logo" className="max-w-full max-h-full" />
                  </div>
                  <div className="flex-1">
                    <ImageUpload
                      onChange={(url) => setSettings({ ...settings, logo: url || settings.logo })}
                      value={settings.logo}
                      endpoint="banner"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contact & Social */}
        <TabsContent value="contact" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How customers can reach you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Email
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Phone
                  </Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Connect your social media accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/youraccount"
                    value={settings.socialLinks.instagram}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      socialLinks: { ...settings.socialLinks, instagram: e.target.value } 
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/yourpage"
                    value={settings.socialLinks.facebook}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      socialLinks: { ...settings.socialLinks, facebook: e.target.value } 
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/youraccount"
                    value={settings.socialLinks.twitter}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      socialLinks: { ...settings.socialLinks, twitter: e.target.value } 
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SEO & Meta */}
        <TabsContent value="seo" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your site for search engines.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Meta Description
                </Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Brief description of your platform for search engines..."
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {settings.metaDescription.length}/160 characters recommended
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Site URLs
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="termsUrl" className="text-sm text-muted-foreground">
                      Terms & Conditions URL
                    </Label>
                    <Input
                      id="termsUrl"
                      placeholder="/terms"
                      value={settings.termsUrl}
                      onChange={(e) => setSettings({ ...settings, termsUrl: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="privacyUrl" className="text-sm text-muted-foreground">
                      Privacy Policy URL
                    </Label>
                    <Input
                      id="privacyUrl"
                      placeholder="/privacy"
                      value={settings.privacyUrl}
                      onChange={(e) => setSettings({ ...settings, privacyUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Policies */}
        <TabsContent value="policies" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Shopping Policies</CardTitle>
              <CardDescription>
                Define your shipping and return policies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shippingInfo" className="flex items-center gap-2">
                  <TruckIcon className="h-4 w-4" />
                  Shipping Information
                </Label>
                <Textarea
                  id="shippingInfo"
                  placeholder="Describe your shipping policy, costs, and timeframes..."
                  value={settings.shippingInfo}
                  onChange={(e) => setSettings({ ...settings, shippingInfo: e.target.value })}
                  rows={4}
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label htmlFor="returnPolicy" className="flex items-center gap-2">
                  <PackageOpen className="h-4 w-4" />
                  Return Policy
                </Label>
                <Textarea
                  id="returnPolicy"
                  placeholder="Describe your return and refund policy..."
                  value={settings.returnPolicy}
                  onChange={(e) => setSettings({ ...settings, returnPolicy: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
