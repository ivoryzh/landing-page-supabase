import { ArrowRight, Download, Layers, Play } from "lucide-react";
import Image from "next/image";

export function HomeHubSteps() {
   return (
      <section id="hub" className="w-full py-12 flex flex-col items-center gap-8">
         <div className="text-center space-y-4 px-4">
            <h2 className="text-3xl font-bold">IvoryOS Hub</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
               Discover, install, and launch your self-driving lab.
            </p>
         </div>
         <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 p-4 max-w-7xl mx-auto">
            {/* Step 1: Discover */}
            <div className="flex flex-col gap-4 bg-card/50 p-6 rounded-xl border border-border/50 transition-colors hover:bg-card/80">
               <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">1</span>
                  Discover
               </h3>
               <p className="text-muted-foreground text-sm">
                  Browse the community library for hardware drivers.
               </p>
               <div className="flex-1 flex items-center justify-center min-h-[200px] bg-muted/30 rounded-lg p-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                  <div className="relative w-full h-full min-h-[180px] rounded-lg overflow-hidden border border-border/50 shadow-sm">
                     <Image
                        src="/assets/steps/device.png"
                        alt="Discover Modules"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                  </div>
               </div>
            </div>

            {/* Step 2: Pack */}
            <div className="flex flex-col gap-4 bg-card/50 p-6 rounded-xl border border-border/50 transition-colors hover:bg-card/80">
               <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">2</span>
                  Install
               </h3>
               <p className="text-muted-foreground text-sm">
                  Install drivers and IvoryOS Core to your lab.
               </p>
               <div className="flex-1 flex items-center justify-center min-h-[200px] bg-muted/30 rounded-lg p-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                  <div className="relative w-full h-full min-h-[180px] shadow-sm rounded-lg overflow-hidden border border-border/50">
                     <Image
                        src="/assets/steps/install.png"
                        alt="Pack Configuration"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                  </div>
               </div>
            </div>

            {/* Step 3: Build */}
            <div className="flex flex-col gap-4 bg-card/50 p-6 rounded-xl border border-border/50 transition-colors hover:bg-card/80">
               <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">3</span>
                  Build
               </h3>
               <p className="text-muted-foreground text-sm">
                  Deploy your configuration and start running automated experiments.
               </p>
               <div className="flex-1 flex items-center justify-center min-h-[200px] bg-muted/30 rounded-lg p-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                  <div className="relative w-full h-full min-h-[180px] shadow-sm rounded-lg overflow-hidden border border-border/50">
                     <Image
                        src="/assets/steps/ivoryos_ill.png"
                        alt="Build and Run"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
