import Image from "next/image";

export function Partners() {
    const partners = [
        { name: "UBC", src: "/assets/logos/ubc-logo.png", url: "#" },
        // { name: "Hein Lab", src: "/assets/logos/heinlab_logo.png", url: "https://heinlab.com" },
        { name: "Telescope Innovations", src: "/assets/logos/ti_logo.png", url: "https://telescopeinnovations.com" },
        { name: "Acceleration Consortium", src: "/assets/logos/ac_logo.png", url: "https://acceleration.utoronto.ca" },
        { name: "NIMS", src: "/assets/logos/nims_logo.png", url: "https://www.nims.go.jp/eng/" },
        { name: "Pfizer", src: "/assets/logos/pfizer_logo.svg", url: "https://www.pfizer.com" },
        { name: "KPBMA", src: "/assets/logos/kpbma_logo.gif", url: "https://www.kpbma.or.kr/english" },
    ];

    return (
        <section className="w-full py-8 border-b border-border/40">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-center">
                    Trusted by or Partnered with
                </p>

                <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
                    {partners.map((partner) => (
                        <a
                            key={partner.name}
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                        >
                            <div className="p-2">
                                <Image
                                    src={partner.src}
                                    alt={`${partner.name} Logo`}
                                    width={120}
                                    height={48}
                                    className="object-contain h-10 w-auto"
                                />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
