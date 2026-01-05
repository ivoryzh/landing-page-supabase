"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";
import { MobileNav } from "@/components/mobile-nav";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavbarProps {
    authButton: React.ReactNode;
}

export function Navbar({ authButton }: NavbarProps) {
    const pathname = usePathname();
    const isHub = pathname?.startsWith("/hub");

    const navItems = [
        { href: "/", label: "Home" },
        {
            label: "Product",
            children: [

                { href: "/#developer", label: "IvoryOS Core" },
                { href: "/#hub", label: "Hub" },
            ],
        },
        {
            label: "Stories",
            children: [
                { href: "/#personas", label: "User Stories" },
                { href: "/#gallery", label: "Gallery" },
                { href: "/#team", label: "Team" },
                { href: "/#open-source", label: "Open Source" },
            ],
        },
        {
            label: "Hub",
            children: [
                { href: "/hub", label: "Hub" },
                { href: "/hub/devices", label: "Devices" },
                { href: "/hub/modules", label: "Modules" },
                { href: "/hub/templates", label: "Templates" },
                // { href: "/hub/gallery", label: "Gallery" },
            ],
        }
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
                    {navItems.map((item: any, index) => (
                        item.children ? (
                            <div key={index} className="relative group">
                                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors py-2">
                                    {item.label}
                                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                                </button>
                                <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-popover border border-border rounded-md shadow-md flex flex-col p-1 overflow-hidden">
                                        {item.children.map((child: any) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className="px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors text-left"
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "text-muted-foreground hover:text-foreground transition-colors",
                                    (pathname === item.href) && "text-foreground font-medium"
                                )}
                            >
                                {item.label}
                            </Link>
                        )
                    ))}
                </div>

                <div className="hidden md:flex gap-4 items-center">
                    <ThemeSwitcher />
                    <Suspense
                        fallback={
                            <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
                        }
                    >
                        {authButton}
                    </Suspense>
                </div>

                {/* Mobile Nav */}
                <MobileNav
                    links={navItems}
                    authButton={
                        <Suspense
                            fallback={
                                <div className="w-full h-9 bg-muted animate-pulse rounded-md" />
                            }
                        >
                            {authButton}
                        </Suspense>
                    }
                />
            </div>
        </nav>
    );
}
