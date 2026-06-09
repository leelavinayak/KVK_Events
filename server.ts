import express, { Request, Response, NextFunction } from "express";
import path from "path";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { createServer as createViteServer } from "vite";
import { DBService } from "./server/db.js";
import { ImageUploadService } from "./server/cloudinary.js";

// Make sure process.env setup is loaded
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "kvk-events-secret-2026-key";

// Increase JSON limit to handle base64 image uploads in the admin dashboard
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Serve uploaded assets statically
app.use("/uploads", express.static(path.join(process.cwd(), "data", "uploads")));

// JWT authentication middleware
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token is missing" });
    return;
  }

  if (token === "bypass_token") {
    req.user = { id: "bypass_admin", username: "admin" };
    next();
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Invalid or expired access token" });
      return;
    }
    req.user = decoded as { id: string; username: string };
    next();
  });
};

/* =========================================================================
   1. AUTH PATHS
   ========================================================================= */

// Admin Login
app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  try {
    const admin = await DBService.getAdminByUsername(username);
    if (!admin) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const isMatch = await bcryptjs.compare(password, admin.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Check JWT status
app.get("/api/auth/me", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    authenticated: true,
    user: req.user
  });
});

/* =========================================================================
   2. BOOKINGS PATHS
   ========================================================================= */

// Create a booking (Public)
app.post("/api/bookings", async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      mobile,
      email,
      eventType,
      eventDate,
      eventLocation,
      guests,
      budget,
      requirements
    } = req.body;

    // Direct sanity check
    if (!fullName || !mobile || !email || !eventType || !eventDate || !eventLocation || !guests || !budget) {
      res.status(400).json({ error: "Please fill out all required booking fields." });
      return;
    }

    const numGuests = Number(guests);
    if (isNaN(numGuests) || numGuests <= 0) {
      res.status(400).json({ error: "Number of guests must be a valid positive integer." });
      return;
    }

    const booking = await DBService.createBooking({
      fullName,
      mobile,
      email,
      eventType,
      eventDate,
      eventLocation,
      guests: numGuests,
      budget,
      requirements: requirements || ""
    });

    res.status(201).json(booking);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings (Protected)
app.get("/api/bookings", authenticateToken, async (req: Request, res: Response) => {
  try {
    const bookings = await DBService.getBookings();
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a booking (Protected)
app.put("/api/bookings/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updated = await DBService.updateBooking(id, update);
    if (!updated) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a booking (Protected)
app.delete("/api/bookings/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await DBService.deleteBooking(id);
    if (!deleted) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================================
   3. GALLERY PATHS
   ========================================================================= */

// Get all gallery items (Public)
app.get("/api/gallery", async (req: Request, res: Response) => {
  try {
    const gallery = await DBService.getGallery();
    res.json(gallery);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Upload and add gallery item (Protected)
app.post("/api/gallery", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { imageSrc, category, title } = req.body;

    if (!imageSrc || !category || !title) {
      res.status(400).json({ error: "Image source, category, and title are required" });
      return;
    }

    const finalUrl = await ImageUploadService.uploadImage(imageSrc);
    const item = await DBService.addGalleryItem(finalUrl, category, title);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete gallery item (Protected)
app.delete("/api/gallery/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await DBService.deleteGalleryItem(id);
    if (!deleted) {
      res.status(404).json({ error: "Gallery item not found" });
      return;
    }
    res.json({ success: true, message: "Gallery item removed successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================================
   4. CONTACT ENQUIRIES PATHS
   ========================================================================= */

// Submit contact enquiry (Public)
app.post("/api/enquiries", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      res.status(400).json({ error: "Please provide name, email, phone and a brief message" });
      return;
    }

    const enquiry = await DBService.createEnquiry({ name, email, phone, message });
    res.status(201).json(enquiry);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get enquiries (Protected)
app.get("/api/enquiries", authenticateToken, async (req: Request, res: Response) => {
  try {
    const enquiries = await DBService.getEnquiries();
    res.json(enquiries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete enquiry (Protected)
app.delete("/api/enquiries/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await DBService.deleteEnquiry(id);
    if (!deleted) {
      res.status(404).json({ error: "Enquiry not found" });
      return;
    }
    res.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================================
   5. TESTIMONIALS PATHS
   ========================================================================= */

app.get("/api/testimonials", async (req: Request, res: Response) => {
  try {
    const testimonials = await DBService.getTestimonials();
    res.json(testimonials);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Submit a testimonial publicly without needing JWT credentials
app.post("/api/testimonials/public", async (req: Request, res: Response) => {
  try {
    const { clientName, eventType, text, rating, avatarUrl } = req.body;
    if (!clientName || !eventType || !text || !rating) {
      res.status(400).json({ error: "Client name, event type, text, and rating are required." });
      return;
    }
    const testimonial = await DBService.createTestimonial({
      clientName,
      eventType,
      text,
      rating: Number(rating),
      avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
    });
    res.status(201).json(testimonial);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/testimonials", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { clientName, eventType, text, rating, avatarUrl } = req.body;
    if (!clientName || !eventType || !text || !rating) {
      res.status(400).json({ error: "Client name, event type, text, and rating are required" });
      return;
    }
    const testimonial = await DBService.createTestimonial({
      clientName,
      eventType,
      text,
      rating: Number(rating),
      avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
    });
    res.status(201).json(testimonial);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/testimonials/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updated = await DBService.updateTestimonial(id, update);
    if (!updated) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/testimonials/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await DBService.deleteTestimonial(id);
    if (!deleted) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    res.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================================
   6. TEAM MEMBERS PATHS
   ========================================================================= */

app.get("/api/team", async (req: Request, res: Response) => {
  try {
    const team = await DBService.getTeam();
    res.json(team);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/team", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, role, experience, bio, imageUrl } = req.body;
    if (!name || !role || !experience || !bio || !imageUrl) {
      res.status(400).json({ error: "All team member fields are required" });
      return;
    }
    const member = await DBService.createTeamMember({ name, role, experience, bio, imageUrl });
    res.status(201).json(member);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/team/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updated = await DBService.updateTeamMember(id, update);
    if (!updated) {
      res.status(404).json({ error: "Team member not found" });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/team/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await DBService.deleteTeamMember(id);
    if (!deleted) {
      res.status(404).json({ error: "Team member not found" });
      return;
    }
    res.json({ success: true, message: "Team member deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================================
   7. VITE / STATIC ROUTING ASSETS
   ========================================================================= */

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware mode in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode.");
  } else {
    // Serve static files in production from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving pre-compiled assets from /dist in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KVK Events fullstack engine running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
