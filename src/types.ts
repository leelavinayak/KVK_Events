export type EventCategory = "weddings" | "birthdays" | "corporate" | "engagements" | "cultural" | "all";

export interface Booking {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  guests: number;
  budget: string;
  requirements?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  category: "weddings" | "birthdays" | "corporate" | "engagements" | "cultural";
  title: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  eventType: string;
  text: string;
  rating: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  bio: string;
  imageUrl: string;
  createdAt: string;
}

export interface AdminSession {
  token: string;
  username: string;
}
