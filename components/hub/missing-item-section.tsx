import Link from "next/link";
import { Plus } from "lucide-react";

export function MissingItemSection() {
    return (
        <div className="w-full py-12 flex flex-col items-center justify-center text-center space-y-4 bg-muted/30 rounded-xl border border-dashed border-border/50">
            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Don't find the device you are looking for?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Add the device to our catalog or contribute a module driver.
                    <br />
                    <span className="text-sm opacity-80">
                        Build the future of lab automation together.
                    </span>
                </p>
            </div>
            <div className="flex gap-4">
                <Link
                    href="/hub/contribute?type=device"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Device
                </Link>
                <Link
                    href="/hub/contribute?type=module"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Module
                </Link>
            </div>
        </div>
    );
}
