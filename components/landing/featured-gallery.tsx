"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type Database } from "@/utils/supabase/types";
import { GalleryCard } from "@/components/gallery/gallery-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DetailDialog } from "@/components/gallery/detail-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type GalleryPost = Database["public"]["Tables"]["gallery_posts"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
    like_count?: number;
};

export function FeaturedGallery() {
    const [posts, setPosts] = useState<GalleryPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
        fetchFeaturedPosts();
    }, []);

    const fetchFeaturedPosts = async () => {
        // This is a bit complex because Supabase doesn't support ordering by a count of a related table directly in one query easily without a view or RPC.
        // For simplicity/MVP, we'll fetch posts and then fetch their like counts, or just fetch recent ones for now if performance is key.
        // BUT, the user specifically asked for "highest thumbs up".
        // A proper way is to create a view or RPC. Let's try a client-side sort for small datasets, or just fetch recent for now and I'll add a TODO.
        // Actually, let's just fetch the last 4 posts for now to ensure it works, and I'll explain to the user or try to implement a better sort if needed.
        // Wait, I can use a view? Or just fetch all (limit 50) and sort client side. That's safer for MVP.

        const { data: postsData, error } = await supabase
            .from("gallery_posts")
            .select("*, profiles(*)")
            .order("created_at", { ascending: false })
            .limit(20);

        if (error) {
            console.error("Error fetching featured posts:", error);
            return;
        }

        // Fetch like counts for these posts
        const postsWithLikes = await Promise.all(
            (postsData as GalleryPost[]).map(async (post) => {
                const { count } = await supabase
                    .from("likes")
                    .select("*", { count: "exact", head: true })
                    .eq("post_id", post.id);
                return { ...post, like_count: count || 0 };
            })
        );

        // Sort by likes descending and take top 4
        const sorted = postsWithLikes.sort((a, b) => (b.like_count || 0) - (a.like_count || 0)).slice(0, 4);
        setPosts(sorted);
    };

    const handleCardClick = (post: GalleryPost) => {
        if (!user) {
            // For featured section, maybe we allow viewing? User said "so people can see without loggin in".
            // "see" might mean just the grid. But usually featured allows clicking.
            // User said: "just that they can't add or click to view the detail if that posslble" in previous turn.
            // But in THIS turn: "Oh maybe do pick some of those wiht highest thumbs up to the main page, so people can see without loggin in!!"
            // This likely means seeing the GRID.
            // If they click, let's stick to the existing behavior: prompt login.
            toast.error("Please sign in to view details!");
            router.push("/auth/login");
            return;
        }
        setSelectedPost(post);
        setDetailOpen(true);
    };

    if (posts.length === 0) return null;

    return (
        <section className="w-full py-20 bg-muted/30" id="gallery">
            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl md:text-4xl font-bold">Community Favorites</h2>
                        <p className="text-muted-foreground max-w-xl">
                            Check out the most popular setups and stories from our community.
                        </p>
                    </div>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/gallery">
                            View All Gallery <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <GalleryCard
                            key={post.id}
                            post={post}
                            onClick={() => handleCardClick(post)}
                        />
                    ))}
                </div>

                <DetailDialog
                    post={selectedPost}
                    open={detailOpen}
                    onOpenChange={setDetailOpen}
                    user={user}
                    onUpdate={fetchFeaturedPosts}
                />
            </div>
        </section>
    );
}
