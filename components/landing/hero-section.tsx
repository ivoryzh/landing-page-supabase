import Link from "next/link";
import { Youtube, Github } from "lucide-react";

export function HeroSection() {
    return (
        <section id="home" className="w-full py-8 px-4 flex justify-center relative overflow-hidden">
            <div className="w-full max-w-7xl relative mx-auto flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-12">

                {/* Background Image - Desktop */}
                {/* Hero Video - Desktop */}
                <div className="relative w-full lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:-right-44 lg:w-[70%] block pointer-events-none z-0 select-none order-last lg:order-none mt-8 lg:mt-0">
                    <div className="relative w-full rounded-2xl shadow-2xl border border-border/10 overflow-hidden bg-muted/5 backdrop-blur-sm perspective-1000">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-auto object-cover"
                        >
                            <source src="/assets/hero/hero-demo.mp4" type="video/mp4" />
                        </video>

                        {/* Solid mask for text readability */}
                        <div className="absolute inset-0 bg-background/20 z-10" />

                        {/* Subtle overlay for depth */}
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-2xl pointer-events-none z-20" />
                    </div>
                </div>

                {/* Left Column: Text & CTA */}
                <div className="flex flex-col gap-8 text-left items-start z-10 relative lg:max-w-2xl lg:py-16">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-[1.1] pb-1">
                            Automate <br className="hidden lg:block" />
                            Without Coding
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                            Science-native autonomous workflows with open source orchestrator and drivers.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 w-full items-center">
                        <Link
                            href="/hub"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-foreground text-background hover:bg-foreground/90 h-12 px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            IvoryOS Hub (Beta)
                        </Link>
                        {/* <a
                            href="https://www.youtube.com/@JasonHein/Videos"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 h-12 px-6 border border-border/40 backdrop-blur-sm hover:-translate-y-0.5 transition-transform"
                        >
                            <Youtube className="w-5 h-5" />
                            Watch
                        </a> */}
                        <a
                            href="https://github.com/ivoryos-ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 h-12 px-6 border border-border/40 backdrop-blur-sm hover:-translate-y-0.5 transition-transform"
                        >
                            <Github className="w-5 h-5" />
                            GitHub
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}

