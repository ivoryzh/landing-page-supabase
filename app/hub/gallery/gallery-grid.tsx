"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GalleryCard } from "@/components/gallery/gallery-card";
import { DetailDialog } from "@/components/gallery/detail-dialog";
import { Database } from "@/utils/supabase/types";

type GalleryPost = Database["public"]["Tables"]["gallery_posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
};

interface GalleryGridProps {
    posts: GalleryPost[];
    currentUser: any; // Using any for simplicity, but ideally User type
}

export function GalleryGrid({ posts, currentUser }: GalleryGridProps) {
    const router = useRouter();
    const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                user={currentUser}
                onUpdate={() => {
                    setSelectedPost(null);
                    router.refresh();
                }}
            />
        </>
    );
}
