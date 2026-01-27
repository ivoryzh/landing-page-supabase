import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Database } from "@/utils/supabase/types";

export const dynamic = "force-dynamic";

export default async function ModulesPage({ searchParams }: { searchParams: Promise<{ device_id?: string }> }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // if (!user) {
    //     redirect("/auth/login");
    // }

    const { device_id } = await searchParams;

    let query = supabase
        .from("modules")
        .select(`
            *,
            devices (*),
            profiles:contributor_id (*)
        `);

    if (user) {
        query = query.or(`is_unlisted.eq.false,contributor_id.eq.${user.id}`);
    } else {
        query = query.eq("is_unlisted", false);
    }

    query = query.order("created_at", { ascending: false });

    if (device_id) {
        query = query.eq("device_id", device_id);
    }

    const { data: modules, error } = await query;

    if (error) {
        console.error("Error fetching modules:", error);
        return <div>Error loading modules</div>;
    }

    return (
        <ModulesClient modules={modules as any} userId={user?.id} />
    );
}

import ModulesClient from "@/components/hub/modules-client";
