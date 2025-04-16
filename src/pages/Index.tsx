
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Miraki Artistry Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A marketplace connecting artists with art enthusiasts in Mumbai
        </p>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>
            Access the full-featured admin dashboard to manage your art marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link to="/admin">
              <Button className="w-full">Dashboard Home</Button>
            </Link>
            <Link to="/admin/artworks">
              <Button className="w-full" variant="outline">Manage Artworks</Button>
            </Link>
            <Link to="/admin/artists">
              <Button className="w-full" variant="outline">Manage Artists</Button>
            </Link>
            <Link to="/admin/orders">
              <Button className="w-full" variant="outline">View Orders</Button>
            </Link>
            <Link to="/admin/users">
              <Button className="w-full" variant="outline">Manage Users</Button>
            </Link>
            <Link to="/admin/content/banners">
              <Button className="w-full" variant="outline">Manage Banners</Button>
            </Link>
            <Link to="/admin/content/collections">
              <Button className="w-full" variant="outline">Manage Collections</Button>
            </Link>
            <Link to="/admin/settings">
              <Button className="w-full" variant="outline">Site Settings</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
