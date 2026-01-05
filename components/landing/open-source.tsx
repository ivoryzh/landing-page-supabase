import { Code2, Lock, Users, Zap, GitFork } from "lucide-react";

export function OpenSource() {
    const reasons = [
        {
            icon: <Zap className="w-5 h-5" />,
            title: "Accelerating Discovery",
            description: "No cost. No paywalls. Just faster science."
        },
        {
            icon: <Code2 className="w-5 h-5" />,
            title: "Freedom & Flexibility",
            description: "No vendor lock-in. 100% customizable."
        },
        {
            icon: <Lock className="w-5 h-5" />,
            title: "Reproducibility",
            description: "Transparent methods. Verifiable results."
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Community Innovation",
            description: "Global collaboration. Shared innovation."
        }
    ];

    return (
        <section id="open-source" className="w-full py-16 md:py-24 border-t border-border/40">
            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-12">
                <div className="flex flex-col items-center text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">Why Open Source?</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        We believe the future of science should be open, accessible, and collaborative.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {reasons.map((reason, index) => (
                        <div key={index} className="flex flex-col items-start gap-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
                            <div className="p-2 rounded-md bg-muted text-foreground">
                                {reason.icon}
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">{reason.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {reason.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
