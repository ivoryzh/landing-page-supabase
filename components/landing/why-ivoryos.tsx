import { LayoutDashboard, FlaskConical, Quote, BrainCircuit, GitBranch, Code2, ArrowRight, Zap, Calendar } from "lucide-react";
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
                                <LayoutDashboard className="w-48 h-48 text-blue-500" />
                            </div>
                            <div className="space-y-6 relative z-10 flex-1">
                                {/* <div className="inline-flex items-center gap-2 text-blue-500 font-medium">
                                    <LayoutDashboard className="w-5 h-5" />
                                    The IvoryOS Way
                                </div> */}
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-bold">Instant Web Interface</h3>
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        Research changes faster than software cycles. IvoryOS turns evolving Python code into an instant web interface — so scientists can test immediately while developers refactor freely.
                                    </p>
                                </div>
                            </div>

                            {/* Transformation Comparison */}
                            <div className="mt-auto pt-6 border-t border-blue-500/20 grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                                {/* Traditional */}
                                <div className="flex flex-col gap-1.5 opacity-60">
                                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Traditional</div>
                                    <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                                        <Calendar className="w-4 h-4" />
                                        <span>2 Weeks</span>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="text-blue-500/40">
                                    <ArrowRight className="w-6 h-6" />
                                </div>

                                {/* IvoryOS */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-600">IvoryOS</div>
                                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-600 font-bold">
                                        <div className="relative">
                                            <Zap className="w-4 h-4 fill-current relative z-10" />
                                            <div className="absolute inset-0 bg-blue-500 blur-sm opacity-50 animate-pulse" />
                                        </div>
                                        <span>Instant</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Feature Grid (Span 3) */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                            <div className="p-6 rounded-xl border border-purple-500/10 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/50 transition-colors space-y-3 flex flex-col relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                    <FlaskConical className="w-20 h-20" />
                                </div>
                                <h4 className="font-semibold text-lg relative z-10 pt-2">Science-Native</h4>
                                <p className="text-sm text-muted-foreground flex-1 relative z-10">
                                    Designed for experiments — iteration, parameter exploration, and adaptive optimization.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl border border-blue-500/10 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50 transition-colors space-y-3 flex flex-col relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                    <Code2 className="w-20 h-20" />
                                </div>
                                <h4 className="font-semibold text-lg relative z-10 pt-2">
                                    Composible workflows
                                </h4>
                                <p className="text-sm text-muted-foreground flex-1 relative z-10">
                                    Pivot faster by rebuilding workflows from reusable building blocks — no rewrites required.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl border border-indigo-500/10 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-colors space-y-3 flex flex-col relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                    <BrainCircuit className="w-20 h-20" />
                                </div>
                                <h4 className="font-semibold text-lg relative z-10 pt-2">
                                    AI Intelligence
                                </h4>
                                <p className="text-sm text-muted-foreground flex-1 relative z-10">
                                    Interact with experiments in natural language — query data, guide decisions, stay in the loop.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl border border-teal-500/10 bg-teal-500/5 hover:bg-teal-500/10 hover:border-teal-500/50 transition-colors space-y-3 flex flex-col relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                    <GitBranch className="w-20 h-20" />
                                </div>
                                <h4 className="font-semibold text-lg relative z-10 pt-2">
                                    Reproducible
                                </h4>
                                <p className="text-sm text-muted-foreground flex-1 relative z-10">
                                    Every action is logged. Standardized execution ensures results are repeatable.
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


