import { ArrowRight, Download, Layers, Play } from "lucide-react";
import Image from "next/image";

export function HomeSteps() {
   return (
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
         {/* Step 1: Discover Modules */}
         <div className="flex flex-col gap-4 bg-card/50 p-6 rounded-xl border border-border/50 transition-colors">
            <h3 className="text-xl font-semibold flex items-center gap-2">
               <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
               Discover Modules
            </h3>
            <div className="flex-1 flex items-center justify-center min-h-[280px] bg-muted/30 rounded-lg p-4 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
               <div className="relative w-full h-full min-h-[240px] shadow-lg rounded-lg overflow-hidden border border-border/50">
                  <Image
                     src="/assets/steps/discover_modules.png"
                     alt="Discover Modules"
                     fill
                     className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
               </div>
            </div>
         </div>

         {/* Step 2: Download the Launcher */}
         <div className="flex flex-col gap-4 bg-card/50 p-6 rounded-xl border border-border/50 transition-colors">
            <h3 className="text-xl font-semibold flex items-center gap-2">
               <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">2</span>
               Download Launcher
            </h3>
            <div className="flex-1 flex items-center justify-center min-h-[280px] bg-muted/30 rounded-lg p-4 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
               <div className="relative w-full h-full min-h-[240px] shadow-lg rounded-lg overflow-hidden border border-border/50">
                  <Image
                     src="/assets/steps/pack.png"
                     alt="IvoryOS Interface"
                     fill
                     className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
               </div>
            </div>
         </div>

         {/* Step 3: Start Building */}
         <div className="flex flex-col gap-4 bg-card/50 p-6 rounded-xl border border-border/50 transition-colors">
            <h3 className="text-xl font-semibold flex items-center gap-2">
               <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">3</span>
               Start Building
            </h3>
            <div className="flex-1 flex items-center justify-center min-h-[280px] bg-muted/30 rounded-lg p-4 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
               <div className="relative w-full h-full min-h-[240px] shadow-lg rounded-lg overflow-hidden border border-border/50">
                  <Image
                     src="/assets/steps/ivoryos_ill.png"
                     alt="IvoryOS Interface"
                     fill
                     className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
               </div>
            </div>
         </div>
      </div>
   );
}
