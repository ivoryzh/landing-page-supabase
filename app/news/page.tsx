import { createClient } from "@/utils/supabase/server";
import { NewsCard } from "@/components/news/news-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let isAdmin = false;
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
        isAdmin = profile?.role === "admin";
    }

    // Admins can see all posts, users only strictly published ones via RLS?
    // Actually, RLS for public is published=true. 
    // Admin RLS is ALL.
    // So if I am admin, I will see all. If I am user, I will see only published.
    // I should probably filter by published in the query too to be clearer if I want admins to only see published here?
    // Let's assume admins want to see everything here or maybe I should filter in the UI "Draft" vs "Published".
    // For simplicity, let's just fetch everything the user is ALLOWED to see.

    const { data: posts } = await supabase
        .from("news_posts")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8 container mx-auto py-8 max-w-7xl">
            <div className="flex justify-between items-center border-b pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">News & Updates</h1>
                    <p className="text-muted-foreground text-lg">Latest updates and announcements from the IvoryOS team.</p>
                </div>
                {isAdmin && (
                    <Link href="/news/create">
                        <Button className="gap-2">
                            <PlusCircle className="w-4 h-4" />
                            New Post
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts?.map((post) => (
                    <NewsCard key={post.id} post={post} isAdmin={isAdmin} />
                ))}
            </div>
            {posts?.length === 0 && (
                <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                    <p className="text-muted-foreground text-lg">No news posts yet.</p>
                </div>
            )}
        </div>
    );
}
