import React, { useState } from "react";
import { Menu, X, Calendar, Lock, Phone, MapPin, Sparkles, Clock, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isAdmin: boolean;
  logoutAdmin: () => void;
}

export default function Header({
  currentPage,
  setCurrentPage,
  isAdmin,
  logoutAdmin
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", value: "home" },
    { label: "About Us", value: "about" },
    { label: "Gallery", value: "gallery" },
    { label: "Contact", value: "contact" }
  ];

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-300 backdrop-blur-md bg-opacity-95 bg-cream border-b border-sage/40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8.5 h-8.5 bg-bronze flex items-center justify-center text-cream font-display font-extrabold text-[18px] rounded-none shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0 border border-cream/20">
              K
            </div>
            <div>
              <span className="text-sm sm:text-base font-display font-black tracking-[0.12em] text-bronze uppercase transition-colors duration-200 group-hover:text-[#c38c5b]">
                KVK EVENTS
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => {
              const active = currentPage === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => handleNavClick(item.value)}
                  className={`group relative py-2 text-[11px] font-sans font-black uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer ${
                    active 
                      ? "text-bronze" 
                      : "text-neutral-600 hover:text-bronze"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {/* Premium Under-line fluid slide effect */}
                  <span className={`absolute bottom-0 left-0 h-[2.5px] bg-bronze transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </button>
              );
            })}
          </nav>

          {/* Actions Block: Call Booking */}
          <div className="hidden md:flex items-center gap-4">
            {/* Quick action button */}
            <button
              onClick={() => handleNavClick("bookings")}
              className="px-6 py-3.5 bg-bronze hover:bg-[#1a1824] border border-transparent hover:border-[#1a1824] text-cream text-[11px] font-sans font-black uppercase tracking-[0.14em] rounded-none transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-cream" />
              Book Event
            </button>
          </div>

          {/* Mobile Right Block (Hamburger) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 min-w-[42px] min-h-[42px] flex items-center justify-center rounded-none text-neutral-800 border border-sage/55 cursor-pointer bg-cream hover:bg-sage/10 hover-rotate-90 transition-all duration-300 active:scale-95"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-bronze transition-transform duration-300 rotate-90" /> : <Menu className="w-5 h-5 transition-transform duration-300" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Elegant glass-like dark backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-x-0 bottom-0 top-[64px] bg-neutral-900/40 backdrop-blur-xs z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Tapestry Dropdown Drawer */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className="absolute top-full left-0 w-full bg-cream border-t border-b border-sage/30 shadow-2xl z-50 md:hidden overflow-hidden origin-top"
            >
              <div className="px-5 pt-5 pb-8 space-y-6 max-h-[80vh] overflow-y-auto">
                
                {/* Optional tag line or metadata */}
                <div className="flex items-center justify-between border-b border-sage/20 pb-3">
                  <span className="text-[9px] uppercase font-bold tracking-[0.16em] text-[#6930C3]">
                    Curated Masterpieces
                  </span>
                  <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
                    <Sparkles className="w-3 h-3 text-bronze animate-pulse" />
                    <span>Renigunta, Tirupati Dist.</span>
                  </div>
                </div>

                {/* Staggered Navigation Items */}
                <motion.div 
                  initial="closed"
                  animate="open"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.08 }
                    }
                  }}
                  className="space-y-1.5"
                >
                  {navItems.map((item) => {
                    const active = currentPage === item.value;
                    return (
                      <motion.div
                        key={item.value}
                        variants={{
                          closed: { x: -12, opacity: 0 },
                          open: { x: 0, opacity: 1 }
                        }}
                        transition={{ type: "spring", stiffness: 240, damping: 20 }}
                      >
                        <button
                          onClick={() => handleNavClick(item.value)}
                          className={`w-full text-left px-5 py-3 text-xs font-black uppercase tracking-[0.14em] rounded-none border-l-2 transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                            active 
                              ? "bg-bronze/10 text-bronze border-bronze font-black" 
                              : "text-neutral-700 bg-transparent border-transparent hover:bg-sage/10 hover:border-sage"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className={`w-1.5 h-1.5 rounded-full bg-bronze transition-all duration-300 ${
                            active ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-60"
                          }`} />
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Micro details / Fast Contacts */}
                <div className="pt-4 border-t border-sage/20 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Hotline link */}
                    <a 
                      href="tel:+919177220783" 
                      className="p-3 bg-white/60 border border-sage/15 hover:border-bronze/30 transition-all flex items-center gap-3"
                    >
                      <div className="w-8.5 h-8.5 bg-sage/10 text-bronze flex items-center justify-center shrink-0 border border-sage/25">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-[#6930C3] font-extrabold">
                          Hotline Support
                        </p>
                        <p className="text-[11px] font-black text-neutral-800 font-mono tracking-tight mt-0.5">
                          +91 91772 20783
                        </p>
                      </div>
                    </a>

                    {/* Elite HQ location */}
                    <div className="p-3 bg-white/60 border border-sage/15 flex items-center gap-3">
                      <div className="w-8.5 h-8.5 bg-sage/10 text-bronze flex items-center justify-center shrink-0 border border-sage/25">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-[#6930C3] font-extrabold">
                          Location HQ
                        </p>
                        <p className="text-[11px] font-bold text-neutral-800 tracking-tight mt-0.5">
                          Renigunta, Tirupati Dist.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Premium Book Now button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleNavClick("bookings")}
                    className="w-full text-center py-4 bg-bronze hover:bg-[#1a1824] active:scale-[0.99] text-[#faf9f6] font-sans font-black rounded-none uppercase tracking-[0.16em] text-xs transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2 border border-bronze"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#faf9f6]" />
                    Book Event Now
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
