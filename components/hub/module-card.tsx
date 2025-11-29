"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ThumbsUp, Pencil } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
    module: any;
    onOpenDetails: (module: any) => void;
    onAddToCart: (e: React.MouseEvent, module: any) => void;
}

export function ModuleCard({ module, onOpenDetails, onAddToCart }: ModuleCardProps) {
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchLikes = async () => {
            const { count } = await supabase
                .from("likes")
                .select("*", { count: "exact", head: true })
                .eq("module_id", module.id);
            setLikes(count || 0);

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUserId(user.id);
                const { data } = await supabase
                    .from("likes")
                    .select("*")
                    .eq("module_id", module.id)
                    .eq("user_id", user.id)
                    .maybeSingle();
                setHasLiked(!!data);
            }
        };
        fetchLikes();
    }, [module.id, supabase]);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Please login to like modules");
            return;
        }

        try {
            if (hasLiked) {
                const { error } = await supabase
                    .from("likes")
                    .delete()
                    .eq("module_id", module.id)
                    .eq("user_id", user.id);

                if (error) throw error;

                setLikes(prev => prev - 1);
                setHasLiked(false);
            } else {
                const { error } = await supabase
                    .from("likes")
                    .insert({
                        module_id: module.id,
                        user_id: user.id
                    });

                if (error) throw error;

                setLikes(prev => prev + 1);
                setHasLiked(true);
            }
        } catch (error: any) {
            console.error("Error toggling like:", error);
            toast.error(`Failed to update like: ${error.message}`);
        }
    };

    return (
        <div
            onClick={() => onOpenDetails(module)}
            className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer group relative h-full"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{module.icon_emoji || "📦"}</span>
                    <h3 className="font-bold text-base truncate pr-2 group-hover:text-primary transition-colors">{module.name}</h3>
                </div>
                {module.is_tested_with_ivoryos && (
                    <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                        Verified
                    </span>
                )}
            </div>

            <div className="flex-1 flex flex-col gap-3 pl-[calc(2rem+0.75rem)]">
                <p className="text-xs text-muted-foreground line-clamp-1">
                    {module.devices?.name ? `For ${module.devices.name}` : "Device Agnostic"}
                </p>
            </div>

            <div className="mt-4 flex gap-2 pl-[calc(2rem+0.75rem)]">
                <Button
                    className="flex-1 h-8 text-xs"
                    variant="outline"
                    onClick={(e) => onAddToCart(e, module)}
                >
                    <Plus className="w-3 h-3 mr-1.5" />
                    Add
                </Button>
                {currentUserId === module.contributor_id && (
                    <Link href={`/hub/contribute?type=module&edit_id=${module.id}`} onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="w-3 h-3" />
                        </Button>
                    </Link>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLike}
                    className={cn("h-8 w-8 hover:text-red-500", hasLiked && "text-red-500")}
                >
                    <ThumbsUp className={cn("w-3 h-3", hasLiked && "fill-current")} />
                    <span className="ml-1 text-[10px]">{likes}</span>
                </Button>
            </div>
        </div>
    );
}
