"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface MobileNavProps {
    authButton: React.ReactNode;
}

export function MobileNav({ authButton }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: "/#home", label: "Home" },
        { href: "/#developer", label: "Solution" },
        { href: "/#personas", label: "Why IvoryOS" },
        { href: "/#gallery", label: "Gallery" },
        { href: "/#community", label: "Community" },
    ];

    return (
        <div className="md:hidden flex items-center gap-4">
            <ThemeSwitcher />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-4">{authButton}</div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
