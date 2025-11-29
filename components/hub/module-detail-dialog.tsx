"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tables } from "@/utils/supabase/types";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, User, FileJson, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useBuildCart } from "@/context/build-cart-context";
import { toast } from "sonner";

type Module = Tables<"modules">;
type Profile = Tables<"profiles">;
type Template = Tables<"templates">;

interface ModuleDetailDialogProps {
    module: Module | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ModuleDetailDialog({ module, open, onOpenChange }: ModuleDetailDialogProps) {
    const [contributor, setContributor] = useState<Profile | null>(null);
    const [relatedTemplates, setRelatedTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const { addToCart } = useBuildCart();

    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);
        };
        fetchUser();
    }, [supabase]);

    useEffect(() => {
        if (module && open) {
            setLoading(true);
            const fetchData = async () => {
                try {
                    // Fetch contributor profile
                    if (module.contributor_id) {
                        const { data: profile } = await supabase
                            .from("profiles")
                            .select("*")
                            .eq("id", module.contributor_id)
                            .single();
                        setContributor(profile);
                    } else {
                        setContributor(null);
                    }

                    // Fetch related templates
                    const { data: templates } = await supabase
                        .from("templates")
                        .select("*")
                        .contains("module_ids", [module.id]);

                    setRelatedTemplates(templates || []);

                } catch (error) {
                    console.error("Error fetching details:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [module, open, supabase]);

    if (!module) return null;

    const handleAddToBuild = () => {
        // We try to extract extra info if available (e.g. if module prop has joined fields)
        // otherwise default to generic values
        const joinedModule = module as any;

        addToCart({
            id: module.id.toString(),
            name: module.name,
            category: joinedModule.devices?.category || "Uncategorized",
            vendor: joinedModule.devices?.vendor || "Unknown",
            connection: module.connection ? (Array.isArray(module.connection) ? module.connection as string[] : [module.connection as string]) : ['usb'],
            os: module.os || [],
            icon: module.icon_emoji || '📦',
            specs: module.python_versions?.join(", ") || "Any",
            difficulty: module.difficulty || 'intermediate',
            package: module.pip_name,
            path: module.module_path || module.pip_name,
            module: module.module_name,
            isTested: !!module.is_tested_with_ivoryos,
            contributor: contributor, // Use the fetched contributor
            init_args: module.init_args,
        });
        // toast is handled in addToCart usually, but let's leave it or remove if duplicate
        // addToCart in context already toasts.
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {module.name}
                        {module.is_original_developer && (
                            <Badge variant="secondary" className="text-xs font-normal">
                                Official
                            </Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-base">
                        {module.module_name}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-4">
                    <div className="space-y-6 py-4">
                        {/* Device Image */}
                        {(module as any).devices?.image_url && (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted/50 mb-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={(module as any).devices.image_url}
                                    alt={(module as any).devices.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Module Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <span className="text-muted-foreground">Class Name:</span>
                                <p className="font-mono bg-muted px-2 py-1 rounded inline-block">
                                    {module.module_name}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-muted-foreground">Pip Package:</span>
                                <p className="font-mono bg-muted px-2 py-1 rounded inline-block">
                                    {module.pip_name}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-muted-foreground">Import Path:</span>
                                <p className="font-mono bg-muted px-2 py-1 rounded inline-block">
                                    {module.module_path}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-muted-foreground">Python Versions:</span>
                                <p>{module.python_versions?.join(", ") || "Any"}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-muted-foreground">OS Support:</span>
                                <p>{module.os?.join(", ") || "Any"}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-muted-foreground">Published:</span>
                                <p>{new Date(module.created_at).toLocaleDateString()}</p>
                            </div>
                            {module.init_args && (
                                <div className="col-span-2 space-y-2">
                                    <span className="text-muted-foreground">Init Args:</span>
                                    <div className="border rounded-md overflow-hidden">
                                        <div className="max-h-[200px] overflow-y-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-muted text-muted-foreground font-medium">
                                                    <tr>
                                                        <th className="px-3 py-2">Name</th>
                                                        <th className="px-3 py-2">Type</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {Array.isArray(module.init_args) ? (
                                                        (module.init_args as any[]).map((arg, idx) => (
                                                            <tr key={idx} className="hover:bg-muted/50">
                                                                <td className="px-3 py-2 font-mono">{arg.name}</td>
                                                                <td className="px-3 py-2 text-muted-foreground font-mono text-xs">{arg.type}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={2} className="px-3 py-2 text-muted-foreground italic">
                                                                Invalid format
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contributor Info */}
                        {loading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading details...
                            </div>
                        ) : (
                            <>
                                {contributor && (
                                    <Link href={`/hub/profile/${contributor.id}`} className="block group">
                                        <div className="bg-muted/30 p-4 rounded-lg border group-hover:bg-muted/50 transition-colors">
                                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Contributor
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={contributor.avatar_url || undefined} />
                                                    <AvatarFallback>{contributor.full_name?.[0] || "?"}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium group-hover:underline decoration-primary/50 underline-offset-4">
                                                        {contributor.full_name || "Anonymous"}
                                                    </p>
                                                    {contributor.lab_info && (
                                                        <p className="text-sm text-muted-foreground">{contributor.lab_info}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )}

                                {/* Related Templates */}
                                {relatedTemplates.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <FileJson className="w-4 h-4" />
                                            Used in Templates
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {relatedTemplates.map((template) => (
                                                <Link
                                                    key={template.id}
                                                    href={`/hub/templates?id=${template.id}`} // Assuming templates page can handle ID or just link to list
                                                    className="block group"
                                                >
                                                    <div className="border rounded-lg p-3 hover:bg-muted/50 transition-colors h-full">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="font-medium group-hover:underline decoration-primary/50 underline-offset-4">
                                                                {template.title}
                                                            </span>
                                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                                        </div>
                                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                                            {template.description || "No description"}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-between pt-4 border-t mt-auto">
                    {currentUserId === module.contributor_id ? (
                        <Link href={`/hub/contribute?type=module&edit_id=${module.id}`}>
                            <Button variant="outline">
                                Edit
                            </Button>
                        </Link>
                    ) : (
                        <div></div> // Spacer
                    )}
                    <Button onClick={handleAddToBuild} className="w-full sm:w-auto">
                        Add to Bench
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
