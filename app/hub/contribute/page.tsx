import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ContributeForm } from "./contribute-form";

export default async function ContributePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Fetch devices for the dropdown
    const { data: devices } = await supabase
        .from("devices")
        .select("*")
        .order("name");

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">


            <ContributeForm devices={devices || []} userId={user.id} />
        </div>
    );
}
