import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";
import { ProfileSidebar } from "./profile-sidebar";
import { ProfileWorks } from "./profile-works";



export default async function ProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/auth/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // If no profile exists, show the create form
    if (!profile) {
        return (
            <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full py-12">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-3xl font-bold">Create Profile</h1>
                    <p className="text-muted-foreground">
                        Set up your profile to start sharing your work.
                    </p>
                </div>
                <div className="border p-6 rounded-lg bg-card shadow-sm">
                    <ProfileForm user={user} profile={null} />
                </div>
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
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // Check if current user liked these posts (for the heart icon state)
    // Since we are viewing our own profile, we can check if we liked our own posts
    // But more importantly, we need to format the data for GalleryCard
    const { data: myLikes } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", user.id);

    const likedPostIds = new Set(myLikes?.map(l => l.post_id) || []);

    const formattedPosts = posts?.map(post => ({
        ...post,
        user_has_liked: likedPostIds.has(post.id)
    })) || [];

    return (
        <div className="flex flex-col md:flex-row gap-8 w-full">
            <ProfileSidebar user={user} profile={profile} />
            <div className="flex-1 min-w-0">
                <ProfileWorks posts={formattedPosts} user={user} />
            </div>
        </div>
    );
}
