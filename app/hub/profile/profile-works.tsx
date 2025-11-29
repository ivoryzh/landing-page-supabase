"use client";

import { GalleryCard } from "@/components/gallery/gallery-card";
import { Database } from "@/utils/supabase/types";
import { useState } from "react";
import { DetailDialog } from "@/components/gallery/detail-dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ModuleCard } from "@/components/hub/module-card";
import { TemplateCard } from "@/components/hub/template-card";
import { User } from "@supabase/supabase-js";
import { useBuildCart } from "@/context/build-cart-context";
import { ModuleDetailDialog } from "@/components/hub/module-detail-dialog";

type GalleryPost = Database["public"]["Tables"]["gallery_posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
    likes: { count: number }[];
    user_has_liked: boolean;
};

// Reuse Module type from ModulesClient or define here (simplified for display)
// Ideally we should export the Module type from a shared location, but for now:
type Module = any; // Using any to avoid complex type duplication for now, as ModuleCard handles it
type Template = any;

interface ProfileWorksProps {
    posts: GalleryPost[];
    modules: Module[];
    templates: Template[];
    user: User | null;
}

export function ProfileWorks({ posts, modules, templates, user }: ProfileWorksProps) {
    const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
    const { addToCart } = useBuildCart();

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
        });
    };

    const openModuleDetails = (module: Module) => {
        setSelectedModule(module);
        setIsModuleDialogOpen(true);
    };

    const [activeTab, setActiveTab] = useState<"gallery" | "modules" | "templates">("gallery");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Works</h2>
                <div className="flex bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("gallery")}
                        className={cn(
                            "px-3 py-1 text-sm font-medium rounded-md transition-all",
                            activeTab === "gallery" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Gallery ({posts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("modules")}
                        className={cn(
                            "px-3 py-1 text-sm font-medium rounded-md transition-all",
                            activeTab === "modules" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Modules ({modules.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("templates")}
                        className={cn(
                            "px-3 py-1 text-sm font-medium rounded-md transition-all",
                            activeTab === "templates" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Templates ({templates.length})
                    </button>
                </div>
            </div>

            {activeTab === "gallery" && (
                <div className="mt-0">
                    {posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
                            <h3 className="text-lg font-semibold">No gallery posts yet</h3>
                            <p className="text-muted-foreground">
                                This user hasn't shared any setups yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <GalleryCard
                                    key={post.id}
                                    post={post}
                                    onClick={() => setSelectedPost(post)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "modules" && (
                <div className="mt-0">
                    {modules.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
                            <h3 className="text-lg font-semibold">No modules yet</h3>
                            <p className="text-muted-foreground">
                                This user hasn't contributed any modules yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {modules.map((module) => (
                                <ModuleCard
                                    key={module.id}
                                    module={module}
                                    onOpenDetails={openModuleDetails}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "templates" && (
                <div className="mt-0">
                    {templates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
                            <h3 className="text-lg font-semibold">No templates yet</h3>
                            <p className="text-muted-foreground">
                                This user hasn't contributed any templates yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map((template) => (
                                <TemplateCard key={template.id} template={template} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <DetailDialog
                post={selectedPost}
                open={!!selectedPost}
                onOpenChange={(open) => !open && setSelectedPost(null)}
                user={user}
                onUpdate={() => window.location.reload()}
            />

            <ModuleDetailDialog
                module={selectedModule}
                open={isModuleDialogOpen}
                onOpenChange={setIsModuleDialogOpen}
            />
        </div>
    );
}
