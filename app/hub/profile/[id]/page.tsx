import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProfileSidebar } from "../profile-sidebar";
import { ProfileWorks } from "../profile-works";

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { id } = await params;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If viewing own profile, redirect to /hub/profile
    if (user?.id === id) {
        redirect("/hub/profile");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <h1 className="text-3xl font-bold">Profile Not Found</h1>
                <p className="text-muted-foreground">
                    The user you are looking for does not exist.
                </p>
            </div>
        );
    }

    // Fetch user's posts
    const { data: posts } = await supabase
        .from("gallery_posts")
        .select(`
            *,
            profiles:user_id (*),
            likes (count)
        `)
        .eq("user_id", id)
        .order("created_at", { ascending: false });

    // Fetch user's modules
    const { data: modules } = await supabase
        .from("modules")
        .select(`
            *,
            profiles:contributor_id (*),
            devices:device_id (*)
        `)
        .eq("contributor_id", id)
        .order("created_at", { ascending: false });

    // Fetch user's templates
    const { data: templates } = await supabase
        .from("templates")
        .select(`
            *,
            profiles:contributor_id (*)
        `)
        .eq("contributor_id", id)
        .order("created_at", { ascending: false });

    // Check if current user liked these posts
    let likedPostIds = new Set();
    if (user) {
        const { data: myLikes } = await supabase
            .from("likes")
            .select("post_id")
            .eq("user_id", user.id)
            .not("post_id", "is", null);

        likedPostIds = new Set(myLikes?.map(l => l.post_id) || []);
    }

    const formattedPosts = posts?.map(post => ({
        ...post,
        user_has_liked: likedPostIds.has(post.id)
    })) || [];

    return (
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto p-4">
            <ProfileSidebar user={user} profile={profile} readOnly={true} />
            <div className="flex-1 min-w-0">
                <ProfileWorks
                    posts={formattedPosts}
                    modules={modules || []}
                    templates={templates || []}
                    user={user}
                />
            </div>
        </div>
    );
}
