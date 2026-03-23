import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, MapPin, Mail, Phone } from "lucide-react";
import emailjs from '@emailjs/browser';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [clientData, setClientData] = useState({ name: "", email: "", restaurant: "", message: "" });
  const [statusMessage, setStatusMessage] = useState("");
  const [sentName, setSentName] = useState("");
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current?.children ?? [], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
     setSending(true);
    if (!clientData.name || !clientData.email || !clientData.restaurant || !clientData.message) {
      setStatusMessage("Please fill in all fields.");
      setSentName("");
      return;
    }
    emailjs
      .sendForm(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, formRef.current, {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      })
      .then(
        () => {
          setSending(false);
          setStatusMessage("Message sent successfully!");
          setSentName(`Thank you, ${clientData.name}!`);
          setClientData({ name: "", email: "", restaurant: "", message: "" });
        },
        (error) => {
          setSending(false);
          setStatusMessage("Failed to send message. Please try again.");
        },
      );

  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-20 md:py-32 bg-warm-gradient"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="container relative z-10 px-4">
        <div
          ref={contentRef}
          className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
        >
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">
                Bring <span className="text-gradient">BrandBite</span> to Your
                Restaurant
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Launch a branded ordering and loyalty system without building
                anything from scratch. Our team will help you get started in
                days, not months.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span>abdalkareemnegm@gmail.com</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span>+20 (106) 368-1459</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span>Cairo, EG</span>
              </div>
            </div>
          </div>

          {/* Right Content - Form */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card">
            <form ref={formRef} onSubmit={sendEmail} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  name="name"
                  id="name"
                  value={clientData.name}
                  onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restaurant">Restaurant / Cafe Name</Label>
                <Input
                  value={clientData.restaurant} onChange={(e) => setClientData({ ...clientData, restaurant: e.target.value })}
                  name="restaurant"
                  id="restaurant"
                  placeholder="The Golden Spoon"
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  value={clientData.email} onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                  name="email"
                  id="email"
                  type="email"
                  placeholder="john@restaurant.com"
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  value={clientData.message} onChange={(e) => setClientData({ ...clientData, message: e.target.value })}
                  name="message"
                  id="message"
                  placeholder="Tell us about your restaurant and what you're looking for..."
                  className="min-h-[120px] resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="w-full h-12 font-semibold shadow-glow"
              >
                <Send className="w-4 h-4 mr-2" />
                {sending ? "Sending..." : "Contact Us"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
