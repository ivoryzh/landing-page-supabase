
import { createClient } from "@/utils/supabase/server";
import { CreatePostForm } from "@/components/news/create-post-form";
import { notFound, redirect } from "next/navigation";

export default async function EditNewsPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();

    // 1. Verify Admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/auth/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        redirect("/news");
    }

    // 2. Fetch Post
    const { data: post } = await supabase
        .from("news_posts")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!post) {
        notFound();
    }

    return (
        <div className="container mx-auto py-12 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
                <p className="text-muted-foreground mt-2">Update your news post.</p>
            </div>

            <CreatePostForm post={post} />
        </div>
    );
}
