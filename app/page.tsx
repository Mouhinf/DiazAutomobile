import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { AboutHighlightSection } from "@/components/AboutHighlightSection";
import { SaleCarsSection } from "@/components/SaleCarsSection";
import { RentCarsSection } from "@/components/RentCarsSection";
// import { FeaturedCarsSection } from "@/components/FeaturedCarsSection"; // Commenté ou supprimé

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <HeroSection />
      <AboutHighlightSection />
      <SaleCarsSection />
      <RentCarsSection />
      {/* La section FeaturedCarsSection a été supprimée comme demandé */}
    </div>
  );
};

export default IndexPage;