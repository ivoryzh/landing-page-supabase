import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import IvoryOSHub from "@/app/hub/ivoryos/ivoryos-hub"; // Import your component

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // We can pass user details to the hub to personalize it
  const userEmail = data.user.email;

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      {/* The Main Hub Application */}
      <div className="flex flex-col gap-4">
        <IvoryOSHub userEmail={userEmail} />
      </div>
    </div>
  );
}