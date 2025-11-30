import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UserList from "@/components/admin/user-list";

export default async function AdminUsersPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/auth/login");
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return redirect("/hub");
    }

    // Fetch all users
    const { data: users, error } = await supabase
        .from("profiles")
        .select("*")
        .order("updated_at", { ascending: false });

    if (error) {
        console.error("Error fetching users:", error);
        return <div>Error loading users: {JSON.stringify(error)}</div>;
    }

    return (
        <div className="container py-10 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage users and roles.</p>
                </div>
            </div>

            <UserList initialUsers={users as any} currentUserId={user.id} />
        </div>
    );
}
