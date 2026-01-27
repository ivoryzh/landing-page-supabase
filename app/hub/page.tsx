import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import IvoryOSHub from "@/app/hub/ivoryos/ivoryos-hub"; // Import your component

export const dynamic = "force-dynamic";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // if (error) {
  //   // Auth error is expected if user is not logged in
  //   // console.error("Auth error:", error);
  // }

  // We can pass user details to the hub to personalize it
  const userEmail = data?.user?.email || null;
  const userId = data?.user?.id || null;

  // Fetch modules with their associated devices
  // We want public modules OR modules created by the current user
  let query = supabase
    .from("modules")
    .select(`
      *,
      devices (*),
      profiles:contributor_id (*)
    `);

  if (userId) {
    query = query.or(`is_unlisted.eq.false,contributor_id.eq.${userId}`);
  } else {
    query = query.eq("is_unlisted", false);
  }

  const { data: modules } = await query
    .order("created_at", { ascending: false });

  // No redirect, render the hub
  // redirect("/hub/devices");

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      {/* The Main Hub Application */}
      <div className="flex flex-col gap-4">
        <IvoryOSHub userEmail={userEmail} userId={userId} modules={modules || []} />
      </div>
    </div>
  );

}