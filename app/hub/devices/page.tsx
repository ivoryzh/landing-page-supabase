import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeviceList from "@/components/hub/device-list";

export const dynamic = "force-dynamic";

export default async function DevicesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    const { data: devices, error } = await supabase
        .from("devices")
        .select(`
            *,
            modules (
                *,
                profiles:contributor_id (*),
                devices:device_id (vendor, category)
            )
        `)
        .order("name");

    if (error) {
        console.error("Error fetching devices:", error);
        return <div>Error loading devices</div>;
    }

    const { data: profile } = user ? await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single() : { data: null };

    const isAdmin = profile?.role === "admin";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Devices</h1>
                    <p className="text-muted-foreground">
                        Supported hardware for your lab.
                    </p>
                </div>
                <Link
                    href="/hub/contribute?type=device"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
                >
                    + Add Device
                </Link>
            </div>

            <DeviceList devices={devices as any} isAdmin={isAdmin} userId={user?.id} />
        </div>
    );
}
