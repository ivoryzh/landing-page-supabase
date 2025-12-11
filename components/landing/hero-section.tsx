import Link from "next/link";
import { ArrowRight, Youtube, Github } from "lucide-react";
import { HomeSteps } from "@/components/home-steps";

export function HeroSection() {
    return (
        <section id="home" className="w-full flex flex-col items-center gap-12 py-8 md:py-16 px-4">
            <div className="flex flex-col gap-8 items-center text-center w-full max-w-7xl">
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Grab-and-Go Automation
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Community-driven orchestration of AI experiments.
                    </p>
                </div>

                {/* Visual Representation - Now Central and Wide */}
                <div className="w-full -my-2">
                    <HomeSteps />
                </div>

                <div className="flex gap-4">
                    <Link
                        href="/hub"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                    >
                        IvoryOS Hub (Beta)
                    </Link>
                    <a
                        href="https://www.youtube.com/@JasonHein/Videos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-11 px-8"
                    >
                        <Youtube className="w-4 h-4" />
                        Watch on YouTube
                    </a>
                    <a
                        href="https://github.com/ivoryos-ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-11 px-8"
                    >
                        <Github className="w-4 h-4" />
                        GitHub
                    </a>
                </div>
            </div>
        </section>
    );
}
