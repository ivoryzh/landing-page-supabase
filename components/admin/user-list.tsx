"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    role: string;
};

export default function UserList({ initialUsers, currentUserId }: { initialUsers: Profile[], currentUserId: string }) {
    const [users, setUsers] = useState<Profile[]>(initialUsers);
    const supabase = createClient();
    const router = useRouter();

    const toggleAdmin = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";

        // Optimistic update
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));

        const { error } = await supabase
            .from("profiles")
            .update({ role: newRole })
            .eq("id", userId);

        if (error) {
            console.error("Error updating role:", error);
            // Revert on error
            setUsers(users.map(u => u.id === userId ? { ...u, role: currentRole } : u));
            alert("Failed to update role");
        } else {
            router.refresh();
        }
    };

    return (
        <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Users</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        <div className="flex items-center gap-3">
                                            {user.avatar_url && (
                                                <img src={user.avatar_url} alt={user.username || "User"} className="w-8 h-8 rounded-full" />
                                            )}
                                            <div>
                                                <div className="font-bold">{user.full_name || "No Name"}</div>
                                                <div className="text-xs text-muted-foreground">@{user.username || "unknown"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "admin"
                                                ? "bg-primary/10 text-primary"
                                                : "bg-secondary text-secondary-foreground"
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.id !== currentUserId && (
                                            <button
                                                onClick={() => toggleAdmin(user.id, user.role)}
                                                className="text-primary hover:underline text-xs"
                                            >
                                                {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
