import { Navbar } from "@/components/navbar";
import * as React from "react";
import { Copyright } from "@/components/copyright";

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex-1 w-full flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
                {children}
            </main>

            <footer className="w-full border-t border-border/40 py-12 bg-muted/20">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground">
                    <div className="flex flex-col gap-2">
                        <p className="font-semibold text-foreground">IvoryOS</p>
                        <Copyright />
                    </div>
                </div>
            </footer>
        </div>
    );
}
