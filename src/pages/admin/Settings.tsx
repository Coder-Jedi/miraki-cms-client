
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/image-upload";
import { Badge } from "@/components/ui/badge";
import { Clock, Mail, Phone, RefreshCw, Save, Globe, Instagram, Facebook, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      siteName: "Miraki Artistry Hub",
      logo: "https://source.unsplash.com/random/300x300?logo",
      metaDescription: "Discover and collect unique artworks from Mumbai's emerging and established artists.",
      contactEmail: "contact@miraki-art.com",
      contactPhone: "+91 9876543210",
    },
    social: {
      instagram: "https://instagram.com/miraki_art",
      facebook: "https://facebook.com/mirakiart",
      twitter: "https://twitter.com/miraki_art",
    },
    policy: {
      termsUrl: "/terms",
      privacyUrl: "/privacy",
      shippingInfo: "Standard shipping takes 3-5 business days within Mumbai and 5-7 business days for the rest of India.",
      returnPolicy: "We accept returns within 7 days of delivery for items that arrive damaged or do not match the description.",
    },
    security: {
      twoFactorAuth: false,
      passwordExpiryDays: 90,
      sessionTimeoutMinutes: 60,
    }
  });

  const handleSave = (section: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: `${section} settings were successfully updated.`,
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your Miraki Artistry Hub platform settings.
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-4 w-full md:w-fit">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="policy">Policies</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Update your site's basic information that appears across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input 
                  id="siteName" 
                  value={settings.general.siteName} 
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteName: e.target.value }
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Logo</Label>
                <ImageUpload 
                  value={settings.general.logo}
                  onChange={(url) => setSettings({
                    ...settings,
                    general: { ...settings.general, logo: url || "" }
                  })}
                  endpoint="banner"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea 
                  id="metaDescription" 
                  rows={3}
                  value={settings.general.metaDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, metaDescription: e.target.value }
                  })}
                />
                <p className="text-sm text-muted-foreground">This description appears in search engine results.</p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </span>
                    <Input 
                      id="contactEmail" 
                      type="email"
                      className="rounded-l-none"
                      value={settings.general.contactEmail}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, contactEmail: e.target.value }
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <Phone className="h-4 w-4" />
                    </span>
                    <Input 
                      id="contactPhone" 
                      type="tel"
                      className="rounded-l-none"
                      value={settings.general.contactPhone}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, contactPhone: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleSave('General')} 
                disabled={isLoading}
                className="mt-4"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Connect your social media platforms to showcase across the site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                    <Instagram className="h-4 w-4" />
                  </span>
                  <Input 
                    id="instagram" 
                    placeholder="https://instagram.com/your_account"
                    className="rounded-l-none"
                    value={settings.social.instagram}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, instagram: e.target.value }
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                    <Facebook className="h-4 w-4" />
                  </span>
                  <Input 
                    id="facebook" 
                    placeholder="https://facebook.com/your_page"
                    className="rounded-l-none"
                    value={settings.social.facebook}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, facebook: e.target.value }
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                    <Globe className="h-4 w-4" />
                  </span>
                  <Input 
                    id="twitter" 
                    placeholder="https://twitter.com/your_handle"
                    className="rounded-l-none"
                    value={settings.social.twitter}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, twitter: e.target.value }
                    })}
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => handleSave('Social')} 
                disabled={isLoading}
                className="mt-4"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="policy" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Legal & Policy Settings</CardTitle>
              <CardDescription>
                Manage your platform's legal documents and policy information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="termsUrl">Terms of Service URL</Label>
                  <Input 
                    id="termsUrl" 
                    placeholder="/terms"
                    value={settings.policy.termsUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      policy: { ...settings.policy, termsUrl: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="privacyUrl">Privacy Policy URL</Label>
                  <Input 
                    id="privacyUrl" 
                    placeholder="/privacy"
                    value={settings.policy.privacyUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      policy: { ...settings.policy, privacyUrl: e.target.value }
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shippingInfo">Shipping Information</Label>
                <Textarea 
                  id="shippingInfo" 
                  rows={3}
                  value={settings.policy.shippingInfo}
                  onChange={(e) => setSettings({
                    ...settings,
                    policy: { ...settings.policy, shippingInfo: e.target.value }
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="returnPolicy">Return Policy</Label>
                <Textarea 
                  id="returnPolicy" 
                  rows={4}
                  value={settings.policy.returnPolicy}
                  onChange={(e) => setSettings({
                    ...settings,
                    policy: { ...settings.policy, returnPolicy: e.target.value }
                  })}
                />
              </div>
              
              <Button 
                onClick={() => handleSave('Policy')} 
                disabled={isLoading}
                className="mt-4"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security settings for your platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between px-4 py-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth" className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require two-factor authentication for admin users
                  </p>
                </div>
                <Switch 
                  id="twoFactorAuth" 
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    security: { ...settings.security, twoFactorAuth: checked }
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passwordExpiryDays">Password Expiry (Days)</Label>
                <div className="flex items-center">
                  <Input 
                    id="passwordExpiryDays" 
                    type="number"
                    min="0"
                    max="365"
                    value={settings.security.passwordExpiryDays}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, passwordExpiryDays: parseInt(e.target.value) }
                    })}
                  />
                  <Badge variant="outline" className="ml-2">
                    <Clock className="h-3 w-3 mr-1" />
                    Days
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Set to 0 for no expiry</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionTimeoutMinutes">Session Timeout (Minutes)</Label>
                <div className="flex items-center">
                  <Input 
                    id="sessionTimeoutMinutes" 
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.security.sessionTimeoutMinutes}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeoutMinutes: parseInt(e.target.value) }
                    })}
                  />
                  <Badge variant="outline" className="ml-2">
                    <Clock className="h-3 w-3 mr-1" />
                    Minutes
                  </Badge>
                </div>
              </div>
              
              <div className="mt-6 px-4 py-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg flex">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400">Security Notice</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                    Changes to security settings will be applied to all users on their next login.
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={() => handleSave('Security')} 
                disabled={isLoading}
                className="mt-4"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
