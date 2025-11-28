export function Community() {
    return (
        <section id="community" className="w-full py-16 md:py-24 bg-muted/30 border-y border-border/40">
            <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
                <h2 className="text-3xl font-bold">Community</h2>
                <p className="text-xl text-muted-foreground">
                    Be part of the growing IvoryOS community. Whether you're sharing instrument drivers,
                    contributing workflows, offering ideas, or exploring automation for your lab,
                    your participation helps expand an open, collaborative ecosystem for scientific innovation.
                </p>
                <a
                    href="https://discord.gg/3KdjhUmsYA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
                    style={{ backgroundColor: '#8a9ad6', color: 'white', borderColor: '#8a9ad6' }}
                >
                    Join our Discord Community
                </a>
            </div>
        </section>
    );
}
