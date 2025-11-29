"use client";

import Image from "next/image";
import { type Database } from "@/utils/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

type GalleryPost = Database["public"]["Tables"]["gallery_posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
};

interface GalleryCardProps {
    post: GalleryPost;
    onClick: () => void;
}

export function GalleryCard({ post, onClick }: GalleryCardProps) {
    const [likeCount, setLikeCount] = useState(0);
    const supabase = createClient();

    useEffect(() => {
        const fetchLikes = async () => {
            const { count } = await supabase
                .from("likes")
                .select("*", { count: "exact", head: true })
                .eq("post_id", post.id);

            setLikeCount(count || 0);
        };
        fetchLikes();
    }, [post.id]);

    return (
        <Card
            className="relative overflow-hidden cursor-pointer group h-full aspect-[4/5] border-0 rounded-xl"
            onClick={onClick}
        >
            <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

            <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 drop-shadow-md flex-1">
                        {post.title}
                    </h3>
                </div>

                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-white/50">
                            <AvatarImage src={post.profiles?.avatar_url || undefined} />
                            <AvatarFallback className="text-[10px] bg-white/20 text-white">
                                {post.profiles?.full_name?.slice(0, 2)?.toUpperCase() || "??"}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-white/90 truncate drop-shadow-sm max-w-[100px]">
                            {post.profiles?.full_name || "Anonymous"}
                        </span>
                    </div>

                    {likeCount > 0 && (
                        <div className="flex items-center gap-1 text-white/90">
                            <Heart className="h-3 w-3 fill-white/90" />
                            <span className="text-xs font-medium">{likeCount}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
