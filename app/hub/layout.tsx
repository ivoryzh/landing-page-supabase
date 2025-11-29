import { HubNavbar } from "@/components/hub-navbar";
import * as React from "react";
import { Copyright } from "@/components/copyright";
import { BuildCartProvider } from "@/context/build-cart-context";
import { FloatingCart } from "@/components/hub/floating-cart";

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BuildCartProvider>
      <div className="flex-1 w-full flex flex-col min-h-screen">
        <HubNavbar />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
          {children}
        </main>

        <FloatingCart />

        <footer className="w-full border-t border-border/40 py-12 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-foreground">IvoryOS</p>
              <Copyright />
              <p className="text-xs text-muted-foreground/60 max-w-md">
                Disclaimer: Modules are sourced from PyPI. We do not guarantee the safety or reliability of external packages.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BuildCartProvider>
  );
}
