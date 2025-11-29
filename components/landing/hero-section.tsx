import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
                        href="https://discord.gg/3KdjhUmsYA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
                        style={{ backgroundColor: '#8a9ad6', color: 'white', borderColor: '#8a9ad6' }}
                    >
                        Join our Discord
                    </a>
                </div>
            </div>
        </section>
    );
}
