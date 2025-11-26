import Image from "next/image";

export function Partners() {
    const partners = [
        { name: "UBC", src: "/assets/logos/ubc-logo.png", url: "#" },
        { name: "Hein Lab", src: "/assets/logos/heinlab_logo.png", url: "https://heinlab.com" },
        { name: "Telescope Innovations", src: "/assets/logos/ti_logo.png", url: "https://telescopeinnovations.com" },
        { name: "Acceleration Consortium", src: "/assets/logos/ac_logo.png", url: "https://acceleration.utoronto.ca" },
    ];

    return (
        <section className="w-full py-12 border-t">
            <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-8 md:gap-16">
                {partners.map((partner) => (
                    <a
                        key={partner.name}
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                    >
                        <div className="bg-white p-2 rounded-lg">
                            <Image
                                src={partner.src}
                                alt={`${partner.name} Logo`}
                                width={150}
                                height={60}
                                className="object-contain h-12 w-auto"
                            />
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
