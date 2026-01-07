"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deletePost(postId: string) {
    const supabase = await createClient();

    // 1. Check Auth & Admin Role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Not authenticated" };
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { error: "Unauthorized: Admin access required" };
    }

    // 2. Perform Delete
    const { error } = await supabase
        .from("news_posts")
        .delete()
        .eq("id", postId);

    if (error) {
        console.error("Error deleting post:", error);
        return { error: error.message };
    }

    // 3. Revalidate
    revalidatePath("/news");
    return { success: true };
}
