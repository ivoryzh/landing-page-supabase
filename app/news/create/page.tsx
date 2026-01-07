import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CreatePostForm } from "@/components/news/create-post-form";

export const dynamic = "force-dynamic";

export default async function CreatePostPage() {
    const supabase = await createClient();
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

    return (
        <div className="container mx-auto py-8 max-w-3xl">
            <div className="mb-8 border-b pb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Post</h1>
                <p className="text-muted-foreground text-lg">
                    Share updates, news, and announcements with the community.
                </p>
            </div>
            <CreatePostForm />
        </div>
    );
}
