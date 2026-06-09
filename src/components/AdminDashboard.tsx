import React, { useState, useEffect } from "react";
import { 
  Lock, ArrowRight, Table, Image, Mail, Star, Users, Trash2, 
  Check, X, Edit, Plus, Upload, Sparkles, Filter, ShieldCheck, 
  PhoneCall, LogOut, CheckCircle2, ChevronRight, AlertCircle, RefreshCw
} from "lucide-react";
import { Booking, GalleryItem, Enquiry, Testimonial, TeamMember } from "../types";

interface AdminDashboardProps {
  bookings: Booking[];
  gallery: GalleryItem[];
  enquiries: Enquiry[];
  testimonials: Testimonial[];
  team: TeamMember[];
  token: string | null;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
  refetchAll: () => void;
}

type DashboardTab = "bookings" | "gallery" | "enquiries" | "testimonials" | "team";

export default function AdminDashboard({
  bookings,
  gallery,
  enquiries,
  testimonials,
  team,
  token,
  onLoginSuccess,
  onLogout,
  refetchAll
}: AdminDashboardProps) {
  
  // Login credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Panel Tab
  const [activeTab, setActiveTab] = useState<DashboardTab>("bookings");

  /* =========================================================================
     STATE MANAGERS FOR CREATION / EDITS
     ========================================================================= */
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // 1. Booking Status Editor
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editableStatus, setEditableStatus] = useState<Booking["status"]>("pending");

  // 2. Gallery Upload Form
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "weddings" as GalleryItem["category"],
    imageSrc: "" // base64 or URL
  });

  // 3. Testimonial Creator Form
  const [testimonialForm, setTestimonialForm] = useState({
    id: "", // present if editing
    clientName: "",
    eventType: "Wedding Ceremony",
    text: "",
    rating: 5,
    avatarUrl: ""
  });
  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);

  // 4. Team Creator Form
  const [teamForm, setTeamForm] = useState({
    id: "", // present if editing
    name: "",
    role: "",
    experience: "3+ Years Experience",
    bio: "",
    imageUrl: ""
  });
  const [isEditingTeam, setIsEditingTeam] = useState(false);

  // Read File and translate to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("File size too large. Please select an image below 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  /* =========================================================================
     1. AUTH ACTIONS
     ========================================================================= */
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    if (!username || !password) {
      setLoginError("Please type in both admin username and secret password.");
      setLoginLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      // Success
      if (data.token) {
        onLoginSuccess(data.token);
        setUsername("");
        setPassword("");
        refetchAll();
      }
    } catch (err: any) {
      setLoginError(err.message || "Invalid system administrator parameters.");
    } finally {
      setLoginLoading(false);
    }
  };

  /* =========================================================================
     2. API HANDLERS (BOOKINGS, CONTACTS, GALLERY, TESTIMONIALS, TEAM)
     ========================================================================= */
  const apiCall = async (endpoint: string, method: string, bodyJson?: any) => {
    if (!token) return;
    setApiLoading(true);
    setApiError(null);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: bodyJson ? JSON.stringify(bodyJson) : undefined
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Administrative command failed.");
      }

      refetchAll(); // trigger dynamic database update on app frame
      return result;
    } catch (err: any) {
      setApiError(err.message);
      console.error("API Call error", err);
    } finally {
      setApiLoading(false);
    }
  };

  // BOOKING CHANGE STATUS
  const saveBookingStatusUpdate = async (id: string) => {
    await apiCall(`/api/bookings/${id}`, "PUT", { status: editableStatus });
    setEditingBookingId(null);
  };

  const deleteBookingRecord = async (id: string) => {
    if (confirm("Are you positive you wish to completely delete this booking record?")) {
      await apiCall(`/api/bookings/${id}`, "DELETE");
    }
  };

  // GALLERY SUBMIT
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.imageSrc) {
      alert("Please provide a title and select/upload an image file first.");
      return;
    }

    await apiCall("/api/gallery", "POST", galleryForm);
    // Reset Form
    setGalleryForm({
      title: "",
      category: "weddings",
      imageSrc: ""
    });
  };

  const deleteGalleryItem = async (id: string) => {
    if (confirm("Delete this image from the gallery database?")) {
      await apiCall(`/api/gallery/${id}`, "DELETE");
    }
  };

  // ENQUIRY DELETE
  const deleteEnquiryMessage = async (id: string) => {
    if (confirm("Permanently remove this contact enquiry?")) {
      await apiCall(`/api/enquiries/${id}`, "DELETE");
    }
  };

  // TESTIMONIAL CRUD
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.clientName || !testimonialForm.text) {
      alert("Please enter client name and text representation.");
      return;
    }

    if (isEditingTestimonial) {
      await apiCall(`/api/testimonials/${testimonialForm.id}`, "PUT", testimonialForm);
    } else {
      await apiCall("/api/testimonials", "POST", testimonialForm);
    }

    // Reset Form
    setTestimonialForm({
      id: "",
      clientName: "",
      eventType: "Wedding Ceremony",
      text: "",
      rating: 5,
      avatarUrl: ""
    });
    setIsEditingTestimonial(false);
  };

  const triggerEditTestimonial = (t: Testimonial) => {
    setTestimonialForm({
      id: t.id,
      clientName: t.clientName,
      eventType: t.eventType,
      text: t.text,
      rating: t.rating,
      avatarUrl: t.avatarUrl || ""
    });
    setIsEditingTestimonial(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const deleteTestimonialRecord = async (id: string) => {
    if (confirm("Delete this testmonial entry permanently?")) {
      await apiCall(`/api/testimonials/${id}`, "DELETE");
    }
  };

  // TEAM CRUD
  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.role || !teamForm.bio || !teamForm.imageUrl) {
      alert("Please fill complete details and upload team headshot.");
      return;
    }

    if (isEditingTeam) {
      await apiCall(`/api/team/${teamForm.id}`, "PUT", teamForm);
    } else {
      await apiCall("/api/team", "POST", teamForm);
    }

    // Reset Form
    setTeamForm({
      id: "",
      name: "",
      role: "",
      experience: "3+ Years Experience",
      bio: "",
      imageUrl: ""
    });
    setIsEditingTeam(false);
  };

  const triggerEditTeam = (m: TeamMember) => {
    setTeamForm({
      id: m.id,
      name: m.name,
      role: m.role,
      experience: m.experience,
      bio: m.bio,
      imageUrl: m.imageUrl
    });
    setIsEditingTeam(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const deleteTeamRecord = async (id: string) => {
    if (id === "team_founder") {
      alert("The founder profile (K. Vamsi Krishna) is locked for corporate identity. You may edit but not delete this element.");
      return;
    }
    if (confirm("Remove this coordinator profile from the operational database?")) {
      await apiCall(`/api/team/${id}`, "DELETE");
    }
  };

  /* =========================================================================
     3. RENDER PATH: SECURE LOGIN PANEL
     ========================================================================= */
  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="relative max-w-md w-full bg-white dark:bg-zinc-800 rounded-3xl border border-sage/20 dark:border-zinc-700 shadow-2xl p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-bronze/10 text-bronze flex items-center justify-center mx-auto shadow border border-bronze/20">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-display font-black text-neutral-800 dark:text-cream leading-tight">
              Administrator Desk
            </h1>
            <p className="text-xs text-neutral-520 dark:text-zinc-400">
              Authorized access only. Sign in to edit bookings, gallery works, and testimonials.
            </p>
          </div>

          {/* Quick tips */}
          <div className="p-3.5 bg-champagne/40 dark:bg-amber-950/20 dark:text-amber-300 border border-sage/20 rounded-xl text-neutral-700 text-xs text-center space-y-1">
            <p className="font-extrabold text-bronze uppercase tracking-widest text-[10px]">
              🔒 Initial System Password
            </p>
            <p className="font-mono">
              Username: <strong className="font-sans text-neutral-900 dark:text-cream text-xs">admin</strong> &nbsp;|&nbsp; 
              Password: <strong className="font-sans text-neutral-900 dark:text-cream text-xs">admin123</strong>
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 dark:bg-red-910/20 dark:text-red-400 dark:border-red-900 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-neutral-650 dark:text-zinc-400 font-mono">
                Admin Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-full px-4 py-3 bg-cream/10 dark:bg-zinc-900 text-neutral-800 dark:text-cream border border-sage/40 dark:border-zinc-700 rounded-xl text-xs focus:ring-2 focus:ring-bronze"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-neutral-650 dark:text-zinc-400 font-mono">
                Secret Access Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-cream/10 dark:bg-zinc-900 text-neutral-800 dark:text-cream border border-sage/40 dark:border-zinc-700 rounded-xl text-xs focus:ring-2 focus:ring-bronze"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-neutral-900 dark:bg-bronze hover:bg-neutral-850 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <div className="w-4 .h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Access Logs Panel
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    );
  }

  /* =========================================================================
     4. RENDER PATH: LOGGED ADMIN HUB
     ========================================================================= */
  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* HUB HEADER & STATS */}
      <div className="bg-white dark:bg-zinc-800 rounded-3xl border border-sage/20 dark:border-zinc-700 p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl dark:bg-emerald-950/40 dark:text-emerald-300">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-black text-neutral-800 dark:text-cream">
                Console Dashboard
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold max-h-5 flex items-center">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Welcome back, K. Vamsi Krishna Admin.
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              refetchAll();
              alert("Server synced, database logs reloaded!");
            }}
            className="p-2.5 rounded-xl border border-zinc-200 text-zinc-650 hover:bg-neutral-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Force refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout Securely
          </button>
        </div>
      </div>

      {/* HORIZONTAL PANELS SELECTOR */}
      <div className="flex flex-wrap items-center gap-2 border-b border-sage/20 pb-4">
        
        <button
          onClick={() => { setActiveTab("bookings"); setApiError(null); }}
          className={`px-4.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 ${
            activeTab === "bookings" ? "bg-bronze text-white shadow" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-sage/10"
          }`}
        >
          <Table className="w-4.5 h-4.5" />
          Event Reservations ({bookings.length})
        </button>

        <button
          onClick={() => { setActiveTab("gallery"); setApiError(null); }}
          className={`px-4.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 ${
            activeTab === "gallery" ? "bg-bronze text-white shadow" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-sage/10"
          }`}
        >
          <Image className="w-4.5 h-4.5" />
          Gallery Depot ({gallery.length})
        </button>

        <button
          onClick={() => { setActiveTab("enquiries"); setApiError(null); }}
          className={`px-4.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 ${
            activeTab === "enquiries" ? "bg-bronze text-white shadow" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-sage/10"
          }`}
        >
          <Mail className="w-4.5 h-4.5" />
          Enquiries ({enquiries.length})
        </button>

        <button
          onClick={() => { setActiveTab("testimonials"); setApiError(null); }}
          className={`px-4.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 ${
            activeTab === "testimonials" ? "bg-bronze text-white shadow" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-sage/10"
          }`}
        >
          <Star className="w-4.5 h-4.5" />
          Reviews Feed ({testimonials.length})
        </button>

        <button
          onClick={() => { setActiveTab("team"); setApiError(null); }}
          className={`px-4.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 ${
            activeTab === "team" ? "bg-bronze text-white shadow" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-sage/10"
          }`}
        >
          <Users className="w-4.5 h-4.5" />
          Coordinators ({team.length})
        </button>

      </div>

      {apiLoading && (
        <div className="h-1.5 w-full bg-cream rounded overflow-hidden">
          <div className="h-full bg-bronze animate-pulse w-3/4"></div>
        </div>
      )}

      {apiError && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>Error submitting parameters: {apiError}</span>
        </div>
      )}

      {/* =========================================================================
         PANEL 1: BOOKING MANAGEMENT
         ========================================================================= */}
      {activeTab === "bookings" && (
        <div className="bg-white dark:bg-zinc-800 border border-sage/20 dark:border-zinc-700 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-sage/15 dark:border-zinc-700">
            <h2 className="text-lg font-display font-bold text-neutral-800 dark:text-cream">
              Manage Client Reservations
            </h2>
            <p className="text-xs text-neutral-400">Total list of logged reservations recorded on Website.</p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-zinc-900 text-neutral-600 dark:text-zinc-400 font-mono text-[10px] uppercase tracking-wider border-b border-sage/10 dark:border-zinc-800">
                  <th className="p-4.5 font-bold">Client &amp; Mobile</th>
                  <th className="p-4.5 font-bold">Event Type</th>
                  <th className="p-4.5 font-bold">Date &amp; Location</th>
                  <th className="p-4.5 font-bold">Guests &amp; Budget</th>
                  <th className="p-4.5 font-bold">Logged Staged requirements</th>
                  <th className="p-4.5 font-bold text-center">Status Badge</th>
                  <th className="p-4.5 font-bold text-right">Command</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10 dark:divide-zinc-800 font-sans text-neutral-700 dark:text-zinc-200">
                {bookings.length > 0 ? (
                  bookings.map((bk) => (
                    <tr key={bk.id} className="hover:bg-neutral-50/50 dark:hover:bg-zinc-700/20">
                      
                      {/* Client info */}
                      <td className="p-4.5 space-y-1">
                        <p className="font-extrabold text-neutral-800 dark:text-white">{bk.fullName}</p>
                        <p className="text-zinc-400 font-mono text-[10px]">{bk.mobile} &middot; {bk.email}</p>
                      </td>

                      {/* Event Type */}
                      <td className="p-4.5">
                        <span className="px-2 py-1 bg-sage/20 dark:bg-zinc-700 rounded-md font-semibold text-[10px] uppercase text-bronze">
                          {bk.eventType}
                        </span>
                      </td>

                      {/* Date & venue */}
                      <td className="p-4.5 space-y-1">
                        <p className="font-mono font-medium">{bk.eventDate}</p>
                        <p className="text-zinc-400 text-[11px] font-semibold">{bk.eventLocation}</p>
                      </td>

                      {/* Guests & Budget range */}
                      <td className="p-4.5 space-y-1">
                        <p className="font-bold">{bk.guests} heads</p>
                        <p className="text-[11px] text-bronze font-mono font-bold">{bk.budget}</p>
                      </td>

                      {/* Requirements textbox excerpt */}
                      <td className="p-4.5 max-w-xs truncate" title={bk.requirements}>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-300 italic whitespace-normal line-clamp-2">
                          {bk.requirements || "(None Specified)"}
                        </p>
                      </td>

                      {/* Status select editor */}
                      <td className="p-4.5 text-center">
                        {editingBookingId === bk.id ? (
                          <div className="flex items-center gap-1 justify-center">
                            <select
                              value={editableStatus}
                              onChange={(e) => setEditableStatus(e.target.value as Booking["status"])}
                              className="px-2 py-1.5 bg-neutral-100 dark:bg-zinc-900 border border-zinc-350 dark:border-zinc-750 text-neutral-800 dark:text-cream text-[10px] rounded focus:outline-none focus:ring-1 focus:ring-bronze"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => saveBookingStatusUpdate(bk.id)}
                              className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded cursor-pointer"
                              title="Save status change"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingBookingId(null)}
                              className="p-1.5 bg-neutral-300 hover:bg-neutral-400 text-neutral-800 rounded cursor-pointer"
                              title="Discard"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 justify-center">
                            <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${
                              bk.status === "confirmed" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" :
                              bk.status === "completed" ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400" :
                              bk.status === "cancelled" ? "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400" :
                              "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                            }`}>
                              {bk.status}
                            </span>
                            <button
                              onClick={() => {
                                setEditingBookingId(bk.id);
                                setEditableStatus(bk.status);
                              }}
                              className="p-1 rounded text-neutral-400 hover:text-bronze hover:bg-neutral-100 dark:hover:bg-zinc-750 cursor-pointer"
                              title="Change status"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Commands */}
                      <td className="p-4.5 text-right">
                        <button
                          onClick={() => deleteBookingRecord(bk.id)}
                          className="p-2 bg-red-50 text-red-500 hover:bg-red-150 rounded-lg dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-zinc-800 cursor-pointer min-w-[36px] min-h-[36px]"
                          title="Delete booking permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-400">
                      No customer event reservations recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
         PANEL 2: GALLERY MANAGEMENT
         ========================================================================= */}
      {activeTab === "gallery" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Uploader Form */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-800 border border-sage/20 dark:border-zinc-700 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="space-y-1.5">
              <div className="inline-flex gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-bronze bg-champagne/40 dark:bg-amber-950/40 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Upload Engine
              </div>
              <h2 className="text-lg font-display font-bold text-neutral-800 dark:text-cream">
                Add Photography Work
              </h2>
              <p className="text-xs text-neutral-450 dark:text-zinc-400">
                Uploaded files parse dynamically to the local scratch-disk folder, or Cloudinary if configured.
              </p>
            </div>

            <form onSubmit={handleGallerySubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 dark:text-zinc-350">
                  Image Title *
                </label>
                <input
                  type="text"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="Royal Lotus Flower Stage Setup"
                  required
                  className="w-full px-4 py-2.5 bg-cream/10 dark:bg-zinc-900 border border-sage/40 dark:border-zinc-700 text-neutral-800 dark:text-cream text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 dark:text-zinc-350">
                  Event Category *
                </label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as GalleryItem["category"] })}
                  className="w-full px-4 py-2.5 bg-cream/10 dark:bg-zinc-900 border border-sage/40 dark:border-zinc-700 text-neutral-800 dark:text-cream text-xs rounded-xl cursor-pointer"
                >
                  <option value="weddings">Weddings</option>
                  <option value="engagements">Engagements</option>
                  <option value="birthdays">Birthdays</option>
                  <option value="corporate">Corporate Events</option>
                  <option value="cultural">Cultural Programs</option>
                </select>
              </div>

              <div className="space-y-1 bg-neutral-50 dark:bg-zinc-850 p-4 rounded-2xl border border-dashed border-sage/40 dark:border-zinc-750 flex flex-col items-center justify-center gap-3">
                <h4 className="text-xs font-bold text-neutral-550 dark:text-zinc-400">Image Asset Location</h4>
                
                {/* File picker */}
                <label className="px-4 py-2 bg-neutral-900 dark:bg-bronze hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-lg shadow cursor-pointer transition-colors flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  Select Computer Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, (b64) => setGalleryForm({ ...galleryForm, imageSrc: b64 }))}
                    className="hidden"
                  />
                </label>

                {/* Direct text fallback */}
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Or specify image URL</p>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/your-image"
                  value={galleryForm.imageSrc.startsWith("data:") ? "" : galleryForm.imageSrc}
                  onChange={(e) => setGalleryForm({ ...galleryForm, imageSrc: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 text-xs text-neutral-850 rounded"
                />

                {/* Micro Thumbnail */}
                {galleryForm.imageSrc && (
                  <div className="pt-2 flex flex-col items-center gap-1">
                    <p className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Image linked successfully!
                    </p>
                    <img
                      src={galleryForm.imageSrc}
                      alt="Local Upload Mini preview"
                      className="w-20 h-16 object-cover rounded-lg border shadow-inner"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-bronze hover:bg-opacity-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Publish Image to Gallery
              </button>

            </form>
          </div>

          {/* Current Gallery Roster */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-800 border border-sage/20 dark:border-zinc-700 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-display font-bold text-neutral-800 dark:text-cream">
              Active Roster List
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
              {gallery.map((item) => (
                <div key={item.id} className="relative rounded-xl overflow-hidden border group bg-neutral-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <button
                      onClick={() => deleteGalleryItem(item.id)}
                      className="p-2 bg-red-650 hover:bg-red-700 rounded text-white cursor-pointer"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-1.5 bg-white dark:bg-zinc-800 space-y-0.5">
                    <p className="text-[8px] uppercase tracking-wider font-mono text-bronze truncate font-bold">{item.category}</p>
                    <p className="text-[10px] text-neutral-800 dark:text-white truncate font-semibold" title={item.title}>{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         PANEL 3: CONTACT ENQUIRIES
         ========================================================================= */}
      {activeTab === "enquiries" && (
        <div className="bg-white dark:bg-zinc-800 border border-sage/20 dark:border-zinc-700 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-sage/15 dark:border-zinc-700">
            <h2 className="text-lg font-display font-bold text-neutral-800 dark:text-cream">
              Client Enquiries Feed
            </h2>
            <p className="text-xs text-neutral-400">Total list of contact submissions logged right from Website.</p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-zinc-900 text-neutral-600 dark:text-zinc-400 font-mono text-[10px] uppercase tracking-wider border-b border-sage/10 dark:border-zinc-800">
                  <th className="p-4.5 font-bold">Client Contact</th>
                  <th className="p-4.5 font-bold">Enquiry Message Left</th>
                  <th className="p-4.5 font-bold">Submitted Date</th>
                  <th className="p-4.5 font-bold text-center">Quick Connect</th>
                  <th className="p-4.5 font-bold text-right">Delete Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10 dark:divide-zinc-800 font-sans text-neutral-700 dark:text-zinc-200">
                {enquiries.length > 0 ? (
                  enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-neutral-50/50 dark:hover:bg-zinc-700/20">
                      
                      {/* Client name + phone */}
                      <td className="p-4.5 space-y-1">
                        <p className="font-extrabold text-neutral-800 dark:text-white">{enq.name}</p>
                        <p className="text-zinc-400 font-mono text-[10px]">{enq.phone} &middot; {enq.email}</p>
                      </td>

                      {/* Message text details */}
                      <td className="p-4.5 max-w-sm whitespace-normal">
                        <p className="text-neutral-650 dark:text-zinc-300 leading-relaxed font-light">
                          {enq.message}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="p-4.5 text-zinc-400 font-mono">
                        {new Date(enq.createdAt).toLocaleString()}
                      </td>

                      {/* WhatsApp manual launch support details */}
                      <td className="p-4.5 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <a
                            href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 flex items-center gap-1 cursor-pointer text-[10px] font-bold"
                            title="Open WhatsApp chat directly"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            WHATSAPP
                          </a>
                          <a
                            href={`mailto:${enq.email}`}
                            className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-zinc-900 dark:text-zinc-300 flex items-center gap-1 text-[10px] font-bold"
                            title="Send professional corporate email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            EMAIL
                          </a>
                        </div>
                      </td>

                      {/* Deletes logs */}
                      <td className="p-4.5 text-right">
                        <button
                          onClick={() => deleteEnquiryMessage(enq.id)}
                          className="p-2 bg-red-50 text-red-500 hover:bg-red-150 rounded-lg dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-zinc-800 cursor-pointer hover:scale-102 transition-transform"
                          title="Purge logs"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      No direct contact messages recorded from clients yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
         PANEL 4: TESTIMONIALS MANAGEMENT
         ========================================================================= */}
      {activeTab === "testimonials" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Creator Form */}
          <div className="lg:col-span-4 bg-white dark:bg-zinc-800 border border-sage/20 dark:border-zinc-700 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-display font-bold text-neutral-800 dark:text-cream">
              {isEditingTestimonial ? "Edit Review Card" : "Add Client Testimony"}
            </h2>
            <form onSubmit={handleTestimonialSubmit} className="space-y-4 text-xs font-semibold">
              
              <div className="space-y-1">
                <label className="text-neutral-550">Client Names *</label>
                <input
                  type="text"
                  value={testimonialForm.clientName}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                  placeholder="Venkatesh &amp; Kavitha"
                  required
                  className="w-full px-3 py-2 bg-cream/10 dark:bg-zinc-900 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-550">Event Type Title *</label>
                <input
                  type="text"
                  value={testimonialForm.eventType}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, eventType: e.target.value })}
                  placeholder="Royal Wedding Ceremony"
                  required
                  className="w-full px-3 py-2 bg-cream/10 dark:bg-zinc-900 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-550">Rating (1 to 5 Stars) *</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={testimonialForm.rating}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-cream/10 dark:bg-zinc-900 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-550">Review Body Text *</label>
                <textarea
                  value={testimonialForm.text}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                  rows={4}
                  placeholder="KVK Events managed our decorations, culinary kitchen schedules, and stage setups flawlessly..."
                  required
                  className="w-full px-3 py-2 bg-cream/10 dark:bg-zinc-900 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-550">Client Photo Headshot URL (Optional)</label>
                <input
                  type="url"
                  value={testimonialForm.avatarUrl}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-xxx"
                  className="w-full px-3 py-2 bg-cream/10 dark:bg-zinc-900 border rounded-xl"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-grow py-3 bg-bronze hover:bg-opacity-95 text-white font-extrabold uppercase rounded-lg cursor-pointer"
                >
                  {isEditingTestimonial ? "Save Review Card" : "Submit Review"}
                </button>
                {isEditingTestimonial && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingTestimonial(false);
                      setTestimonialForm({ id: "", clientName: "", eventType: "Wedding Ceremony", text: "", rating: 5, avatarUrl: "" });
                    }}
                    className="px-3 bg-neutral-200 text-neutral-800 rounded-lg cursor-pointer font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Current Testimonials list */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-800 border border-sage/20 dark:border-zinc-700 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-display font-bold text-neutral-800 dark:text-cream">
              Active Praises List
            </h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {testimonials.map((t) => (
                <div key={t.id} className="p-4 border rounded-2xl flex items-start gap-4 justify-between bg-neutral-50/50 dark:bg-zinc-900">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-500">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">{t.eventType}</span>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-zinc-200 leading-relaxed italic">"{t.text}"</p>
                    <p className="text-xs font-bold text-neutral-850 dark:text-cream">&middot; {t.clientName}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => triggerEditTestimonial(t)}
                      className="p-2 text-neutral-500 hover:text-bronze hover:bg-neutral-100 rounded-lg cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTestimonialRecord(t.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         PANEL 5: TEAM MANAGEMENT
         ========================================================================= */}
      {activeTab === "team" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Creator Form */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-800 border border-sage/20 dark:border-zinc-700 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-display font-bold text-neutral-800 dark:text-cream">
              {isEditingTeam ? "Modify Coordinator Details" : "Register New Coordinator"}
            </h2>
            <form onSubmit={handleTeamSubmit} className="space-y-4 text-xs font-bold">
              
              <div className="space-y-1">
                <label className="text-neutral-550">Coordinator Name *</label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  placeholder="Sreeja Reddy"
                  required
                  className="w-full px-3 py-2.5 bg-cream/10 dark:bg-zinc-900 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-550">Role Title *</label>
                <input
                  type="text"
                  value={teamForm.role}
                  onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  placeholder="Lead Wedding Planner"
                  required
                  className="w-full px-3 py-2.5 bg-cream/10 dark:bg-zinc-900 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-550">Experience Label *</label>
                <input
                  type="text"
                  value={teamForm.experience}
                  onChange={(e) => setTeamForm({ ...teamForm, experience: e.target.value })}
                  placeholder="8 Years Experience"
                  required
                  className="w-full px-3 py-2.5 bg-cream/10 dark:bg-zinc-900 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-550">Biography / Description *</label>
                <textarea
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  rows={4}
                  placeholder="Specializes in flower procurement, traditional setups, kitchen caterer audit logs..."
                  required
                  className="w-full px-3 py-2.5 bg-cream/10 dark:bg-zinc-900 border rounded-xl"
                />
              </div>

              <div className="space-y-2 bg-neutral-50 dark:bg-zinc-850 p-4 rounded-xl border border-dashed text-center">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Headshot upload</p>
                
                {/* File input */}
                <label className="px-4 py-2 bg-neutral-900 dark:bg-bronze text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow cursor-pointer transition-colors inline-block mt-1">
                  Pick Member Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, (b64) => setTeamForm({ ...teamForm, imageUrl: b64 }))}
                    className="hidden"
                  />
                </label>

                {/* fallback text URL */}
                <p className="text-[9px] text-zinc-400 font-bold uppercase mt-2">Or paste standard URL</p>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-xxx"
                  value={teamForm.imageUrl.startsWith("data:") ? "" : teamForm.imageUrl}
                  onChange={(e) => setTeamForm({ ...teamForm, imageUrl: e.target.value })}
                  className="w-full px-2 py-1.5 bg-white dark:bg-zinc-900 border mt-1 font-mono text-[10px] rounded"
                />

                {teamForm.imageUrl && (
                  <div className="pt-2">
                    <img
                      src={teamForm.imageUrl}
                      alt="Mini preview"
                      className="w-14 h-14 object-cover rounded-full mx-auto bordershadow-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-grow py-3 bg-bronze hover:bg-opacity-95 text-white font-extrabold uppercase rounded-lg cursor-pointer animate-pulse"
                >
                  {isEditingTeam ? "Save Coordinator Details" : "Register Coordinator"}
                </button>
                {isEditingTeam && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingTeam(false);
                      setTeamForm({ id: "", name: "", role: "", experience: "3+ Years Experience", bio: "", imageUrl: "" });
                    }}
                    className="px-3 bg-neutral-200 text-neutral-800 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Current coordinators list list */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-800 border border-sage/20 dark:border-zinc-700 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-display font-bold text-neutral-800 dark:text-cream">
              Operational Coordinators
            </h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {team.map((m) => (
                <div key={m.id} className="p-4 border rounded-2xl flex items-center gap-4 justify-between bg-neutral-50/50 dark:bg-zinc-900">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      className="w-14 h-14 rounded-full object-cover border"
                    />
                    <div>
                      <h4 className="font-display font-bold text-sm text-neutral-800 dark:text-cream">{m.name}</h4>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-bronze">{m.role}</p>
                      <p className="text-[10px] text-zinc-400">{m.experience}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => triggerEditTeam(m)}
                      className="p-2 text-neutral-500 hover:text-bronze hover:bg-neutral-100 rounded cursor-pointer"
                      title="Edit Bio details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {m.id !== "team_founder" && (
                      <button
                        onClick={() => deleteTeamRecord(m.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
