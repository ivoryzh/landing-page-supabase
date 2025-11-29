"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, ThumbsUp, Pencil, FileJson } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
    template: any;
}

export function TemplateCard({ template }: TemplateCardProps) {
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchLikes = async () => {
            const { count } = await supabase
                .from("likes")
                .select("*", { count: "exact", head: true })
                .eq("template_id", template.id);
            setLikes(count || 0);

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUserId(user.id);
                const { data } = await supabase
                    .from("likes")
                    .select("*")
                    .eq("template_id", template.id)
                    .eq("user_id", user.id)
                    .maybeSingle();
                setHasLiked(!!data);
            }
        };
        fetchLikes();
    }, [template.id, supabase]);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Please login to like templates");
            return;
        }

        try {
            if (hasLiked) {
                const { error } = await supabase
                    .from("likes")
                    .delete()
                    .eq("template_id", template.id)
                    .eq("user_id", user.id);

                if (error) throw error;

                setLikes(prev => prev - 1);
                setHasLiked(false);
            } else {
                const { error } = await supabase
                    .from("likes")
                    .insert({
                        template_id: template.id,
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

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        const blob = new Blob([JSON.stringify(template.workflow_json, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${template.title.replace(/\s+/g, "_").toLowerCase()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Template downloaded");
    };

    return (
        <div className="group relative bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span className="bg-secondary/50 px-2 py-0.5 rounded-full border border-secondary">
                            Template
                        </span>
                        <span>•</span>
                        <span>{new Date(template.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {currentUserId === template.contributor_id && (
                            <Link href={`/hub/contribute?type=template&edit_id=${template.id}`} onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit Template">
                                    <Pencil className="w-3 h-3" />
                                </Button>
                            </Link>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload} title="Download JSON">
                            <Download className="w-3 h-3" />
                        </Button>
                    </div>
                </div>

                <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {template.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {template.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t mt-auto">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <FileJson className="w-4 h-4" />
                            <span>{Object.keys(template.workflow_json || {}).length} steps</span>
                        </div>
                        {/* We could add likes here later */}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLike}
                        className={cn("h-8 w-8 hover:text-red-500", hasLiked && "text-red-500")}
                        title="Like Template"
                    >
                        <ThumbsUp className={cn("w-3 h-3", hasLiked && "fill-current")} />
                        <span className="ml-1 text-[10px]">{likes}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
