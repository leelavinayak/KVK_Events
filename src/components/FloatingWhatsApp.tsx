import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export default function FloatingWhatsApp() {
  const phoneNumber = "919177220783"; // standard active company number placeholder
  const messageText = "Hello KVK Events, I would like to know more about your event services.";
  const encodedText = encodeURIComponent(messageText);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Soft, organic pop sound synthesis using the Web Audio API
  const playPopSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      
      // If browser context is suspended, attempt to resume (or fail silently under iframe autoplay restrictions)
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = "sine";
      const now = ctx.currentTime;

      // Soft tactile pop sweep: fast pitch descent from 650Hz down to 180Hz
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

      // Fluid envelope: slight linear attack, swift exponential decay
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.08, now + 0.015); // keeping it very sweet, soft and subtle
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {
      // Graceful bypass of Web Audio API restrictions
    }
  };

  useEffect(() => {
    // Play subtle tactile pop sound synchronized with the staggered spring entrance
    const popSoundTimer = setTimeout(() => {
      playPopSound();
    }, 650);

    // Show tooltip after button slides in
    const showTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 1400);

    // Auto-hide tooltip after some seconds to prevent workspace clutter
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 7500);

    return () => {
      clearTimeout(popSoundTimer);
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // smooth spring easing configuration for luxury organic response
  const smoothTransition = {
    type: "spring",
    stiffness: 350,
    damping: 24,
    mass: 0.7
  };

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 25, 
      rotate: -10 
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 140,
        damping: 15,
        staggerChildren: 0.15,
        delayChildren: 0.6,
        rotate: { type: "spring", stiffness: 100, damping: 15 }
      }
    }
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      y: 90, 
      scale: 0.4,
      rotate: -15
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 160,
        damping: 11, // elegant playful bounce
        mass: 0.85
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group"
    >
      
      {/* Tooltip speech bubble */}
      <motion.div 
        animate={(showTooltip || isHovered) ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.8 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 20
        }}
        className="bg-white dark:bg-zinc-800 text-neutral-800 dark:text-zinc-100 text-[10px] font-sans font-bold uppercase tracking-[0.08em] px-3 py-1.5 rounded-none shadow-xl border border-sage/30 dark:border-zinc-700 select-none flex items-center gap-1.5 z-50"
      >
        <Sparkles className="w-3 h-3 text-bronze animate-pulse" />
        Chat with K. Vamsi Krishna!
      </motion.div>

      {/* Floating Action Button */}
      <motion.a
        variants={buttonVariants}
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="relative w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer ring-4 ring-emerald-500/20 active:ring-emerald-500/40 select-none"
        aria-label="Contact us on WhatsApp"
        whileHover="hover"
        whileTap={{ scale: 0.93 }}
        transition={smoothTransition}
      >
        {/* Subtle expanding background circle overlay */}
        <motion.div
          className="absolute inset-0 rounded-full bg-emerald-400 z-0"
          variants={{
            hover: { scale: 1.35, opacity: 0.25 }
          }}
          initial={{ scale: 1, opacity: 0 }}
          transition={smoothTransition}
        />

        {/* Pulsating Ring Indicator */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping opacity-60 pointer-events-none"></span>
        
        {/* Custom Speech Balloon SVG */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 relative z-10 text-cream"
          variants={{
            hover: { scale: 1.15 }
          }}
          transition={smoothTransition}
        >
          <path
            fillRule="evenodd"
            d="M1.5 12c0-4.832 3.918-8.75 8.75-8.75s8.75 3.918 8.75 8.75c0 1.637-.45 3.17-1.233 4.477l.86 3.161a1.2 1.2 0 01-1.488 1.488l-3.161-.86A8.723 8.723 0 0110.25 20.75c-4.832 0-8.75-3.918-8.75-8.75zm12.55-2.222c-.11-.2-.423-.32-.882-.55s-2.709-1.336-3.132-1.49c-.424-.153-.732-.23-.11.2a18.25 18.25 0 00-.706.706c-.441.442-.882.493-1.341.265-.459-.229-1.936-.714-3.693-2.28-1.368-1.22-2.29-2.727-2.559-3.187-.268-.459-.029-.707.2-.935.207-.205.459-.55.688-.824.23-.274.306-.459.459-.764.153-.306.076-.573-.038-.802-.115-.229-.882-2.128-1.21-2.915-.32-.771-.645-.668-.883-.68l-.75-.015a1.44 1.44 0 00-1.045.488c-.36.393-1.378 1.346-1.378 3.284s1.412 3.804 1.61 4.07c.2.266 2.778 4.242 6.729 5.946.94.405 1.674.646 2.247.828.944.3 1.806.257 2.484.156.758-.113 2.33-.952 2.66-1.874.33-.922.33-1.713.23-1.874-.098-.16-.395-.26-.853-.49z"
            clipRule="evenodd"
          />
        </motion.svg>
      </motion.a>

    </motion.div>
  );
}

