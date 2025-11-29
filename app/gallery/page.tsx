"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type Database } from "@/utils/supabase/types";
import { GalleryCard } from "@/components/gallery/gallery-card";
import { UploadDialog } from "@/components/gallery/upload-dialog";
import { DetailDialog } from "@/components/gallery/detail-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type GalleryPost = Database["public"]["Tables"]["gallery_posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
};

export default function GalleryPage() {
    const [posts, setPosts] = useState<GalleryPost[]>([]);
    const [user, setUser] = useState<any>(null);
    const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from("gallery_posts")
            .select("*, profiles(*)")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching posts:", error);
            toast.error("Failed to load gallery posts.");
        } else {
            setPosts((data as GalleryPost[]) || []);
        }
    };

    const handleCardClick = (post: GalleryPost) => {
        if (!user) {
            toast.error("Please sign in to view details!");
            router.push("/auth/login");
            return;
        }
        setSelectedPost(post);
        setDetailOpen(true);
    };

    return (
        <>
            <div className="flex flex-col items-center text-center gap-4 mb-12">
                <h1 className="text-3xl md:text-4xl font-bold">Community Gallery</h1>
                <p className="text-muted-foreground max-w-2xl">
                    See what others are building with IvoryOS. Share your own setups and
                    stories.
                </p>
                {user && <UploadDialog user={user} onUploadSuccess={fetchPosts} />}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {posts.map((post) => (
                    <GalleryCard
                        key={post.id}
                        post={post}
                        onClick={() => handleCardClick(post)}
                    />
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No posts yet. Be the first to share!
                </div>
            )}

            <DetailDialog
                post={selectedPost}
                open={detailOpen}
                onOpenChange={setDetailOpen}
                user={user}
                onUpdate={fetchPosts}
            />
        </>
    );
}
