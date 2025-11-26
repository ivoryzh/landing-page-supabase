import Image from "next/image";

export function Personas() {
    const personas = [
        {
            title: "Automation Scientist",
            role: "Rapid prototyping & R&D",
            avatar: "/assets/personas/scientist.png",
            problem: "Prototyping workflows across different hardware is slow and hard to share.",
            solution: "Pick hardware APIs, connect components, and prototype workflows in minutes.",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Platform Developer",
            role: "SDL platform development",
            avatar: "/assets/personas/platform.png",
            problem: "Building custom UIs and onboarding collaborators slows down core development.",
            solution: "Focus on core logic. IvoryOS provides the interface for collaborators to run workflows instantly.",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
        {
            title: "Software Engineer",
            role: "Building tools for self-driving labs",
            avatar: "/assets/personas/software.png",
            problem: "No shared standard for connecting instruments makes reuse and collaboration hard.",
            solution: "Build and share scientist-friendly tools using community drivers and optimizers.",
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
    ];

    return (
        <section id="personas" className="w-full py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">Why IvoryOS</h2>
                    <p className="text-xl text-muted-foreground">
                        IvoryOS serves everyone in the lab automation ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {personas.map((persona, idx) => (
                        <div key={idx} className="flex flex-col gap-6 p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 ${persona.bgColor.replace('/10', '')}`}>
                                    <Image
                                        src={persona.avatar}
                                        alt={persona.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{persona.title}</h3>
                                    <p className="text-sm text-muted-foreground">{persona.role}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">The Challenge</h4>
                                    <p className="text-sm leading-relaxed">{persona.problem}</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className={`font-medium text-sm uppercase tracking-wider ${persona.color}`}>The Solution</h4>
                                    <p className="text-sm leading-relaxed font-medium">{persona.solution}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
