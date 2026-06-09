import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default models schema interface
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
  rating: number; // 1 to 5
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

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
}

interface LocalDB {
  bookings: Booking[];
  gallery: GalleryItem[];
  enquiries: Enquiry[];
  testimonials: Testimonial[];
  team: TeamMember[];
  admins: AdminUser[];
}

// Initial/Seed Data
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    clientName: "Rahul & Snigdha",
    eventType: "Wedding Ceremony",
    text: "KVK Events made our wedding look like something out of a fairy tale! K. Vamsi Krishna and his team handled everything with absolute precision, elegance, and professionalism. We didn't have to worry about a single thing. Highly recommended!",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    createdAt: new Date().toISOString()
  },
  {
    id: "t2",
    clientName: "Vikas Reddy",
    eventType: "Corporate Gala Meet",
    text: "Exceptional service for our corporate annual meet in Nellore. The audio-visual installation, stage setup, and guest management were world-class. KVK Events is our default event management partner going forward.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    createdAt: new Date().toISOString()
  },
  {
    id: "t3",
    clientName: "Priya Chandran",
    eventType: "1st Birthday Party",
    text: "The decorations for my daughter’s birthday were absolutely creative and sweet! The kids loved all the games, the interactive stalls, and the color scheme perfectly matched our requests. Thank you Vamsi Krishna gaaru!",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    title: "Elegant Mandap Setup",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    category: "weddings",
    createdAt: new Date().toISOString()
  },
  {
    id: "g2",
    title: "Floral Stage Reception",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    category: "weddings",
    createdAt: new Date().toISOString()
  },
  {
    id: "g3",
    title: "Royal Engagement Ceremonial Setting",
    imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
    category: "engagements",
    createdAt: new Date().toISOString()
  },
  {
    id: "g4",
    title: "Enchanting Lantern Festival",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800",
    category: "cultural",
    createdAt: new Date().toISOString()
  },
  {
    id: "g5",
    title: "Corporate Annual Meet Board",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
    category: "corporate",
    createdAt: new Date().toISOString()
  },
  {
    id: "g6",
    title: "Balloon Magic Birthday Banquet",
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800",
    category: "birthdays",
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "team_founder",
    name: "K. Vamsi Krishna",
    role: "Founder & Creative Director",
    experience: "6+ Years",
    bio: "K. Vamsi Krishna founded KVK Events with a vision to create memorable and extraordinary experiences for clients. With years of expertise in wedding planning and large-scale corporate event execution, he leads a passionate team dedicated to delivering flawless events with creativity, unmatched dedication, and meticulous attention to details.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=500",
    createdAt: new Date().toISOString()
  },
  {
    id: "team_member_2",
    name: "Sreeja Reddy",
    role: "Lead Wedding Coordinator",
    experience: "7 Years",
    bio: "Bringing a sophisticated flair to every detail, Sreeja specializes in traditional and contemporary wedding layouts, catering, and guest experiences.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500",
    createdAt: new Date().toISOString()
  },
  {
    id: "team_member_3",
    name: "Rajesh Kumar",
    role: "Corporate Sales & Ops Head",
    experience: "8 Years",
    bio: "Rajesh has successfully organized 150+ major high-profile corporate summits, seminars, and networking galas across South India.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=500",
    createdAt: new Date().toISOString()
  },
  {
    id: "team_member_4",
    name: "Anjali Sharma",
    role: "Theme & Decoration Head",
    experience: "5 Years",
    bio: "Anjali translates your event visions into reality with breathtaking flower displays, lighting rigs, balloon decorations, and customized stages.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=500",
    createdAt: new Date().toISOString()
  }
];

// Helper to interact with Local JSON DB
const readLocalDB = (): LocalDB => {
  if (!fs.existsSync(DB_FILE)) {
    // Generate default local database layout
    const initialDB: LocalDB = {
      bookings: [],
      gallery: DEFAULT_GALLERY,
      enquiries: [],
      testimonials: DEFAULT_TESTIMONIALS,
      team: DEFAULT_TEAM,
      admins: [
        {
          id: "admin1",
          username: "admin",
          passwordHash: bcryptjs.hashSync("admin123", 10) // default password
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), "utf-8");
    return initialDB;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading db.json, returning empty template", err);
    return {
      bookings: [],
      gallery: DEFAULT_GALLERY,
      enquiries: [],
      testimonials: DEFAULT_TESTIMONIALS,
      team: DEFAULT_TEAM,
      admins: []
    };
  }
};

const writeLocalDB = (db: LocalDB) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
};

// Mongo database connection flag
let isMongo = false;
const MONGO_URI = process.env.MONGODB_URI;

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected successfully to MongoDB Atlas!");
      isMongo = true;
    })
    .catch((err) => {
      console.error("MongoDB Atlas connection failed. Falling back to local storage.", err);
      isMongo = false;
    });
} else {
  console.log("No MONGODB_URI environment variable detected. Running in secure Local DB Mode.");
}

// Unified Service Layer to expose endpoints
export const DBService = {
  // Test authentication helper
  getIsMongoDB(): boolean {
    return isMongo;
  },

  // 1. ADMINS
  async getAdminByUsername(username: string): Promise<AdminUser | null> {
    const db = readLocalDB();
    const admin = db.admins.find((a) => a.username === username);
    return admin || null;
  },

  // 2. BOOKINGS
  async getBookings(): Promise<Booking[]> {
    const db = readLocalDB();
    return db.bookings.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createBooking(bookingData: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> {
    const db = readLocalDB();
    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substring(2, 11),
      status: "pending",
      createdAt: new Date().toISOString()
    };
    db.bookings.push(newBooking);
    writeLocalDB(db);
    return newBooking;
  },

  async updateBooking(id: string, update: Partial<Booking>): Promise<Booking | null> {
    const db = readLocalDB();
    const index = db.bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;
    db.bookings[index] = { ...db.bookings[index], ...update };
    writeLocalDB(db);
    return db.bookings[index];
  },

  async deleteBooking(id: string): Promise<boolean> {
    const db = readLocalDB();
    const initialLen = db.bookings.length;
    db.bookings = db.bookings.filter((b) => b.id !== id);
    writeLocalDB(db);
    return db.bookings.length < initialLen;
  },

  // 3. GALLERY
  async getGallery(): Promise<GalleryItem[]> {
    const db = readLocalDB();
    return db.gallery.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addGalleryItem(imageUrl: string, category: GalleryItem["category"], title: string): Promise<GalleryItem> {
    const db = readLocalDB();
    const newItem: GalleryItem = {
      id: Math.random().toString(36).substring(2, 11),
      imageUrl,
      category,
      title,
      createdAt: new Date().toISOString()
    };
    db.gallery.push(newItem);
    writeLocalDB(db);
    return newItem;
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    const db = readLocalDB();
    const initialLen = db.gallery.length;
    db.gallery = db.gallery.filter((g) => g.id !== id);
    writeLocalDB(db);
    return db.gallery.length < initialLen;
  },

  // 4. CONTACT ENQUIRIES
  async getEnquiries(): Promise<Enquiry[]> {
    const db = readLocalDB();
    return db.enquiries.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createEnquiry(enquiry: Omit<Enquiry, "id" | "createdAt">): Promise<Enquiry> {
    const db = readLocalDB();
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString()
    };
    db.enquiries.push(newEnquiry);
    writeLocalDB(db);
    return newEnquiry;
  },

  async deleteEnquiry(id: string): Promise<boolean> {
    const db = readLocalDB();
    const initialLen = db.enquiries.length;
    db.enquiries = db.enquiries.filter((e) => e.id !== id);
    writeLocalDB(db);
    return db.enquiries.length < initialLen;
  },

  // 5. TESTIMONIALS
  async getTestimonials(): Promise<Testimonial[]> {
    const db = readLocalDB();
    return db.testimonials.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createTestimonial(testimonial: Omit<Testimonial, "id" | "createdAt">): Promise<Testimonial> {
    const db = readLocalDB();
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString()
    };
    db.testimonials.push(newTestimonial);
    writeLocalDB(db);
    return newTestimonial;
  },

  async updateTestimonial(id: string, update: Partial<Testimonial>): Promise<Testimonial | null> {
    const db = readLocalDB();
    const index = db.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return null;
    db.testimonials[index] = { ...db.testimonials[index], ...update };
    writeLocalDB(db);
    return db.testimonials[index];
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    const db = readLocalDB();
    const initialLen = db.testimonials.length;
    db.testimonials = db.testimonials.filter((t) => t.id !== id);
    writeLocalDB(db);
    return db.testimonials.length < initialLen;
  },

  // 6. TEAM MEMBERS
  async getTeam(): Promise<TeamMember[]> {
    const db = readLocalDB();
    return db.team;
  },

  async createTeamMember(member: Omit<TeamMember, "id" | "createdAt">): Promise<TeamMember> {
    const db = readLocalDB();
    const newMember: TeamMember = {
      ...member,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString()
    };
    db.team.push(newMember);
    writeLocalDB(db);
    return newMember;
  },

  async updateTeamMember(id: string, update: Partial<TeamMember>): Promise<TeamMember | null> {
    const db = readLocalDB();
    const index = db.team.findIndex((m) => m.id === id);
    if (index === -1) return null;
    db.team[index] = { ...db.team[index], ...update };
    writeLocalDB(db);
    return db.team[index];
  },

  async deleteTeamMember(id: string): Promise<boolean> {
    const db = readLocalDB();
    const initialLen = db.team.length;
    db.team = db.team.filter((m) => m.id !== id);
    writeLocalDB(db);
    return db.team.length < initialLen;
  }
};
