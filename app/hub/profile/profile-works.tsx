"use client";

import { GalleryCard } from "@/components/gallery/gallery-card";
import { Database } from "@/utils/supabase/types";
import { useState } from "react";
import { DetailDialog } from "@/components/gallery/detail-dialog";

type GalleryPost = Database["public"]["Tables"]["gallery_posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
    likes: { count: number }[];
    user_has_liked: boolean;
};

import { User } from "@supabase/supabase-js";

interface ProfileWorksProps {
    posts: GalleryPost[];
    user: User;
}

export function ProfileWorks({ posts, user }: ProfileWorksProps) {
    const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
                <h3 className="text-lg font-semibold">No works yet</h3>
                <p className="text-muted-foreground">
                    You haven't shared any setups yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <GalleryCard
                        key={post.id}
                        post={post}
                        onClick={() => setSelectedPost(post)}
                    />
                ))}
            </div>

            <DetailDialog
                post={selectedPost}
                open={!!selectedPost}
                onOpenChange={(open) => !open && setSelectedPost(null)}
                user={user}
                onUpdate={() => window.location.reload()} // Simple reload for now to refresh data
            />
        </div>
    );
}
