import React from "react";
import { Mail, Phone, MapPin, Clock, Sparkles, Facebook, Instagram, Youtube, Heart } from "lucide-react";

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  
  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0f0e15] border-t border-sage/15 text-zinc-300">
      
      {/* Upper footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick("home")}>
              <div className="p-2 rounded-none bg-bronze text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm font-sans font-black text-white tracking-widest uppercase">
                KVK <span className="text-bronze font-light italic">Events</span>
              </span>
            </div>
            
            <p className="text-xs leading-relaxed text-zinc-400 font-light font-sans">
              Creating unforgettable and extraordinary celebrations under the creative leadership of K. Vamsi Krishna. Our commitment is perfection, elegance, and end-to-end meticulous service delivery.
            </p>

            {/* Social media icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a 
                href="https://facebook.com/kvkevents" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-none bg-zinc-900 hover:bg-bronze hover:text-white transition-all text-zinc-400 cursor-pointer border border-zinc-800"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://instagram.com/kvkevents" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-none bg-zinc-900 hover:bg-bronze hover:text-white transition-all text-zinc-400 cursor-pointer border border-zinc-800"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://youtube.com/kvkevents" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-none bg-zinc-900 hover:bg-bronze hover:text-white transition-all text-zinc-400 cursor-pointer border border-zinc-800"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://wa.me/919177220783?text=Hello%20KVK%20Events" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-none bg-zinc-900 hover:bg-bronze hover:text-white transition-all text-zinc-400 cursor-pointer border border-zinc-800"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="text-white font-sans text-xs font-bold tracking-[0.2em] uppercase mb-5 pl-2 border-l border-bronze">
              Quick Navigation
            </h3>
            <ul className="space-y-3 text-xs font-light font-sans">
              <li>
                <button 
                  onClick={() => handleNavClick("home")}
                  className="hover:text-bronze transition-colors flex items-center gap-1.5 cursor-pointer text-zinc-400"
                >
                  &middot; Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick("about")}
                  className="hover:text-bronze transition-colors flex items-center gap-1.5 cursor-pointer text-zinc-400"
                >
                  &middot; About &amp; Founder
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick("gallery")}
                  className="hover:text-bronze transition-colors flex items-center gap-1.5 cursor-pointer text-zinc-400"
                >
                  &middot; Event Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick("bookings")}
                  className="hover:text-bronze transition-colors flex items-center gap-1.5 cursor-pointer text-zinc-400"
                >
                  &middot; Book An Event
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick("contact")}
                  className="hover:text-bronze transition-colors flex items-center gap-1.5 cursor-pointer text-zinc-400"
                >
                  &middot; Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick("admin")}
                  className="hover:text-bronze text-[9px] font-mono tracking-widest uppercase transition-colors flex items-center gap-1.5 cursor-pointer text-zinc-500"
                >
                  &middot; [Admin Portal Secure]
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details Col */}
          <div>
            <h3 className="text-white font-sans text-xs font-bold tracking-[0.2em] uppercase mb-5 pl-2 border-l border-bronze">
              Contact Desk
            </h3>
            <ul className="space-y-4 text-xs font-light text-zinc-400 font-sans">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
                <span>
                  Malavaram, Renigunta, <br />
                  Tirupati District, Andhra Pradesh, <br />
                  India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-bronze shrink-0" />
                <a href="tel:+919177220783" className="hover:text-bronze transition-colors">
                  +91 91772 20783
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-bronze shrink-0" />
                <a href="mailto:info@kvkevents.com" className="hover:text-bronze transition-colors break-all">
                  info@kvkevents.com
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours Col */}
          <div>
            <h3 className="text-white font-sans text-xs font-bold tracking-[0.2em] uppercase mb-5 pl-2 border-l border-bronze">
              Visiting Hours
            </h3>
            <div className="space-y-3 text-xs bg-zinc-950/50 p-4 rounded-none border border-zinc-800 font-sans">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-200">Monday - Saturday</p>
                  <p className="text-[10px] text-zinc-400">9:00 AM - 8:00 PM</p>
                </div>
              </div>
              <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 italic leading-relaxed">
                Sundays reserved for on-site live event executions. Calls available for emergencies.
              </div>
            </div>
          </div>

        </div>
      </div>



    </footer>
  );
}
