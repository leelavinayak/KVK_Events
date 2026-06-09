import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Calendar, User, Phone, Mail, MapPin, Users, DollarSign, FileText, Sparkles, AlertCircle, CheckCircle } from "lucide-react";

interface BookingsProps {
  onSuccess: () => void;
}

export default function Bookings({ onSuccess }: BookingsProps) {
  // Booking Form State loaded from drafts if present
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    eventType: "Wedding Planning",
    eventDate: "",
    eventLocation: "",
    guests: "100",
    budget: "₹3 - ₹5 Lakhs",
    requirements: ""
  });

  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [successStatus, setSuccessStatus] = useState(false);

  // Load from localdraft
  useEffect(() => {
    const saved = localStorage.getItem("kvk_booking_draft");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing local draft", err);
      }
    }
  }, []);

  // Save draft
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    localStorage.setItem("kvk_booking_draft", JSON.stringify(updated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorStatus(null);
    setSuccessStatus(false);

    // Form inputs client validation
    if (
      !formData.fullName || 
      !formData.mobile || 
      !formData.email || 
      !formData.eventDate || 
      !formData.eventLocation || 
      !formData.guests
    ) {
      setErrorStatus("Please complete all requested required inputs.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          guests: Number(formData.guests)
        })
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error || "Failed to catalog booking record inside Server API.");
      }

      // Success
      setSuccessStatus(true);
      localStorage.removeItem("kvk_booking_draft"); // clear draft on success

      // Clean up form visual representation
      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        eventType: "Wedding Planning",
        eventDate: "",
        eventLocation: "",
        guests: "100",
        budget: "₹3 - ₹5 Lakhs",
        requirements: ""
      });

      // Prepare text format
      const prefilledText = `Hello KVK Events,\n\nI would like to book an event.\n\nName: ${formData.fullName}\nPhone: ${formData.mobile}\nEmail: ${formData.email}\nEvent Type: ${formData.eventType}\nEvent Date: ${formData.eventDate}\nLocation: ${formData.eventLocation}\nGuests: ${formData.guests}\nBudget: ${formData.budget}\n\nPlease contact me regarding my booking.\n\nThank You.`;

      // WhatsApp link configuration
      const kvkWhatsAppNumber = "919177220783"; // KVK Events active routing phone
      const encodedText = encodeURIComponent(prefilledText);
      const targetUrl = `https://wa.me/${kvkWhatsAppNumber}?text=${encodedText}`;

      // Call onSuccess to trigger DB refetches if needed
      onSuccess();

      // Trigger standard redirection
      setTimeout(() => {
        window.open(targetUrl, "_blank");
      }, 1500);

    } catch (err: any) {
      setErrorStatus(err.message || "Something went wrong. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  const budgetOptions = [
    "Under ₹1 Lakh",
    "₹1 - ₹3 Lakhs",
    "₹3 - ₹5 Lakhs",
    "₹5 - ₹10 Lakhs",
    "₹10 - ₹20 Lakhs",
    "₹20+ Lakhs (Luxury Bespoke)"
  ];

  const eventTypes = [
    "Wedding Planning",
    "Engagement Ceremony",
    "Birthday Celebration",
    "Corporate Gala / Summit",
    "Cultural Program / Staging",
    "Private Celebration / Reunion"
  ];

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* INTRO CONTENT */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-bronze bg-sage/10 px-3 py-1 inline-block border border-sage/20 rounded-none shadow-xs animate-pulse">
          Online Reservation
        </span>
        <h1 className="text-3xl font-sans font-black text-brand-dark">
          Reserve Your <span className="bg-gradient-to-r from-violet-deep to-indigo-brand bg-clip-text text-transparent">Grand Event</span>
        </h1>
        <div className="h-0.5 w-16 bg-bronze mx-auto"></div>
        <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto">
          Double-check your parameters, submit to our digital record vault, and continue to K. Vamsi Krishna's WhatsApp desk to freeze early catering slots.
        </p>
      </div>

      <div className="relative">
        <div className="absolute -inset-1.5 border border-bronze/10 pointer-events-none"></div>
        
        <div className="relative bg-white rounded-none border border-sage/25 shadow-sm overflow-hidden p-6 sm:p-10">
          
          <AnimatePresence mode="wait">
            {successStatus ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-cream/50 text-bronze rounded-none flex items-center justify-center mx-auto border border-sage/35">
                  <CheckCircle className="w-8 h-8 text-bronze" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans font-bold text-2xl text-neutral-800">
                    Booking Logged Successfully!
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto font-light leading-relaxed">
                    Your details are recorded in our system. You are being redirected to WhatsApp to complete details sharing with KVK Events founder <strong>K. Vamsi Krishna</strong>. Let's create magic!
                  </p>
                </div>
                <div className="pt-4">
                  <a
                    href={`https://wa.me/919177220783?text=${encodeURIComponent("Hello, I just logged an event booking reservation on your website.")}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-bronze hover:bg-violet-mid text-white font-bold rounded-none uppercase text-xs tracking-widest cursor-pointer transition-colors"
                  >
                    Click to Open WhatsApp Manually
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Error Banner */}
                {errorStatus && (
                  <div className="p-4 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-none flex items-center gap-2.5 text-xs">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                    <span>{errorStatus}</span>
                  </div>
                )}

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-extrabold tracking-widest text-brand-dark flex items-center gap-1.5 font-sans">
                      <User className="w-3.5 h-3.5 text-bronze" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-cream/10 rounded-none border border-sage/40 text-neutral-800 text-xs focus:outline-none focus:ring-1 focus:ring-bronze"
                    />
                  </div>

                  {/* Mobile field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-extrabold tracking-widest text-brand-dark flex items-center gap-1.5 font-sans">
                      <Phone className="w-3.5 h-3.5 text-bronze" />
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 bg-cream/10 rounded-none border border-sage/40 text-neutral-800 text-xs focus:outline-none focus:ring-1 focus:ring-bronze"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-extrabold tracking-widest text-brand-dark flex items-center gap-1.5 font-sans">
                      <Mail className="w-3.5 h-3.5 text-bronze" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-cream/10 rounded-none border border-sage/40 text-neutral-800 text-xs focus:outline-none focus:ring-1 focus:ring-bronze"
                    />
                  </div>

                  {/* Event Type selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-extrabold tracking-widest text-brand-dark flex items-center gap-1.5 font-sans">
                      <Sparkles className="w-3.5 h-3.5 text-bronze" />
                      Event Type *
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cream/10 rounded-none border border-sage/40 text-neutral-800 text-xs focus:outline-none focus:ring-1 focus:ring-bronze cursor-pointer"
                    >
                      {eventTypes.map((t) => (
                        <option key={t} className="bg-white text-neutral-800" value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Event Date Calendar field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-extrabold tracking-widest text-brand-dark flex items-center gap-1.5 font-sans">
                      <Calendar className="w-3.5 h-3.5 text-bronze" />
                      Event Date *
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-cream/10 rounded-none border border-sage/40 text-neutral-800 text-xs focus:outline-none focus:ring-1 focus:ring-bronze cursor-pointer"
                    />
                  </div>

                  {/* Event Location field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-extrabold tracking-widest text-brand-dark flex items-center gap-1.5 font-sans">
                      <MapPin className="w-3.5 h-3.5 text-bronze" />
                      Event Location *
                    </label>
                    <input
                      type="text"
                      name="eventLocation"
                      value={formData.eventLocation}
                      onChange={handleChange}
                      required
                      placeholder="Hall Name, Nellore/Nearby area"
                      className="w-full px-4 py-3 bg-cream/10 rounded-none border border-sage/40 text-neutral-800 text-xs focus:outline-none focus:ring-1 focus:ring-bronze"
                    />
                  </div>

                  {/* Number of Guests estimation */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-extrabold tracking-widest text-brand-dark flex items-center gap-1.5 font-sans">
                      <Users className="w-3.5 h-3.5 text-bronze" />
                      Number of Guests *
                    </label>
                    <input
                      type="number"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      required
                      min="10"
                      placeholder="150"
                      className="w-full px-4 py-3 bg-cream/10 rounded-none border border-sage/40 text-neutral-800 text-xs focus:outline-none focus:ring-1 focus:ring-bronze"
                    />
                  </div>

                  {/* Budget Ranges dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-extrabold tracking-widest text-brand-dark flex items-center gap-1.5 font-sans">
                      <DollarSign className="w-3.5 h-3.5 text-bronze" />
                      Ideal Budget Range *
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cream/10 rounded-none border border-sage/40 text-neutral-800 text-xs focus:outline-none focus:ring-1 focus:ring-bronze cursor-pointer"
                    >
                      {budgetOptions.map((opt) => (
                        <option key={opt} className="bg-white text-neutral-800" value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Additional requirements textbox */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-extrabold tracking-widest text-brand-dark flex items-center gap-1.5 font-sans">
                    <FileText className="w-3.5 h-3.5 text-bronze" />
                    Additional Staging &amp; Theme Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows={4}
                    placeholder="We want a peach and warm floral stage backdrop, high LED wall integration, traditional percussionist desks, and sweet stalls..."
                    className="w-full px-4 py-3 bg-cream/10 rounded-none border border-sage/40 text-neutral-800 text-xs focus:outline-none focus:ring-1 focus:ring-bronze resize-y"
                  />
                </div>

                {/* Submit trigger */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-bronze hover:bg-violet-mid text-white rounded-none font-bold uppercase text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-3 active:scale-95 duration-200"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      Book Now &amp; Continue via WhatsApp
                    </>
                  )}
                </button>

                <p className="text-[9px] text-center text-neutral-450 font-mono uppercase tracking-[0.25em]">
                  Securely processed &middot; Transmitted directly to founder's console
                </p>

              </form>
            )}
          </AnimatePresence>

        </div>
      </div>

    </div>
  );
}
