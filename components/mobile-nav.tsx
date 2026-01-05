"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface MobileNavProps {
    authButton: React.ReactNode;
    links: any[]; // Using any[] to match navItems structure from Navbar
}

export function MobileNav({ authButton, links }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="md:hidden flex items-center gap-4">
                <ThemeSwitcher />
                <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </div>
        );
    }

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
                <SheetContent side="right" className="overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-8">
                        <Accordion type="single" collapsible className="w-full">
                            {links.map((link, index) => (
                                link.children ? (
                                    <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
                                        <AccordionTrigger className="text-lg font-medium hover:no-underline py-3">
                                            {link.label}
                                        </AccordionTrigger>
                                        <AccordionContent className="flex flex-col gap-3 pl-4">
                                            {link.children.map((child: any) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                ) : (
                                    <div key={link.href} className="py-3 border-b-border/40">
                                        <Link
                                            href={link.href}
                                            className="text-lg font-medium hover:text-foreground transition-colors block"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </div>
                                )
                            ))}
                        </Accordion>
                        <div className="mt-4">{authButton}</div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
