import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import IvoryOSHub from "@/app/hub/ivoryos/ivoryos-hub"; // Import your component

export const dynamic = "force-dynamic";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // We can pass user details to the hub to personalize it
  const userEmail = data.user.email;

  // Fetch modules with their associated devices
  // We want public modules OR modules created by the current user
  const { data: modules } = await supabase
    .from("modules")
    .select(`
      *,
      devices (*),
      profiles:contributor_id (*)
    `)
    .or(`is_unlisted.eq.false,contributor_id.eq.${data.user.id}`)
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      {/* The Main Hub Application */}
      <div className="flex flex-col gap-4">
        <IvoryOSHub userEmail={userEmail} modules={modules || []} />
      </div>
    </div>
  );
}