export type ArtworkCategory =
  | "All"
  | "Painting"
  | "Sculpture"
  | "Photography"
  | "Digital"
  | "Digital Art"
  | "Mixed Media"
  | "Ceramics"
  | "Illustration"
  | "Other";

export interface Location {
  lat: number;
  lng: number;
  area?: string;
}

export interface SocialLinks {
  website?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

export interface Artwork {
  _id: string;
  title: string;
  artist: string;
  artistId: string;
  year: number;
  medium: string;
  image: string;
  additionalImages?: string[];
  location: Location;
  price?: number;
  category: ArtworkCategory;
  description: string;
  likes: number;
  featured?: boolean;
  forSale?: boolean;
  createdAt?: string;
  dimensions?: string;
}

export interface UpdateArtworkDto {
  title?: string;
  artistId?: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  image?: string;
  additionalImages?: string[];
  location?: Location;
  price?: number;
  category?: ArtworkCategory;
  description?: string;
  featured?: boolean;
  forSale?: boolean;
}

export interface Artist {
  _id: string;
  name: string;
  bio?: string;
  location?: Location;
  profileImage?: string;
  socialLinks?: SocialLinks;
  popularity?: number;
  featured?: boolean;
  artworks?: Artwork[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number; // MongoDB version key
}

export interface Address {
  _id: string;
  type: "home" | "office" | "other";
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: "user" | "admin" | "artist";
  createdAt: string;
  lastLogin?: string;
  favorites?: string[];
  addresses?: Address[];
}

export interface CartItem {
  _id: string;
  artworkId: string;
  artwork: {
    _id: string;
    title: string;
    artist: string;
    image: string;
    price: number;
  };
  quantity: number;
  addedAt: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  summary: OrderSummary;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: {
    artwork: {
      _id: string;
      title: string;
      artist: string;
      image: string;
    };
    quantity: number;
    price: number;
  }[];
  shippingAddress: Address;
  paymentMethod: "card" | "netbanking" | "upi" | "cod";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingInfo?: {
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string;
  };
  summary: OrderSummary;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  active: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface Collection {
  _id: string;
  title: string;
  description?: string;
  coverImage: string;
  artworks: string[];
  featured: boolean;
  priority: number;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  logo: string;
  contactEmail: string;
  contactPhone?: string;
  socialLinks: SocialLinks;
  footerText: string;
  metaDescription: string;
  termsUrl?: string;
  privacyUrl?: string;
  shippingInfo?: string;
  returnPolicy?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalArtworks: number;
  totalArtists: number;
  recentOrders: Order[];
  salesByCategory: {
    category: string;
    sales: number;
    count: number;
  }[];
  salesByMonth: {
    month: string;
    sales: number;
  }[];
}

// Dashboard Statistics Types
export interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  revenueTrend: number;
  ordersTrend: number;
  salesByMonth: {
    month: string;
    sales: number;
  }[];
  ordersByStatus: {
    [key: string]: number;
  };
}

export interface SalesByPeriod {
  period: string;
  amount: number;
  count: number;
}

export interface ArtistStats {
  totalArtists: number;
  newArtistsThisMonth: number;
  topArtists: {
    artist: Artist;
    sales: number;
    artworks: number;
  }[];
}

export interface ArtworkStats {
  totalArtworks: number;
  newArtworksThisMonth: number;
  byCategory: Record<string, number>;
  byStatus: Record<Artwork["status"], number>;
}
