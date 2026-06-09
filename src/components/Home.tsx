import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, Sparkles, Trophy, Award, Users, ShieldCheck, Clock, 
  ChevronRight, Calendar, ArrowUpRight, Star, HeartHandshake, Smile, X
} from "lucide-react";
import { Testimonial } from "../types";

interface HomeProps {
  setCurrentPage: (page: string) => void;
  testimonials: Testimonial[];
  onSuccess?: () => void;
}

export default function Home({ setCurrentPage, testimonials, onSuccess }: HomeProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // User Review Submission States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewEventType, setReviewEventType] = useState("Wedding Planning");
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const reviewAvatars = [
    { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150", label: "Elegant Pearl" },
    { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150", label: "Classic Suite" },
    { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150", label: "Creative Aura" },
    { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150", label: "Modern Minimal" }
  ];

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) {
      setSubmitError("Please fill out your name and review description.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/testimonials/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: reviewName.trim(),
          eventType: reviewEventType,
          text: reviewText.trim(),
          rating: Number(reviewRating),
          avatarUrl: selectedAvatar
        })
      });

      if (!response.ok) {
        throw new Error("Could not submit your review. Please try again.");
      }

      setSubmitSuccess(true);
      setReviewName("");
      setReviewText("");
      setReviewRating(5);
      
      setTimeout(() => {
        setShowReviewModal(false);
        setSubmitSuccess(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);

    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto scroll testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const handleAction = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const services = [
    {
      title: "Wedding Planning",
      desc: "Bespoke, elegant wedding ceremonies curated to perfection. From traditional mandaps to grand luxury destination theme layouts.",
      img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
      tag: "Royal & Sacred"
    },
    {
      title: "Birthday Events",
      desc: "Playful, colorful, and highly imaginative birthday parties for kids and milestones. Magical balloon setups, theme entries, and activity zones.",
      img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
      tag: "Vibrant & Playful"
    },
    {
      title: "Corporate Events",
      desc: "Acoustics, flawless board meetings, galas, and launch events with crisp execution and precise timeline management.",
      img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
      tag: "Sleek & Professional"
    },
    {
      title: "Engagement ceremonies",
      desc: "Delicate and warm ring exchange ceremonies with bespoke backdrops and stage elements capturing unforgettable highlights.",
      img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
      tag: "Precious Beginnings"
    },
    {
      title: "Cultural Programs",
      desc: "Breathtaking lighting, folk setups, community festivals, and musical productions managed with cultural richness and scale.",
      img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800",
      tag: "Grand & Heritage"
    },
    {
      title: "Custom Event Packages",
      desc: "Tailored customized budgets covering specialized stages, gourmet caterings, custom themes, and complete end-to-end logistics.",
      img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
      tag: "Made For You"
    }
  ];

  const highlights = [
    { title: "Professional Team", desc: "Expert event planners managing logistics so you remain stress-free.", icon: Users },
    { title: "Affordable Packages", desc: "No hidden charges. Clear, cost-efficient tiers built around your goals.", icon: Trophy },
    { title: "Customized Planning", desc: "Unique theme designs personalized to your color palette and lifestyle.", icon: Sparkles },
    { title: "End-to-End Management", desc: "From customized guest receiving desks to staging, audio, and dining.", icon: ShieldCheck },
    { title: "24/7 Support", desc: "Always online and responsive for updates, revisions, and operations.", icon: Clock }
  ];

  return (
    <div className="overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center bg-cream text-neutral-800 py-16 px-4 sm:px-6 lg:px-8 border-b border-bronze/10 overflow-hidden">
        {/* Soft elegant dot pattern background with our brand violet */}
        <div className="absolute inset-0 bg-[radial-gradient(#6930C3_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-[0.06] pointer-events-none"></div>
        {/* Glowing atmospheric premium backdrop lights */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-tr from-[#80ffdb]/15 to-[#5e60ce]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-[#48bfe3]/10 to-[#7400b8]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-20">
          
          {/* Left Column: Beautiful Serif Typography */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-3 py-1 bg-sage/10 text-bronze text-[10px] font-extrabold uppercase tracking-[0.16em] rounded-none border border-sage/20 shadow-xs"
            >
              Premium Event Management
            </motion.div>
 
            {/* Heading */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", damping: 15 }}
              className="text-3xl sm:text-4xl md:text-4xl font-sans font-black leading-tight tracking-tight text-brand-dark"
            >
              Creating <br/>
              <span className="bg-gradient-to-r from-violet-deep via-indigo-brand to-blue-ocean bg-clip-text text-transparent font-black">Unforgettable</span><br/>
              Moments
            </motion.h1>

            {/* Subtext description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg text-neutral-600 max-w-md leading-relaxed font-light"
            >
              From intimate weddings to grand corporate galas, we curate experiences that linger in the heart forever. Led by founder <span className="text-bronze font-extrabold">K. Vamsi Krishna</span>.
            </motion.p>
 
            {/* Square Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button
                onClick={() => handleAction("bookings")}
                className="px-8 py-4 bg-bronze hover:bg-violet-mid text-white rounded-none font-bold uppercase text-xs tracking-widest shadow-lg shadow-bronze/20 transition-all duration-300 cursor-pointer hover:shadow-xl active:scale-95"
              >
                Explore Featured Services
              </button>
              <button
                onClick={() => handleAction("contact")}
                className="px-8 py-4 border border-bronze/45 text-bronze hover:bg-bronze/5 font-bold uppercase text-xs tracking-widest rounded-none transition-all cursor-pointer hover:border-bronze duration-300"
              >
                Contact Us
              </button>
            </motion.div>
          </div>

          {/* Right Column: Visual Layout matching the design prototype */}
          <div className="lg:col-span-5 flex flex-col gap-4 w-full min-h-[460px] justify-between">
            
            {/* Elegant Double Beige Frame Panel */}
            <div className="relative flex-1 bg-sage/10 p-8 text-center flex flex-col items-center justify-center border border-sage/30 rounded-none shadow-md overflow-hidden min-h-[260px] group">
               <div className="absolute inset-0 border-[12px] border-champagne/40 opacity-70 pointer-events-none"></div>
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-25 select-none group-hover:scale-105 transition-transform duration-700"></div>

               <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-1 bg-bronze mb-6"></div>
                  <h3 className="text-2xl font-sans font-bold text-brand-dark mb-2 tracking-tight">
                    Weddings &amp; Engagements
                  </h3>
                  <p className="text-xs text-neutral-600 max-w-xs font-light leading-relaxed">
                    Crafting the perfect beginning to your forever story with classic elegance, poise, and custom floral architectures.
                  </p>
               </div>
            </div>

            {/* Bottom grid elements */}
            <div className="h-[180px] grid grid-cols-2 gap-4">
              
              {/* Left Orange/Bronze Panel */}
              <div 
                onClick={() => handleAction("gallery")}
                className="bg-bronze hover:bg-violet-mid relative overflow-hidden flex items-end p-5 group cursor-pointer shadow-sm transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center opacity-15 group-hover:scale-110 transition-transform duration-500"></div>
                <span className="text-cream font-sans font-extrabold text-lg leading-tight uppercase tracking-tighter relative z-10">
                  Corporate <br/>Events
                </span>
              </div>

              {/* Right Olive/Greenish Moss Panel */}
              <div 
                onClick={() => handleAction("gallery")}
                className="bg-sage relative overflow-hidden flex items-end p-5 group cursor-pointer shadow-sm hover:opacity-95 transition-opacity"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center opacity-15 group-hover:scale-110 transition-transform duration-500"></div>
                <span className="text-zinc-900 font-sans font-extrabold text-lg leading-tight uppercase tracking-tighter relative z-10">
                  Cultural <br/>Programs
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2. ABOUT MINI-SUMMARY */}
      <section className="py-24 bg-cream/45 dark:bg-zinc-900/50 border-b border-sage/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Rich Narrative & Founder Promise (7 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", damping: 18 }}
              className="lg:col-span-7 space-y-6"
            >
              <span className="text-[10px] uppercase font-extrabold tracking-[0.16em] text-bronze bg-sage/10 px-3 py-1 inline-block border border-sage/30 rounded-none shadow-xs">
                Who We Are
              </span>
              
              <h2 className="text-3xl sm:text-4xl font-sans font-black text-brand-dark leading-tight tracking-tight">
                Crafting Legacies Under Founder <br />
                <span className="bg-gradient-to-r from-violet-deep to-indigo-brand bg-clip-text text-transparent font-black">
                  K. Vamsi Krishna
                </span>
              </h2>
              
              <div className="space-y-4 text-neutral-600 leading-relaxed text-sm font-light">
                <p>
                  KVK Events was established with a singular focus: to elevate standard gatherings into bespoke experiences that capture client personalities. From our headquarters in <strong className="text-brand-dark font-medium">Malavaram, Renigunta, Tirupati District</strong>, we coordinate elite weddings, royal banquets, corporate setups, and breathtaking cultural installations.
                </p>
                <p>
                  Under the creative direction of founder <strong className="text-brand-dark font-semibold">K. Vamsi Krishna</strong>, we handle every coordinate with pristine touch—blending modern staging standards with ancient hospitality roots.
                </p>
              </div>

              {/* Elegant Accent Founder's Promise Quote box */}
              <div className="relative pl-6 border-l-4 border-bronze/80 py-2.5 my-6 bg-champagne/10 border-r border-[#1a1824]/5 p-4">
                <p className="text-xs text-neutral-500 font-sans italic leading-relaxed">
                  "An event is not just a gathering. It is a canvas of emotions, laughter, and relationships that deserve gold-standard, magnificent planning and perfection."
                </p>
                <p className="text-[10px] uppercase font-black tracking-widest text-bronze mt-2">
                  — K. Vamsi Krishna, Founder
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleAction("about")}
                  className="inline-flex items-center gap-1.5 font-extrabold text-xs uppercase tracking-widest text-brand-dark hover:text-bronze transition-all z-20 cursor-pointer border-b-2 border-bronze pb-0.5 hover:translate-x-1 duration-300"
                >
                  Read Our Full Story
                  <ArrowUpRight className="w-3.5 h-3.5 text-bronze" />
                </button>
              </div>
            </motion.div>

            {/* Right Column: Premium Framed Image ONLY (5 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", damping: 18, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="relative group mx-auto max-w-sm lg:max-w-none">
                {/* Visual back framing borders */}
                <div className="absolute -inset-2 border border-bronze/35 pointer-events-none translate-x-3 translate-y-3 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform duration-500"></div>
                <div className="absolute -inset-2 border border-[#1a1824]/10 pointer-events-none -translate-x-3 -translate-y-3 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>
                
                {/* Main image container */}
                <div className="relative overflow-hidden bg-[#1a1824] aspect-[4/5] shadow-2xl border border-sage/20">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600"
                    alt="K. Vamsi Krishna - Founder of KVK Events"
                    className="w-full h-full object-cover grayscale text-white group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  
                  {/* Subtle luxury bronze badge over the image corner */}
                  <div className="absolute top-4 left-4 bg-bronze text-cream px-3 py-1.5 text-[8px] font-sans font-extrabold uppercase tracking-[0.25em] border border-cream/20 shadow-lg">
                    Creative Director
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-sage/20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.16em] text-bronze bg-sage/10 px-3 py-1 inline-block border border-sage/30 rounded-none shadow-xs">
            Exquisite Offerings
          </span>
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-brand-dark">
            Our Signature Event Services
          </h2>
          <div className="h-0.5 w-16 bg-bronze mx-auto"></div>
          <p className="text-xs text-neutral-500 max-w-md mx-auto font-light leading-relaxed">
            Every category is managed by dedicated planners equipped to execute your requirements flawlessly. Enjoy customized hospitality.
          </p>
        </div>

        {/* Services Grid with Editorial Styles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-none overflow-hidden border border-sage/25 shadow-sm flex flex-col hover:shadow-md transition-all h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={svc.img}
                  alt={svc.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 right-4 bg-cream/95 text-neutral-800 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border border-sage/30 shadow-sm">
                  {svc.tag}
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-sans font-bold text-lg text-brand-dark">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    {svc.desc}
                  </p>
                </div>
                <button
                  onClick={() => handleAction("bookings")}
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-extrabold text-bronze hover:text-brand-dark border-b-2 border-bronze pb-0.5 self-start transition-colors cursor-pointer group"
                >
                  Book Planning
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. STATISTICS */}
      <section className="bg-sage/10 border-y border-sage/20 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-sage/30">
            
            <div className="py-4 sm:py-0 space-y-1.5 animate-pulse">
              <p className="text-4xl sm:text-5xl font-sans font-black text-bronze tracking-tight">
                500+
              </p>
              <p className="text-[10px] font-sans tracking-[0.2em] font-extrabold uppercase text-brand-dark">
                Events Managed
              </p>
              <p className="text-xs text-neutral-500 font-light">Weddings, luxury galas, birthdays</p>
            </div>

            <div className="py-4 sm:py-0 space-y-1.5">
              <p className="text-4xl sm:text-5xl font-sans font-black text-bronze tracking-tight">
                300+
              </p>
              <p className="text-[10px] font-sans tracking-[0.2em] font-extrabold uppercase text-brand-dark">
                Happy Families
              </p>
              <p className="text-xs text-neutral-500 font-light">Smiles, reviews &amp; corporate keynotes</p>
            </div>

            <div className="py-4 sm:py-0 space-y-1.5">
              <p className="text-4xl sm:text-5xl font-sans font-black text-bronze tracking-tight">
                6+ Years
              </p>
              <p className="text-[10px] font-sans tracking-[0.2em] font-extrabold uppercase text-brand-dark">
                Of Planning Pride
              </p>
              <p className="text-xs text-neutral-500 font-light">Unmatched execution expertise</p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-cream/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] uppercase font-extrabold tracking-[0.16em] text-bronze bg-sage/10 px-3 py-1 inline-block border border-sage/20 rounded-none shadow-xs">
              Premium Guarantee
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black text-brand-dark leading-tight">
              Why Celebrities &amp; Businesses Choose KVK Events
            </h2>
            <div className="h-0.5 w-16 bg-bronze"></div>
            <p className="text-neutral-600 leading-relaxed text-xs font-light">
              We operate an ecosystem of decorators, premium caterers, state-of-the-art acoustics experts, and custom craftsmen. This gives K. Vamsi Krishna the ability to deliver turnkey results on short schedules.
            </p>
            <div className="bg-white p-6 rounded-none border border-sage/25 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-champagne/30 text-bronze rounded-none shrink-0 border border-champagne/45">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-brand-dark text-base">
                  Trust &amp; Transparency
                </h4>
                <p className="text-xs text-neutral-500 font-light">
                  Fixed pricing, validated supplier bills, and consistent timeline updates via WhatsApp integration.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((hlt, idx) => {
              const IconComp = hlt.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 bg-white border border-sage/20 rounded-none shadow-xs hover:shadow-sm transition-shadow flex flex-col gap-3"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-none bg-sage/10 text-bronze">
                    <IconComp className="w-4.5 h-4.5 text-bronze" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-sans font-bold text-sm text-neutral-800">
                      {hlt.title}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed font-light">
                      {hlt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS SLIDER */}
      <section className="bg-cream/40 py-24 border-b border-sage/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          
          <div className="space-y-4 mb-12">
            <span className="text-[10px] uppercase font-extrabold tracking-[0.16em] text-bronze bg-sage/10 px-3 py-1 inline-block border border-sage/30 rounded-none shadow-xs">
              Client Praises
            </span>
            <h2 className="text-3xl font-sans font-extrabold text-brand-dark">
              What Clients Say About Us
            </h2>
            <div className="h-0.5 w-12 bg-bronze mx-auto"></div>
          </div>

          {testimonials.length > 0 ? (
            <div className="relative min-h-[250px] bg-white p-8 sm:p-12 rounded-none border-2 border-dashed border-sage/20 shadow-md overflow-hidden max-w-3xl mx-auto">
              
              {/* Decorative quotation mark */}
              <span className="absolute top-2 left-6 text-9xl font-sans font-extrabold text-[#5e60ce]/10 select-none">
                “
              </span>

              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 relative z-10"
              >
                {/* Rating stars */}
                <div className="flex justify-center gap-1 text-amber-500">
                  {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                {/* Text quote */}
                <p className="text-neutral-700 text-base sm:text-lg italic font-light leading-relaxed max-w-2xl mx-auto">
                  "{testimonials[activeTestimonial].text}"
                </p>

                {/* Client Identity in Publication style */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  {testimonials[activeTestimonial].avatarUrl && (
                    <img
                      src={testimonials[activeTestimonial].avatarUrl}
                      alt={testimonials[activeTestimonial].clientName}
                      className="w-10 h-10 rounded-full object-cover border border-bronze shadow-sm"
                    />
                  )}
                  <div className="text-left">
                    <p className="font-sans font-bold text-sm text-brand-dark">
                      {testimonials[activeTestimonial].clientName}
                    </p>
                    <p className="text-[9px] font-sans font-extrabold text-bronze uppercase tracking-[0.25em]">
                      {testimonials[activeTestimonial].eventType}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Slider Dots */}
              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 pt-8">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      className={`w-2.5 h-2.5 rounded-none transition-all cursor-pointer ${
                        activeTestimonial === i ? "bg-bronze px-3 h-2.5" : "bg-neutral-200"
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-neutral-500 text-xs italic">No testimonials published yet. Log in to the administrator portal to post reviews.</p>
          )}

          {/* Write a Review Button */}
          <div className="mt-12 flex flex-col items-center gap-3">
            <p className="text-[11px] text-neutral-400 font-sans tracking-wide">
              Have we planned an event for you?
            </p>
            <button
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-bronze hover:bg-[#1a1824] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-[#faf9f6] text-[10px] font-sans font-black uppercase tracking-[0.14em] transition-all duration-300 pointer-events-auto cursor-pointer text-white"
            >
              <Smile className="w-3.5 h-3.5 text-cream" />
              Share Your Experience
            </button>
          </div>

          {/* Premium Review Submission Modal */}
          <AnimatePresence>
            {showReviewModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Dark Glass Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowReviewModal(false)}
                  className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs"
                />

                {/* Form dialog box */}
                <motion.div
                  initial={{ scale: 0.93, y: 15, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.93, y: 15, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  className="relative w-full max-w-lg bg-cream border border-sage/40 p-6 sm:p-8 text-left shadow-2xl z-10 max-h-[92vh] overflow-y-auto rounded-none"
                >
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-bronze transition-colors rounded-none border border-transparent hover:border-sage/20 cursor-pointer"
                    aria-label="Close review modal"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="mb-6">
                    <span className="text-[9px] uppercase font-bold tracking-[0.16em] text-[#6930C3]">
                      KVK Celebrations
                    </span>
                    <h3 className="text-xl font-sans font-black text-brand-dark mt-1">
                      Add Your Review
                    </h3>
                    <p className="text-neutral-500 text-[11px] font-light mt-1">
                      Your feedback inspires our legacy of grandeur. Thank you for sharing.
                    </p>
                  </div>

                  {submitSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-12 text-center space-y-3"
                    >
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="font-sans font-black text-base text-neutral-800 uppercase tracking-wider">
                        Review Submitted!
                      </h4>
                      <p className="text-xs text-neutral-500 font-light max-w-xs mx-auto">
                        Your testimony has been curated and enters our archives. Grand memories live on!
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {submitError && (
                        <div className="p-3 bg-rose-50 text-rose-600 text-[11px] font-bold border-l-4 border-rose-500">
                          {submitError}
                        </div>
                      )}

                      {/* Client Name Input */}
                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase tracking-wider font-extrabold text-[#6930C3]">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. Anand &amp; Sireesha"
                          className="w-full px-4 py-2.5 bg-white/70 border border-sage/35 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-bronze focus:bg-white transition-colors rounded-none"
                        />
                      </div>

                      {/* Event Type & Star Rating Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[8px] uppercase tracking-wider font-extrabold text-[#6930C3]">
                            Event Category
                          </label>
                          <select
                            value={reviewEventType}
                            onChange={(e) => setReviewEventType(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white/70 border border-sage/35 text-xs text-neutral-800 focus:outline-none focus:border-bronze focus:bg-white transition-colors rounded-none"
                          >
                            <option value="Wedding Planning">Wedding Planning</option>
                            <option value="Birthday Event">Birthday Event</option>
                            <option value="Corporate Event">Corporate Event</option>
                            <option value="Engagement Ceremony">Engagement Ceremony</option>
                            <option value="Cultural Program">Cultural Program</option>
                            <option value="Custom Event">Custom Event</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[8px] uppercase tracking-wider font-extrabold text-[#6930C3]">
                            Rating Stars
                          </label>
                          <div className="flex items-center h-[38px] gap-1">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const isFilled = hoveredRating !== null 
                                ? star <= hoveredRating 
                                : star <= reviewRating;
                              return (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setReviewRating(star)}
                                  onMouseEnter={() => setHoveredRating(star)}
                                  onMouseLeave={() => setHoveredRating(null)}
                                  className="p-1 focus:outline-none text-neutral-200 transition-colors cursor-pointer"
                                  aria-label={`Rate ${star} Stars`}
                                >
                                  <Star 
                                    className={`w-5 h-5 transition-transform duration-150 active:scale-125 ${
                                      isFilled 
                                        ? "fill-amber-500 text-amber-500" 
                                        : "text-neutral-300"
                                    }`} 
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Avatar Selection */}
                      

                      {/* Review details */}
                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase tracking-wider font-extrabold text-[#6930C3]">
                          Review / Testimony Details
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="How did we execute your majestic celebration? (e.g. Unbelievable decorations, seamless audio, grand banquet setups...)"
                          className="w-full px-4 py-2.5 bg-white/70 border border-sage/35 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-bronze focus:bg-white transition-colors rounded-none resize-none"
                        />
                      </div>

                      {/* Submit action */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 bg-bronze hover:bg-[#1a1824] disabled:bg-neutral-300 text-[#faf9f6] text-[10px] font-sans font-black uppercase tracking-[0.16em] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-bronze"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              <span>Submitting Review...</span>
                            </>
                          ) : (
                            <>
                              <Smile className="w-3.5 h-3.5 text-white" />
                              <span>Submit Review to KVK</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 7. CALL TO ACTION BLOCK */}
      <section className="py-24 px-4 bg-brand-dark text-white relative overflow-hidden">
        {/* Neon backdrop rings inside the dark CTA bottom */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#5e60ce]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#80ffdb]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#5e60ce_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-[0.05] pointer-events-none"></div>
        
        <div className="relative max-w-4xl mx-auto text-center z-10 space-y-6">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.16em] text-[#80ffdb]">
            Let's Collaborate
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black leading-[1.1] text-white">
            Let's Make Your Event <br/>
            <span className="bg-gradient-to-r from-[#64dfdf] via-[#56cfe1] to-[#80ffdb] bg-clip-text text-transparent italic font-light">Extraordinary</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto font-light leading-relaxed">
            Contact K. Vamsi Krishna's planning desk at Tirupati District today. Share your guest list estimation and ideal date to secure your early quotation block.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={() => handleAction("bookings")}
              className="w-full sm:w-auto px-8 py-3.5 bg-bronze hover:bg-violet-mid text-white rounded-none font-bold uppercase text-xs tracking-widest shadow-md transition-all cursor-pointer active:scale-95"
            >
              Book Consultation Now
            </button>
            <button
              onClick={() => handleAction("contact")}
              className="w-full sm:w-auto px-8 py-3.5 border border-cream/35 text-cream hover:bg-cream/10 rounded-none font-bold uppercase text-xs tracking-widest transition-all cursor-pointer"
            >
              Ask Questions
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
