import Image from "next/image";

export function Team() {
    const team = [
        {
            name: "Ivory Zhang",
            role: "Lead Developer",
        },
        {
            name: "Jason Hein",
            role: "Scientific Advisor",
        },
        {
            name: "Fergus Klein",
            role: "Business Advisor",
        },
    ];

    return (
        <section id="team" className="w-full py-8 md:py-16 ">
            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-16">

                {/* Team Grid */}
                <div className="flex flex-col gap-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold">Meet the Team</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            IvoryOS initiated in 2023 at the University of British Columbia (Hein Lab).
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                        {team.map((member) => (
                            <div key={member.name} className="flex flex-col items-center gap-3 text-center p-8 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 min-w-[240px]">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mb-2">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{member.name}</h3>
                                    <p className="text-sm text-muted-foreground font-medium">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Acknowledgements */}
                <div className="flex flex-col items-center gap-6 pt-16">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-center">
                        With support from
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                        <a href="#" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            <Image src="/assets/logos/ubc-logo.png" alt="UBC Logo" width={100} height={40} className="object-contain h-8 w-auto" />
                        </a>
                        <a href="https://heinlab.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            <Image src="/assets/logos/heinlab_logo.png" alt="Hein Lab Logo" width={100} height={40} className="object-contain h-8 w-auto" />
                        </a>
                        <a href="https://telescopeinnovations.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            <Image src="/assets/logos/ti_logo.png" alt="Telescope Innovations Logo" width={100} height={40} className="object-contain h-8 w-auto" />
                        </a>
                        <a href="https://acceleration.utoronto.ca" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            <Image src="/assets/logos/ac_logo.png" alt="Acceleration Consortium Logo" width={100} height={40} className="object-contain h-8 w-auto" />
                        </a>
                        <a href="https://creativedestructionlab.com/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            <Image src="/assets/logos/cdl_logo.png" alt="Creative Destruction Lab Logo" width={100} height={40} className="object-contain h-8 w-auto" />
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
