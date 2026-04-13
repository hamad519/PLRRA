import { ContactHeroSection } from "@/components/sections/ContactHeroSection";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactInfoSection } from "@/components/sections/ContactInfoSection";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ContactHeroSection />
      <div className="container mx-auto py-24 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <ContactInfoSection />
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}