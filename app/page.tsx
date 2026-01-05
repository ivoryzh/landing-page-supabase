import { Suspense } from "react";
import { Copyright } from "@/components/copyright";
import { HeroSection } from "@/components/landing/hero-section";
import { HomeSteps } from "@/components/home-steps";
import { DeveloperDemo } from "@/components/landing/developer-demo";
import { Personas } from "@/components/landing/personas";
import { Community } from "@/components/landing/community";
import { Partners } from "@/components/landing/partners";
// import { GallerySection } from "@/components/landing/gallery-section";
import { FeaturedGallery } from "@/components/landing/featured-gallery";
import { Team } from "@/components/landing/team";
import { OpenSource } from "@/components/landing/open-source";

// import { FAQ } from "@/components/landing/faq";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthButton } from "@/components/auth-button";

// import { FAQ } from "@/components/landing/faq";

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar authButton={<AuthButton />} />

      <main className="flex-1 flex flex-col gap-0 w-full">
        <HeroSection />
        <Partners />
        <DeveloperDemo />
        <HomeSteps />
        <Personas />
        <FeaturedGallery />
        <Team />
        <OpenSource />

        {/* <GallerySection /> */}
        {/* <FAQ /> */}
      </main>

      <Footer />
    </div>
  );
}
