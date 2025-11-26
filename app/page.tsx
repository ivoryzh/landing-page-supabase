import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Copyright } from "@/components/copyright";
import { HeroSection } from "@/components/landing/hero-section";
import { DeveloperDemo } from "@/components/landing/developer-demo";
import { Personas } from "@/components/landing/personas";
import { Community } from "@/components/landing/community";
import { Partners } from "@/components/landing/partners";

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 bg-slate-100/80 dark:bg-background/80 backdrop-blur-md z-50">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/assets/logos/ivoryos_logo.png" alt="IvoryOS Logo" width={32} height={32} className="w-auto h-8 object-contain" />
              <span className="text-xl font-bold">IvoryOS</span>
            </Link>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <Link href="#home" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="#developer" className="text-muted-foreground hover:text-foreground transition-colors">Solution</Link>
            <Link href="#personas" className="text-muted-foreground hover:text-foreground transition-colors">Why IvoryOS</Link>
            <Link href="#community" className="text-muted-foreground hover:text-foreground transition-colors">Community</Link>
          </div>
          <div className="flex gap-4 items-center">
            <ThemeSwitcher />
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col gap-20 w-full">
        <HeroSection />
        <DeveloperDemo />
        <Personas />
        <Community />
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
