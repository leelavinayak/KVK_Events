import React from "react";
import { Users, Award, ShieldCheck, HelpCircle, Heart, Target, Lightbulb } from "lucide-react";
import { TeamMember } from "../types";

interface AboutProps {
  team: TeamMember[];
}

export default function About({ team }: AboutProps) {
  
  const founder = team.find((member) => member.id === "team_founder") || {
    name: "K. Vamsi Krishna",
    role: "Founder & Creative Director",
    experience: "6+ Years Experience",
    bio: "K. Vamsi Krishna founded KVK Events with a vision to create memorable and extraordinary experiences for clients. With years of expertise in wedding planning and large-scale corporate event execution, he leads a passionate team dedicated to delivering flawless events with creativity, unmatched dedication, and meticulous attention to details.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=500"
  };

  const remainingTeam = team.filter((member) => member.id !== "team_founder");

  return (
    <div className="py-12 space-y-24">
      
      {/* 1. BRAND STORY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.16em] text-bronze bg-sage/10 px-3 py-1 inline-block border border-sage/20 rounded-none shadow-xs">
            Our Legacy &amp; Values
          </span>
          <h1 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-neutral-900">
            The Story Behind <span className="bg-gradient-to-r from-violet-deep to-blue-ocean bg-clip-text text-transparent">KVK Events</span>
          </h1>
          <div className="h-0.5 w-16 bg-bronze mx-auto"></div>
          <p className="text-neutral-500 text-xs font-light max-w-xl mx-auto leading-relaxed">
            Delivering gold-standard planning logistics, beautiful floral staging, and immersive hospitality for 6 premium years (since 2020). Based out of Malavaram, Renigunta, Tirupati District, Andhra Pradesh.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-brand-dark">
              Turning Desires Into Premium Realities
            </h2>
            <div className="h-0.5 w-12 bg-bronze"></div>
            <p className="text-neutral-600 text-xs font-light leading-relaxed">
              Every outstanding event starts with an intimate conversation about client style, guest lists, kitchen menu expectations, and acoustic goals. At KVK Events, we believe there is no compromise when it comes to celebrating milestones like weddings, birthdays, or achievements.
            </p>
            <p className="text-neutral-600 text-xs font-light leading-relaxed">
              What started as a boutique design studio under K. Vamsi Krishna has today scaled to become Andhra Pradesh's premier destination planning network. Our operations include proprietary staging components, partnerships with five-star catering networks, and certified audio designers. This makes KVK Events a complete turnkey answer for any private celebration or corporate gather.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-none bg-sage/10 border border-bronze/20">
                <p className="text-2xl font-sans font-black text-bronze">100%</p>
                <p className="text-[10px] text-neutral-500 uppercase font-sans tracking-widest font-extrabold">Turnkey Execution</p>
              </div>
              <div className="p-4 rounded-none bg-sage/10 border border-bronze/20">
                <p className="text-2xl font-sans font-black text-bronze">100%</p>
                <p className="text-[10px] text-neutral-500 uppercase font-sans tracking-widest font-extrabold">Custom Themes</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-none overflow-hidden shadow-md h-[450px] border border-sage/25">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200"
              alt="Luxury Reception Setup"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 to-transparent flex items-end p-8">
              <div className="text-white space-y-1">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#80ffdb] font-bold">Corporate Gala Reception</p>
                <p className="font-sans font-extrabold text-lg">Exotic Flower Themes by KVK Decors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISION & MISSION */}
      <section className="bg-sage/10 py-20 border-y border-sage/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="space-y-4 bg-white p-8 rounded-none border border-sage/20 shadow-xs">
            <div className="w-12 h-12 flex items-center justify-center rounded-none bg-[#7400b8]/10 text-bronze">
              <Target className="w-5 h-5 text-bronze" />
            </div>
            <h3 className="text-lg font-sans font-bold text-brand-dark">
              Our Vision
            </h3>
            <p className="text-neutral-600 text-xs leading-relaxed font-light">
              To be the gold-reference benchmark for event design and management across South India, bringing world-class planning protocols, unmatched local crafts, and fully automated communication interfaces directly to couples and organizers.
            </p>
          </div>

          <div className="space-y-4 bg-white p-8 rounded-none border border-sage/20 shadow-xs">
            <div className="w-12 h-12 flex items-center justify-center rounded-none bg-[#7400b8]/10 text-bronze">
              <Lightbulb className="w-5 h-5 text-bronze" />
            </div>
            <h3 className="text-lg font-sans font-bold text-brand-dark">
              Our Mission
            </h3>
            <p className="text-neutral-600 text-xs leading-relaxed font-light">
              By deploying expert designers, certified acoustics, custom catering, and transparent budget algorithms, our mission is to deliver flawless, majestic celebrations while maintaining pricing accessibility and absolute respect for timeline obligations.
            </p>
          </div>

        </div>
      </section>

      {/* 3. FOUNDER PROFILE BIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.16em] text-bronze bg-sage/10 px-3 py-1 inline-block border border-sage/20 rounded-none shadow-xs">
            Meet the Architect
          </span>
          <h2 className="text-3xl font-sans font-extrabold text-brand-dark">
            Our Founder
          </h2>
          <div className="h-0.5 w-16 bg-bronze mx-auto"></div>
        </div>

        <div className="bg-white rounded-none border border-sage/25 p-8 sm:p-12 shadow-sm grid grid-[1] lg:grid-cols-12 gap-8 items-center w-full">
          
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1.5 border border-bronze/20 pointer-events-none"></div>
              <img
                src={founder.imageUrl}
                alt={founder.name}
                className="w-64 h-64 sm:w-72 sm:h-72 object-cover border-4 border-bronze shadow-md relative z-10"
              />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-sans font-extrabold text-[#7400b8] bg-sage/20 px-2.5 py-1 uppercase tracking-wider">
                {founder.experience || "Founder & Managing Director"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-sans font-extrabold text-brand-dark pt-2">
                {founder.name}
              </h3>
              <p className="text-xs font-sans font-semibold text-neutral-500">
                {founder.role}
              </p>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              {founder.bio}
            </p>

            <blockquote className="border-l-4 border-bronze bg-cream/35 p-4 rounded-none italic text-xs text-neutral-500 leading-relaxed">
              "When I plan a wedding, I understand that there are generational emotions pinned on that day. My team stands at the door from morning till night to guarantee perfection. Your guest's satisfaction is our true reward."
            </blockquote>

            <div className="flex gap-6 text-center text-xs divide-x divide-sage/40">
              <div>
                <p className="text-xl font-sans font-black text-bronze">6</p>
                <p className="text-[9px] text-[#5e60ce] uppercase tracking-widest font-extrabold">Years Active</p>
              </div>
              <div className="pl-6">
                <p className="text-xl font-sans font-black text-bronze">500+</p>
                <p className="text-[9px] text-[#5e60ce] uppercase tracking-widest font-extrabold">Turnkey Venues</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. TEAM MEMBERS DYNAMIC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.16em] text-bronze bg-sage/10 px-3 py-1 inline-block border border-sage/20 rounded-none shadow-xs">
            Support Excellence
          </span>
          <h2 className="text-3xl font-sans font-extrabold text-brand-dark">
            Our Elite Planning Team
          </h2>
          <div className="h-0.5 w-16 bg-bronze mx-auto"></div>
          <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto">
            Passionate coordinators working together to deliver flawless staging, logistics, and decorations.
          </p>
        </div>

        {remainingTeam.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingTeam.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-sage/25 rounded-none overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 duration-500 transition-transform"
                  />
                  <div className="absolute top-4 right-4 bg-cream/95 text-neutral-800 text-[9px] font-bold px-2.5 py-1 border border-sage/20 shadow-xs uppercase tracking-wider animate-pulse">
                    {member.experience}
                  </div>
                </div>
                <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <p className="text-[10px] tracking-widest text-bronze uppercase font-extrabold font-sans">
                      {member.role}
                    </p>
                    <h3 className="text-base font-sans font-bold text-neutral-800">
                      {member.name}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed font-light font-sans">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xs text-neutral-500 italic">Our coordinators list is currently being populated. Open the dashboard tab at the top right to add custom team members.</p>
        )}
      </section>

    </div>
  );
}
