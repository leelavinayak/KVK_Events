import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image, X, ChevronLeft, ChevronRight, Share2, ZoomIn, Sparkles } from "lucide-react";
import { GalleryItem, EventCategory } from "../types";

interface GalleryProps {
  galleryItems: GalleryItem[];
}

export default function Gallery({ galleryItems }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter items
  const filteredItems = galleryItems.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  const categories: { label: string; value: EventCategory }[] = [
    { label: "All Works", value: "all" },
    { label: "Weddings", value: "weddings" },
    { label: "Engagements", value: "engagements" },
    { label: "Birthdays", value: "birthdays" },
    { label: "Corporate", value: "corporate" },
    { label: "Cultural", value: "cultural" }
  ];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % filteredItems.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* HEADER SECTION */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[10px] uppercase font-extrabold tracking-[0.16em] text-bronze bg-sage/10 px-3 py-1 inline-block border border-sage/20 rounded-none shadow-xs animate-pulse">
          Visual Memories
        </span>
        <h1 className="text-3xl font-sans font-extrabold text-brand-dark">
          Inspirational <span className="bg-gradient-to-r from-violet-deep to-indigo-brand bg-clip-text text-transparent">Event Gallery</span>
        </h1>
        <div className="h-0.5 w-16 bg-bronze mx-auto"></div>
        <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto leading-relaxed">
          A glimpse into traditional decors, high-end receptions, corporate sessions, and milestone birthday celebrations organized by KVK Events.
        </p>
      </div>

      {/* HORIZONTAL CATEGORY SELECTOR */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setSelectedCategory(cat.value);
              setLightboxIndex(null);
            }}
            className={`px-4.5 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all pointer-events-auto cursor-pointer border ${
              selectedCategory === cat.value
                ? "bg-bronze border-violet-mid text-white shadow-md shadow-bronze/10"
                : "bg-white text-neutral-700 border-sage/30 hover:text-bronze hover:border-bronze"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* MASONRY COMPONENT */}
      <AnimatePresence mode="popLayout">
        {filteredItems.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative bg-white rounded-none overflow-hidden border border-sage/20 shadow-xs cursor-pointer p-2 hover:shadow-md transition-shadow"
              >
                <div className="relative border border-sage/15 overflow-hidden">
                  {/* Image holder */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-103"
                    />
                    
                    {/* Subtle hover overlay with actions */}
                    <div className="absolute inset-0 bg-neutral-900/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-3 bg-white/15 backdrop-blur-xs rounded-none text-white border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <ZoomIn className="w-5 h-5 text-cream" />
                      </div>
                    </div>
                  </div>

                  {/* Card description details */}
                  <div className="p-4 flex items-center justify-between border-t border-sage/12 bg-cream/10">
                    <div className="space-y-1">
                      <span className="text-[9px] tracking-widest font-extrabold uppercase text-[#6930C3] block font-sans">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-sans font-bold text-brand-dark leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    <div className="p-1.5 rounded-none text-neutral-400">
                      <Image className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-none border border-dashed border-sage/25">
            <p className="text-xs text-neutral-500 italic">No images exist under this category block yet.</p>
          </div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX IMPLEMENTATION */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex flex-col justify-between p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Header toolbar */}
          <div className="flex justify-between items-center h-16 max-w-7xl mx-auto w-full text-cream z-10 px-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-bronze animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-neutral-400 font-sans">
                {filteredItems[lightboxIndex].category}
              </span>
            </div>
            <button 
              onClick={() => setLightboxIndex(null)}
              className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-none transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main central container */}
          <div className="flex-grow flex items-center justify-center relative w-full h-[60vh]">
            {/* Arrow Nav Left */}
            <button
              onClick={handlePrev}
              className="absolute left-4 z-10 p-2.5 rounded-none bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
              aria-label="Previous work"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Core Image Display with details */}
            <div className="max-w-4xl max-h-full px-4 flex flex-col items-center justify-center">
              <img
                src={filteredItems[lightboxIndex].imageUrl}
                alt={filteredItems[lightboxIndex].title}
                className="max-h-[70vh] max-w-full object-contain rounded-none shadow-2xl border border-zinc-800"
                onClick={(e) => e.stopPropagation()} // stop auto close
              />
            </div>

            {/* Arrow Nav Right */}
            <button
              onClick={handleNext}
              className="absolute right-4 z-10 p-2.5 rounded-none bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
              aria-label="Next work"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Footer stats bar */}
          <div className="h-20 text-center max-w-2xl mx-auto w-full text-white z-10 p-2 flex flex-col justify-center items-center gap-1 select-none">
            <h2 className="font-sans font-bold text-base text-cream">
              {filteredItems[lightboxIndex].title}
            </h2>
            <p className="text-[10px] font-mono tracking-widest text-[#80ffdb] uppercase">
              Image {lightboxIndex + 1} of {filteredItems.length}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
