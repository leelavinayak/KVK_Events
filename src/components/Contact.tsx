import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, AlertCircle, CheckCircle, Sparkles } from "lucide-react";

interface ContactProps {
  onSuccess: () => void;
}

export default function Contact({ onSuccess }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorText(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setErrorText("Please complete all fields of the direct message desk before sending.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to save contact message under backend repository.");
      }

      setSuccess(true);
      onSuccess(); // refresh parent listings if loaded

      // Build target pre-filled WhatsApp message
      const textMessage = `Hello KVK Events,\nI would like to know more about your event services.\n\nMy Message:\n${formData.message}\n\nName: ${formData.name}\nPhone: ${formData.phone}`;
      const encodedMessage = encodeURIComponent(textMessage);
      const kvkWhatsAppUrl = `https://wa.me/919177220783?text=${encodedMessage}`;

      // Reset form fields
      setFormData({ name: "", email: "", phone: "", message: "" });

      // Automatically launch WhatsApp redirect safely list
      setTimeout(() => {
        window.open(kvkWhatsAppUrl, "_blank");
      }, 1500);

    } catch (err: any) {
      setErrorText(err.message || "Something went wrong. Please check connection parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* HEADER STATEMENT */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-bronze bg-sage/10 px-3 py-1 inline-block border border-sage/20 rounded-none shadow-xs animate-pulse">
          Corporate Desk
        </span>
        <h1 className="text-3xl font-sans font-black text-brand-dark">
          Get In <span className="bg-gradient-to-r from-violet-deep to-indigo-brand bg-clip-text text-transparent">Touch With Us</span>
        </h1>
        <div className="h-0.5 w-16 bg-bronze mx-auto"></div>
        <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto">
          Have an upcoming engagement or grand wedding ceremony? Send KVK Events founder K. Vamsi Krishna your specifications or call our corporate desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* 1. PHYSICAL COORDINATES INFORMATION */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-none border border-sage/20 p-8 shadow-xs space-y-8 h-full flex flex-col justify-between">
            
            {/* Header detail */}
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-sage/10 text-[9px] font-bold text-bronze uppercase tracking-wider border border-sage/20">
                <Sparkles className="w-3 h-3 text-bronze" />
                K. Vamsi Krishna's Office
              </span>
              <h2 className="text-xl font-sans font-extrabold text-brand-dark">
                KVK Events Headquarters
              </h2>
              <p className="text-xs text-neutral-400 font-light leading-relaxed font-sans">
                Stop by to discuss floral prototypes, structural dimensions, or banquet caterers.
              </p>
            </div>

            {/* List contacts */}
            <div className="space-y-6 flex-grow py-4 font-sans">
              
              {/* Address card */}
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-none bg-sage/10 text-bronze flex items-center justify-center shrink-0 border border-sage/20">
                  <MapPin className="w-4 h-4 text-bronze" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-[#6930C3]">
                    Address block
                  </h4>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed font-semibold">
                    Malavaram, Renigunta, <br />
                    Tirupati District, Andhra Pradesh, <br />
                    India
                  </p>
                </div>
              </div>

              {/* Phones card */}
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-none bg-sage/10 text-bronze flex items-center justify-center shrink-0 border border-sage/20">
                  <Phone className="w-4 h-4 text-bronze" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-[#6930C3]">
                    Hotlines
                  </h4>
                  <p className="text-xs text-neutral-700 mt-1 font-bold">
                    +91 91772 20783
                  </p>
                  <p className="text-[10px] text-neutral-400 font-light font-sans">Support Desk Available (9 AM - 8 PM)</p>
                </div>
              </div>

              {/* Emails card */}
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-none bg-sage/10 text-bronze flex items-center justify-center shrink-0 border border-sage/20">
                  <Mail className="w-4 h-4 text-bronze" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-[#6930C3]">
                    Electronic Mail
                  </h4>
                  <p className="text-xs text-neutral-700 mt-1 leading-tight break-all font-semibold">
                    info@kvkevents.com
                  </p>
                </div>
              </div>

              {/* Hours card */}
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-none bg-sage/10 text-bronze flex items-center justify-center shrink-0 border border-sage/20">
                  <Clock className="w-4 h-4 text-bronze" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-[#6930C3]">
                    Working Hours
                  </h4>
                  <p className="text-xs text-neutral-700 mt-1 font-bold">
                    Monday - Saturday
                  </p>
                  <p className="text-[10px] text-neutral-400 font-light font-sans">9:00 AM - 8:00 PM</p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 2. CONTACT MESSAGE FORM */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-none border border-sage/20 p-8 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-all">
            
            <div className="space-y-2">
              <h2 className="text-xl font-sans font-extrabold text-brand-dark">
                Send Direct Message
              </h2>
              <p className="text-xs text-neutral-400 font-light leading-relaxed font-sans">
                Your messages sync safely to our data vault and automatically route into standard WhatsApp support pipelines.
              </p>
            </div>

            {success ? (
              <div className="text-center py-12 space-y-4 font-sans">
                <div className="w-16 h-16 bg-cream/50 text-bronze rounded-none flex items-center justify-center mx-auto border border-sage/35 animate-bounce">
                  <CheckCircle className="w-8 h-8 text-bronze" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto font-light leading-relaxed">
                  Your message has been archived. We are redirecting you to WhatsApp to complete details sharing instantly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 pt-6 font-sans">
                
                {errorText && (
                  <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-none text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{errorText}</span>
                  </div>
                )}

                {/* Input row block */}
                <div className="space-y-4">
                  
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-extrabold tracking-widest text-[#6930C3]">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                      className="w-full px-4 py-2.5 bg-cream/10 rounded-none border border-sage/40 text-neutral-800 text-xs focus:outline-none focus:ring-1 focus:ring-bronze"
                    />
                  </div>

                  {/* Email & Phone side-by-side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-extrabold tracking-widest text-[#6930C3]">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-3 py-2.5 bg-cream/10 rounded-none border border-sage/40 text-neutral-850 text-xs focus:outline-none focus:ring-1 focus:ring-bronze"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-extrabold tracking-widest text-[#6930C3]">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-3 py-2.5 bg-cream/10 rounded-none border border-sage/40 text-neutral-855 text-xs focus:outline-none focus:ring-1 focus:ring-bronze"
                      />
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-extrabold tracking-widest text-[#6930C3]">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Explain your queries or event specs here..."
                      className="w-full px-4 py-3 bg-cream/10 rounded-none border border-sage/40 text-neutral-850 text-xs focus:outline-none focus:ring-1 focus:ring-bronze resize-y"
                    />
                  </div>

                </div>

                {/* Send action */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-bronze hover:bg-violet-mid text-white rounded-none font-bold uppercase text-xs tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-2 active:scale-95 duration-200"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message &amp; Chat on WhatsApp
                    </>
                  )}
                </button>

              </form>
            )}

          </div>
        </div>

      </div>

      {/* 3. GOOGLE MAPS IFRAME INTEGRATION */}
      <section className="space-y-4 font-sans">
        <h2 className="text-xl font-bold bg-gradient-to-r from-violet-deep via-indigo-brand to-[#48bfe3] bg-clip-text text-transparent">
          Our Geographic Location (Renigunta, AP)
        </h2>
        <div className="rounded-none overflow-hidden border border-sage/30 shadow-xs h-96 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15512.721497910545!2d79.5080004!3d13.640003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4f1418721bfdf3%3A0x6bba847c213426e!2sRenigunta%2C%20Andhra%20Pradesh%20517520!5e0!3m2!1sen!2sin!4v1717900000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="KVK Events Office Map location Renigunta"
            className="filter grayscale-[5%] contrast-[102%]"
          ></iframe>
        </div>
      </section>

    </div>
  );
}
