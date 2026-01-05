"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Box,
    FileBox,
    ImageIcon,
    ShieldAlert,
    PlusCircle,
    Cpu,
} from "lucide-react";

interface HubSidebarProps {
    isAdmin?: boolean;
}

export function HubSidebar({ isAdmin }: HubSidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path);

    return (
        <aside className="w-64 flex-shrink-0 hidden md:flex flex-col gap-6 pr-6 border-r border-border/40">
            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-muted-foreground px-4 mb-2">
                    {/* Manage */}
                </h3>
                <Link href="/hub/devices">
                    <Button
                        variant={isActive("/hub/devices") ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                    >
                        <Cpu className="w-4 h-4" />
                        Devices
                    </Button>
                </Link>
                <Link href="/hub/modules">
                    <Button
                        variant={isActive("/hub/modules") ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                    >
                        <Box className="w-4 h-4" />
                        Modules
                    </Button>
                </Link>
                <Link href="/hub/templates">
                    <Button
                        variant={isActive("/hub/templates") ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                    >
                        <FileBox className="w-4 h-4" />
                        Templates
                    </Button>
                </Link>
                <Link href="/hub/gallery">
                    <Button
                        variant={isActive("/hub/gallery") ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                    >
                        <ImageIcon className="w-4 h-4" />
                        Gallery
                    </Button>
                </Link>
                {isAdmin && (
                    <Link href="/hub/admin/users">
                        <Button
                            variant={isActive("/hub/admin") ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                        >
                            <ShieldAlert className="w-4 h-4" />
                            Admin
                        </Button>
                    </Link>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-muted-foreground px-4 mb-2">
                    Contribute
                </h3>
                <Link href="/hub/contribute?type=module">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <PlusCircle className="w-4 h-4" />
                        New Module
                    </Button>
                </Link>
                <Link href="/hub/contribute?type=device">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <PlusCircle className="w-4 h-4" />
                        New Device
                    </Button>
                </Link>
                <Link href="/hub/contribute?type=template">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <PlusCircle className="w-4 h-4" />
                        New Template
                    </Button>
                </Link>
                <Link href="/hub/contribute?type=post">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <PlusCircle className="w-4 h-4" />
                        New Post
                    </Button>
                </Link>
            </div>
        </aside>
    );
}
