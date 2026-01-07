import { LayoutDashboard, Cpu, FlaskConical, Quote, Sparkles, TrendingUp, GitBranch, Code2, ArrowRight } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        title: "The Automation Scientist",
        avatar: "/assets/personas/scientist.png",
        description: "Connects instruments and runs complex experiments in minutes.",
        bgColor: "bg-blue-500/10",
    },
    {
        title: "The Platform Engineer",
        avatar: "/assets/personas/platform.png",
        description: "Focuses on logic while IvoryOS handles state, execution, and drivers.",
        bgColor: "bg-purple-500/10",
    },
    {
        title: "The Robotics Specialist",
        avatar: "/assets/personas/hardware.png",
        description: "Instant orchestration interface for custom robotics code.",
        bgColor: "bg-green-500/10",
    },
];

export function WhyIvoryOS() {
    return (
        <section id="why-ivoryos" className="w-full py-20 bg-muted/10 border-y border-border/40">
            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-20">

                {/* 1. Header & GUI Spotlight */}
                <div className="flex flex-col gap-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl lg:text-4xl font-bold">Why IvoryOS?</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            The bridge between complex automation and scientific discovery.
                        </p>
                    </div>

                    {/* Main Content: Instant GUI (Left) + Feature Grid (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-8 items-stretch">

                        {/* Left: Instant GUI Hero Card (Span 2) */}
                        <div className="lg:col-span-2 p-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 flex flex-col gap-6 relative overflow-hidden shadow-sm h-full">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles className="w-48 h-48 text-blue-500" />
                            </div>
                            <div className="space-y-6 relative z-10 flex-1">
                                <div className="inline-flex items-center gap-2 text-blue-500 font-medium">
                                    <Sparkles className="w-5 h-5" />
                                    The IvoryOS Way
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-bold">Instant Web Interface</h3>
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        IvoryOS parses your Python protocol and instantly renders a full, interactive control interface. Developers just write logic; Scientists get a web interface immediately.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-auto pt-8 border-t border-blue-500/20 flex items-center gap-2 text-blue-600 dark:text-blue-400 text-base font-medium">
                                <span className="flex items-center gap-2"><ArrowRight className="w-5 h-5" /> Ready to Run</span>
                            </div>
                        </div>

                        {/* Right: Feature Grid (Span 3) */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                            <div className="p-6 rounded-xl border bg-card hover:bg-muted/50 transition-colors space-y-3 flex flex-col">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h4 className="font-semibold text-lg">LLM Integration</h4>
                                <p className="text-sm text-muted-foreground flex-1">
                                    "Chat" with your experiments and query data.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl border bg-card hover:bg-muted/50 transition-colors space-y-3 flex flex-col">
                                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <h4 className="font-semibold text-lg">Bayesian Optimization Ready</h4>
                                <p className="text-sm text-muted-foreground flex-1">
                                    Seamless integration with Ax, BayBE and NIMO for autonomous parameter optimization loops.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl border bg-card hover:bg-muted/50 transition-colors space-y-3 flex flex-col">
                                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
                                    <GitBranch className="w-5 h-5" />
                                </div>
                                <h4 className="font-semibold text-lg">Reproducibility</h4>
                                <p className="text-sm text-muted-foreground flex-1">
                                    Every action is logged. Standardized execution ensures results are repeatable.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl border bg-card hover:bg-muted/50 transition-colors space-y-3 flex flex-col">
                                <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center text-foreground">
                                    <Code2 className="w-5 h-5" />
                                </div>
                                <h4 className="font-semibold text-lg">Open Source</h4>
                                <p className="text-sm text-muted-foreground flex-1">
                                    No vendor lock-in. Build on a shared foundation.
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className="space-y-12">
                        <div className="text-center space-y-4">
                            {/* <h2 className="text-3xl font-bold">Empowering Every Role</h2> */}
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Designed to accelerate the entire R&D team.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {testimonials.map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-6 p-8 rounded-xl border bg-card text-card-foreground shadow-sm relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-24 h-24 ${item.bgColor} rounded-bl-full opacity-50`} />

                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                                            <Image
                                                src={item.avatar}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <h4 className="font-semibold text-lg">{item.title}</h4>
                                    </div>

                                    <p className="text-muted-foreground leading-relaxed relative z-10">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


