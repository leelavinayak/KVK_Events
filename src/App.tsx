import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Home from "./components/Home";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Bookings from "./components/Bookings";
import Contact from "./components/Contact";
import AdminDashboard from "./components/AdminDashboard";

import { Booking, GalleryItem, Enquiry, Testimonial, TeamMember } from "./types";

export default function App() {
  
  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>("home");
  
  // Custom Dark Mode State - REMOVED (fixed light luxury mode)

  // DB Data stores
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Auth administrative state - permanently bypass/remove login page
  const [adminToken, setAdminToken] = useState<string | null>("bypass_token");

  // Auth checking
  useEffect(() => {
    // Permanent bypass token doesn't need external validation
    if (adminToken === "bypass_token") return;
    const checkAuthStatus = async () => {
      if (!adminToken) return;
      try {
        const res = await fetch("/api/auth/me", {
          headers: { "Authorization": `Bearer ${adminToken}` }
        });
        if (!res.ok) {
          // Token is dead/invalid
          handleLogout();
        }
      } catch (err) {
        console.error("Auth status sync check failed", err);
      }
    };
    checkAuthStatus();
  }, [adminToken]);

  // Unified Data Puller
  const pullAllData = async () => {
    try {
      // 1. Pull Public routes (anyone can see)
      const [resGallery, resTestimonials, resTeam] = await Promise.all([
        fetch("/api/gallery"),
        fetch("/api/testimonials"),
        fetch("/api/team")
      ]);

      if (resGallery.ok) setGalleryItems(await resGallery.json());
      if (resTestimonials.ok) setTestimonials(await resTestimonials.json());
      if (resTeam.ok) setTeamMembers(await resTeam.json());

      // 2. Pull Protected routes (only logged admins)
      if (adminToken) {
        const [resBookings, resEnquiries] = await Promise.all([
          fetch("/api/bookings", { headers: { "Authorization": `Bearer ${adminToken}` } }),
          fetch("/api/enquiries", { headers: { "Authorization": `Bearer ${adminToken}` } })
        ]);

        if (resBookings.ok) setBookings(await resBookings.json());
        if (resEnquiries.ok) setEnquiries(await resEnquiries.json());
      }
    } catch (err) {
      console.error("Error drawing database logs from fullstack api", err);
    }
  };

  // Run pulls on boot & token changes
  useEffect(() => {
    pullAllData();
  }, [adminToken]);

  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem("kvk_admin_token", token);
    setCurrentPage("admin");
  };

  const handleLogout = () => {
    setAdminToken("bypass_token");
    setCurrentPage("home");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-300 bg-brand-beige">
      
      {/* GLOBAL NAVBAR HEADER */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAdmin={!!adminToken}
        logoutAdmin={handleLogout}
      />

      {/* CORE ROUTING FRAME CONTAINER */}
      <main className="flex-grow">
        {currentPage === "home" && (
          <Home setCurrentPage={setCurrentPage} testimonials={testimonials} onSuccess={pullAllData} />
        )}
        {currentPage === "about" && (
          <About team={teamMembers} />
        )}
        {currentPage === "gallery" && (
          <Gallery galleryItems={galleryItems} />
        )}
        {currentPage === "bookings" && (
          <Bookings onSuccess={pullAllData} />
        )}
        {currentPage === "contact" && (
          <Contact onSuccess={pullAllData} />
        )}
        {currentPage === "admin" && (
          <AdminDashboard
            bookings={bookings}
            gallery={galleryItems}
            enquiries={enquiries}
            testimonials={testimonials}
            team={teamMembers}
            token={adminToken}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            refetchAll={pullAllData}
          />
        )}
      </main>

      {/* GLOBAL FOOTER COMPONENT */}
      <Footer setCurrentPage={setCurrentPage} />

      {/* FLOATING WHATSAPP FLOATER */}
      <FloatingWhatsApp />

    </div>
  );
}
