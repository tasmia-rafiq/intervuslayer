import Navbar from "@/components/ui/navbar";
import Hero from "@/components/ui/landing/Hero";
import ProductMockup from "@/components/ui/landing/ProductMockup";
import RoleStrip from "@/components/ui/landing/RoleStrip";
import FeaturesGrid from "@/components/ui/landing/FeaturesGrid";
import Timeline from "@/components/ui/landing/Timeline";
import FeedbackReport from "@/components/ui/landing/FeedbackReport";
import FinalCta from "@/components/ui/landing/FinalCta";
import Footer from "@/components/ui/landing/Footer";
import Pricing from "@/components/ui/landing/Pricing";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen text-[#F4F1EA]">
      <Navbar />

      <Hero />

      <div className="bg-[#050607]">
        <ProductMockup />
        <RoleStrip />
        <FeaturesGrid />
        <Timeline />
        <FeedbackReport />
        <Pricing />
        <FinalCta />
        <Footer />
      </div>
    </main>
  );
}
