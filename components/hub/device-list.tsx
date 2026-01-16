"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MissingItemSection } from "./missing-item-section";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Check, Plus, ExternalLink, ArrowLeft, Search, Edit, Trash2 } from "lucide-react";
import { useBuildCart } from "@/context/build-cart-context";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface Module {
    id: number;
    name: string;
    description?: string;
    icon_emoji?: string;
    module_name: string;
    pip_name: string;
    module_path?: string;
    connection?: any;
    os?: string[];
    init_args?: any;
    python_versions?: string[];
    difficulty?: string;
    is_tested_with_ivoryos?: boolean;
    profiles?: {
        full_name: string | null;
    } | null;
    devices?: {
        vendor: string;
        category: string | null;
    } | null;
}

interface Device {
    id: number;
    name: string;
    vendor: string;
    category: string | null;
    image_url: string | null;
    official_url: string | null;
    connection_guide?: string | null;
    modules: Module[];
    contributor_id?: string | null;
}

export default function DeviceList({ devices, isAdmin, userId }: { devices: Device[], isAdmin?: boolean, userId?: string }) {
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const { addToCart, cartItems } = useBuildCart();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedVendor, setSelectedVendor] = useState<string>("all");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Extract unique vendors and categories
    const vendors = useMemo(() => {
        const v = new Set<string>();
        devices.forEach(d => v.add(d.vendor));
        return Array.from(v).sort();
    }, [devices]);

    const categories = useMemo(() => {
        const c = new Set<string>();
        devices.forEach(d => {
            if (d.category) c.add(d.category);
        });
        return Array.from(c).sort();
    }, [devices]);

    // Filter devices
    const filteredDevices = useMemo(() => {
        return devices.filter(device => {
            const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                device.vendor.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesVendor = selectedVendor === "all" || device.vendor === selectedVendor;
            const matchesCategory = selectedCategory === "all" || device.category === selectedCategory;

            return matchesSearch && matchesVendor && matchesCategory;
        });
    }, [devices, searchQuery, selectedVendor, selectedCategory]);

    const handleAddToBuild = (module: Module) => {
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
        });
    };

    // Helper to check if a module is in cart (by ID, ignoring instance ID)
    const isModuleInCart = (moduleId: number) => {
        return cartItems.some(item => item.id === moduleId.toString());
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search devices..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDevices.map((device) => (
                    <div
                        key={device.id}
                        onClick={() => setSelectedDevice(device)}
                        className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group relative cursor-pointer"
                    >
                        <div className="relative aspect-video bg-muted flex items-center justify-center">
                            {device.image_url ? (
                                <Image
                                    src={device.image_url}
                                    alt={device.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <span className="text-4xl">🔬</span>
                            )}

                            {/* Admin Controls */}
                            {(isAdmin || (userId && device.contributor_id === userId)) && (
                                <div className="absolute top-2 left-2 flex gap-2 z-20" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/hub/contribute?type=device&edit_id=${device.id}`);
                                        }}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>

                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                                    {device.category || "Uncategorized"}
                                </span>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                    {device.modules?.length || 0} Modules
                                </span>
                            </div>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{device.name}</h3>
                            <p className="text-sm text-muted-foreground">{device.vendor}</p>
                        </div>
                        {device.official_url && (
                            <a
                                href={device.official_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-3 right-3 bg-background/80 hover:bg-background p-1.5 rounded-full text-muted-foreground hover:text-primary transition-colors backdrop-blur-sm z-10"
                                title="Official Page"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                ))}

                {filteredDevices.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No devices found matching your filters.
                    </div>
                )}
            </div>

            {/* Missing Device Section */}
            <MissingItemSection />

            <Dialog open={!!selectedDevice} onOpenChange={(open) => !open && setSelectedDevice(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            {selectedDevice?.name}
                            {selectedDevice?.official_url && (
                                <a href={selectedDevice.official_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedDevice?.vendor} - {selectedDevice?.category}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedDevice?.connection_guide && (
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border/50">
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                🔌 Connection Guide
                            </h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {selectedDevice.connection_guide}
                            </p>
                        </div>
                    )}

                    <div className="mt-6 space-y-4">
                        <h3 className="font-semibold text-lg">Available Modules</h3>
                        {selectedDevice?.modules && selectedDevice.modules.length > 0 ? (
                            <div className="grid gap-4">
                                {selectedDevice.modules.map((module) => (
                                    <div key={module.id} className="border border-border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-3">
                                                <span className="text-3xl bg-muted rounded-md p-2">{module.icon_emoji || "📦"}</span>
                                                <div>
                                                    <h4 className="font-bold text-base flex items-center gap-2">
                                                        {module.name}
                                                        {module.is_tested_with_ivoryos && (
                                                            <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full font-medium">Verified</span>
                                                        )}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        by {module.profiles?.full_name || "Unknown"}
                                                    </p>
                                                    <div className="flex gap-2 mt-2">
                                                        {module.os?.map(os => (
                                                            <span key={os} className="text-[10px] border px-1 rounded text-muted-foreground">{os}</span>
                                                        ))}
                                                        {module.connection && (Array.isArray(module.connection) ? module.connection : [module.connection]).map((c: any) => (
                                                            <span key={c} className="text-[10px] border px-1 rounded text-muted-foreground uppercase">{c}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="default"
                                                onClick={() => handleAddToBuild(module)}
                                                className="shrink-0"
                                            >
                                                <Plus className="w-4 h-4 mr-1" /> Add to Bench
                                            </Button>
                                        </div>
                                        <div className="mt-3 text-xs text-muted-foreground bg-muted/50 p-2 rounded font-mono">
                                            pip install {module.pip_name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No modules available for this device yet.
                                <br />
                                <Link href="/hub/contribute" className="text-primary hover:underline mt-2 inline-block">
                                    Contribute a module
                                </Link>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
