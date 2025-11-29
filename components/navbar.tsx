import Link from "next/link";
import Image from "next/image";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";
import { MobileNav } from "@/components/mobile-nav";

export function Navbar() {
    const navLinks = [
        { href: "/#home", label: "Home" },
        { href: "/#developer", label: "Solution" },
        { href: "/#personas", label: "Why IvoryOS" },
        { href: "/#gallery", label: "Gallery" },
        { href: "/#community", label: "Community" },
    ];

    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/20 h-16 sticky top-0 bg-slate-100/80 dark:bg-background/80 backdrop-blur-md z-50 shadow-sm">
            <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/assets/logos/ivoryos_logo.png"
                            alt="IvoryOS Logo"
                            width={32}
                            height={32}
                            className="w-auto h-8 object-contain"
                        />
                        <span className="text-xl font-bold">IvoryOS</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex gap-6 items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex gap-4 items-center">
                    <ThemeSwitcher />
                    <Suspense
                        fallback={
                            <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
                        }
                    >
                        <AuthButton />
                    </Suspense>
                </div>

                {/* Mobile Nav */}
                <MobileNav
                    authButton={
                        <Suspense
                            fallback={
                                <div className="w-full h-9 bg-muted animate-pulse rounded-md" />
                            }
                        >
                            <AuthButton />
                        </Suspense>
                    }
                />
            </div>
        </nav>
    );
}
