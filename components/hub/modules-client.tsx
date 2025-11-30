"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useBuildCart } from "@/context/build-cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Check, Plus, Search, Info } from "lucide-react";
import { ModuleDetailDialog } from "./module-detail-dialog";
import { ModuleCard } from "./module-card";

interface Module {
    id: number;
    name: string;
    icon_emoji?: string;
    module_name: string;
    pip_name: string;
    module_path?: string;
    connection?: any;
    os?: string[];
    init_args?: any;
    start_command?: string | null;
    python_versions?: string[];
    difficulty?: string;
    is_tested_with_ivoryos?: boolean;
    created_at: string;
    contributor_id?: string | null;
    is_original_developer?: boolean;
    profiles?: {
        id: string;
        full_name: string | null;
    } | null;
    devices?: {
        id: number;
        name: string;
        vendor: string;
        category: string | null;
    } | null;
}

export default function ModulesClient({ modules }: { modules: Module[] }) {
    const { addToCart, cartItems } = useBuildCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedVendor, setSelectedVendor] = useState<string>("all");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Extract unique vendors and categories
    const vendors = useMemo(() => {
        const v = new Set<string>();
        modules.forEach(m => {
            if (m.devices?.vendor) v.add(m.devices.vendor);
        });
        return Array.from(v).sort();
    }, [modules]);

    const categories = useMemo(() => {
        const c = new Set<string>();
        modules.forEach(m => {
            if (m.devices?.category) c.add(m.devices.category);
        });
        return Array.from(c).sort();
    }, [modules]);

    // Filter modules
    const filteredModules = useMemo(() => {
        return modules.filter(module => {
            const matchesSearch =
                module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                module.module_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                module.pip_name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesVendor = selectedVendor === "all" || module.devices?.vendor === selectedVendor;
            const matchesCategory = selectedCategory === "all" || module.devices?.category === selectedCategory;

            return matchesSearch && matchesVendor && matchesCategory;
        });
    }, [modules, searchQuery, selectedVendor, selectedCategory]);

    const handleAddToCart = (e: React.MouseEvent, module: Module) => {
        e.stopPropagation();
        addToCart({
            id: module.id.toString(),
            name: module.name,
            category: module.devices?.category || "Uncategorized",
            vendor: module.devices?.vendor || "Unknown",
            connection: module.connection ? (Array.isArray(module.connection) ? module.connection as string[] : [module.connection as string]) : ['usb'],
            os: module.os || [],
            icon: module.icon_emoji || '📦',
            specs: module.python_versions?.join(", ") || "Any",
            difficulty: module.difficulty || 'intermediate',
            package: module.pip_name,
            path: module.module_path || module.pip_name,
            module: module.module_name,
            isTested: !!module.is_tested_with_ivoryos,
            contributor: module.profiles,
            init_args: module.init_args,
            start_command: module.start_command,
        });
    };

    const openDetails = (module: Module) => {
        setSelectedModule(module);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Modules</h1>
                    <p className="text-muted-foreground">
                        Drivers and integrations for your hardware.
                    </p>
                </div>
                <Link
                    href="/hub/contribute?type=module"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
                >
                    + Add Module
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search modules..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {mounted ? (
                    <>
                        <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Vendor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Vendors</SelectItem>
                                {vendors.map(v => (
                                    <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </>
                ) : (
                    <>
                        <div className="w-full md:w-[180px] h-9 px-3 py-2 rounded-md border border-input bg-transparent text-sm text-muted-foreground flex items-center justify-between">
                            Vendor
                        </div>
                        <div className="w-full md:w-[180px] h-9 px-3 py-2 rounded-md border border-input bg-transparent text-sm text-muted-foreground flex items-center justify-between">
                            Category
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map((module) => (
                    <ModuleCard key={module.id} module={module} onOpenDetails={openDetails} onAddToCart={handleAddToCart} />
                ))}

                {filteredModules.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No modules found matching your filters.
                    </div>
                )}
            </div>

            <ModuleDetailDialog
                module={selectedModule as any}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    );
}
