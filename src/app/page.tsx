import { ModernNavbar } from "@/sections/ModernNavbar";
import { ModernHero } from "@/sections/ModernHero";
import { ModernHowItWorks } from "@/sections/ModernHowItWorks";
import { ModernWhyUs } from "@/sections/ModernWhyUs";
import { ModernLocations } from "@/sections/ModernLocations";
import { ModernCTA } from "@/sections/ModernCTA";
import { ModernTestimonials } from "@/sections/ModernTestimonials";
import { ModernFooter } from "@/sections/ModernFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <ModernNavbar />
      <main>
        <ModernHero />
        <ModernHowItWorks />
        <ModernWhyUs />
        <ModernLocations />
        <ModernCTA />
        <ModernTestimonials />
      </main>
      <ModernFooter />
    </div>
  );
}
