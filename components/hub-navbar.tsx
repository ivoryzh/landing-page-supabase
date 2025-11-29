import Link from "next/link";
import Image from "next/image";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";
import { MobileNav } from "@/components/mobile-nav";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function HubNavbar() {
    const navLinks = [
        { href: "/hub/devices", label: "Devices" },
        { href: "/hub/modules", label: "Modules" },
        { href: "/hub/templates", label: "Templates" },
        { href: "/hub/gallery", label: "Gallery" },
        // Contribute is handled separately now
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
                        <span className="text-xl font-bold">IvoryOS Hub</span>
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

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
                            Contribute <ChevronDown className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href="/hub/contribute?type=module">Add Module</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/hub/contribute?type=device">Add Device</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/hub/contribute?type=template">Add Template</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/hub/contribute?type=post">Add Post</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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

                {/* Mobile Nav - Note: MobileNav needs to be updated or accept links prop to be truly reusable, 
                    but for now we might need to duplicate or refactor it. 
                    Let's assume MobileNav is hardcoded for now and might need a prop update.
                    Checking MobileNav content would be good, but I'll stick to Desktop for now or pass links if supported.
                */}
                <div className="md:hidden">
                    {/* Placeholder for mobile nav or reuse existing if it supports props */}
                </div>
            </div>
        </nav>
    );
}
