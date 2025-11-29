"use client";

import Image from "next/image";
import Link from "next/link";
import { type Database } from "@/utils/supabase/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { EditDialog } from "./edit-dialog";

import { Button } from "@/components/ui/button";
import { Pencil, Heart } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type GalleryPost = Database["public"]["Tables"]["gallery_posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
};

interface DetailDialogProps {
    post: GalleryPost | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: any;
    onUpdate: () => void;
}

export function DetailDialog({
    post,
    open,
    onOpenChange,
    user,
    onUpdate,
}: DetailDialogProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loadingLike, setLoadingLike] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        if (post && open) {
            fetchLikeStatus();
        }
    }, [post, open, user]);

    const fetchLikeStatus = async () => {
        if (!post) return;

        // Get like count
        const { count, error: countError } = await supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id);

        if (!countError) {
            setLikeCount(count || 0);
        }

        // Get user like status
        if (user) {
            const { data, error } = await supabase
                .from("likes")
                .select("*")
                .eq("post_id", post.id)
                .eq("user_id", user.id)
                .single();

            setLiked(!!data);
        }
    };

    const handleLike = async () => {
        if (!user || !post || loadingLike) return;
        setLoadingLike(true);

        try {
            // Check if user has a profile
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("id")
                .eq("id", user.id)
                .single();

            if (profileError || !profile) {
                toast.error("Please create a profile to like posts.");
                // Optional: Redirect to profile page or open profile dialog
                // router.push("/hub/profile"); 
                return;
            }

            if (liked) {
                // Unlike
                const { error } = await supabase
                    .from("likes")
                    .delete()
                    .eq("post_id", post.id)
                    .eq("user_id", user.id);

                if (error) throw error;
                setLiked(false);
                setLikeCount((prev) => Math.max(0, prev - 1));
            } else {
                // Like
                const { error } = await supabase
                    .from("likes")
                    .insert({ post_id: post.id, user_id: user.id });

                if (error) throw error;
                setLiked(true);
                setLikeCount((prev) => prev + 1);
            }
        } catch (error: any) {
            console.error("Error toggling like:", error.message || error);
            toast.error("Failed to update like.");
        } finally {
            setLoadingLike(false);
        }
    };



    if (!post) return null;

    const isOwner = user?.id === post.user_id;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-[95vw] sm:max-w-[75vw] w-[95vw] h-[85vh] p-0 overflow-hidden border-none bg-background/95 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Image Section */}
                        <div className="relative w-full md:w-[50%] h-[40%] md:h-full bg-black/90 flex items-center justify-center p-4">
                            <Image
                                src={post.image_url}
                                alt={post.title}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-[50%] h-[60%] md:h-full flex flex-col bg-background border-l">
                            <div className="p-6 border-b flex justify-between items-start shrink-0">
                                <div>
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold leading-tight mb-2">
                                            {post.title}
                                        </DialogTitle>
                                        <div className="flex items-center gap-3 mt-4">
                                            <Link href={`/hub/profile/${post.profiles?.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                                <Avatar className="h-10 w-10 border">
                                                    <AvatarImage
                                                        src={post.profiles?.avatar_url || undefined}
                                                    />
                                                    <AvatarFallback>
                                                        {post.profiles?.full_name?.slice(0, 2)?.toUpperCase() ||
                                                            "??"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold hover:underline">
                                                        {post.profiles?.full_name || "Anonymous"}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(post.created_at).toLocaleDateString(
                                                            undefined,
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                    </DialogHeader>
                                </div>
                                <div className="flex gap-1">
                                    {isOwner && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditOpen(true)}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <ScrollArea className="flex-1 p-6">
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/90">
                                        {post.description}
                                    </p>
                                </div>
                            </ScrollArea>

                            <div className="p-4 border-t bg-muted/10 flex items-center justify-between shrink-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "gap-2 hover:bg-transparent",
                                        liked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
                                    )}
                                    onClick={handleLike}
                                    disabled={loadingLike}
                                >
                                    <Heart className={cn("h-5 w-5", liked && "fill-current")} />
                                    <span className="text-sm font-medium">{likeCount} Likes</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <EditDialog
                post={post}
                open={editOpen}
                onOpenChange={setEditOpen}
                onUpdateSuccess={() => {
                    onUpdate();
                    onOpenChange(false);
                }}
            />
        </>
    );
}
