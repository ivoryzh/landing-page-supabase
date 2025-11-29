import { Suspense } from "react";
import { Copyright } from "@/components/copyright";
import { HeroSection } from "@/components/landing/hero-section";
import { DeveloperDemo } from "@/components/landing/developer-demo";
import { Personas } from "@/components/landing/personas";
import { Community } from "@/components/landing/community";
import { Partners } from "@/components/landing/partners";
// import { GallerySection } from "@/components/landing/gallery-section";
import { FeaturedGallery } from "@/components/landing/featured-gallery";

// import { FAQ } from "@/components/landing/faq";

import { Navbar } from "@/components/navbar";

// import { FAQ } from "@/components/landing/faq";

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />

      <main className="flex-1 flex flex-col gap-20 w-full">
        <HeroSection />
        <DeveloperDemo />
        <Personas />
        <FeaturedGallery />
        <Community />

        {/* <GallerySection /> */}
        {/* <FAQ /> */}
        <Partners />
      </main>

      <footer className="w-full border-t border-border/40 py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-foreground">IvoryOS</p>
            <p>Built for scientists, by scientists.</p>
            <Copyright />
          </div>

          <div className="flex gap-8 flex-wrap justify-center">
            <a href="https://demo.ivoryos.ai" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Launch Demo</a>
            <a href="https://gitlab.com/heingroup/ivoryos" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitLab</a>
            <a href="https://ivoryos.readthedocs.io/" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="https://pypi.org/project/ivoryos/" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">PyPI</a>
            <a href="https://www.nature.com/articles/s41467-025-60514-w" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Publication</a>
            <a href="https://youtu.be/dFfJv9I2-1g" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
