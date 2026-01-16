import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GalleryGrid } from "./gallery-grid";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Fetch all gallery posts
    const { data: posts, error } = await supabase
        .from("gallery_posts")
        .select(`
            *,
            profiles:user_id (*)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching gallery posts:", error);
        return <div>Error loading gallery</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Community Gallery</h1>
                    <p className="text-muted-foreground">
                        See what others are building with IvoryOS. Have you built something cool? Share it with the community!
                    </p>
                </div>
                <Link
                    href="/hub/contribute?type=post"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
                >
                    + Add Post
                </Link>
            </div>

            <GalleryGrid posts={posts || []} currentUser={user} />

            {posts?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No posts yet. Share your work from your profile!
                </div>
            )}
        </div>
    );
}
