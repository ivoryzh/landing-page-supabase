import { Navbar } from "@/components/navbar";
import * as React from "react";
import { BuildCartProvider } from "@/context/build-cart-context";
import { FloatingCart } from "@/components/hub/floating-cart";
import { createClient } from "@/utils/supabase/server";
import { HubSidebar } from "@/components/hub-sidebar";
import { Footer } from "@/components/footer";
import { AuthButton } from "@/components/auth-button";

export default async function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <BuildCartProvider>
      <div className="flex-1 w-full flex flex-col min-h-screen">
        <Navbar authButton={<AuthButton />} />

        <div className="flex-1 w-full max-w-7xl mx-auto flex">
          <HubSidebar isAdmin={isAdmin} />
          <main className="flex-1 px-4 py-8 overflow-x-hidden">
            {children}
          </main>
        </div>

        <FloatingCart />
        <Footer />
      </div>
    </BuildCartProvider>
  );
}
