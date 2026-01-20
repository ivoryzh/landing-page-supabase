"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Monitor, Terminal, FileCode, Package, Download, RotateCcw } from "lucide-react";
import { Database } from "@/utils/supabase/types";
import { generateScripts } from "@/utils/script-generator";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type DownloadRecord = Database["public"]["Tables"]["hub_downloads"]["Row"];

interface DownloadHistoryListProps {
    downloads: DownloadRecord[];
}

export function DownloadHistoryList({ downloads }: DownloadHistoryListProps) {
    if (downloads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
                <h3 className="text-lg font-semibold">No download history</h3>
                <p className="text-muted-foreground">
                    You haven't downloaded any builds yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {downloads.map((download) => (
                <DownloadCard key={download.id} download={download} />
            ))}
        </div>
    );
}

function DownloadCard({ download }: { download: DownloadRecord }) {
    const [expanded, setExpanded] = useState(false);

    // Safe parsing of configuration
    const config = typeof download.configuration === 'object'
        ? download.configuration as any
        : JSON.parse(download.configuration as string || '{}');

    const cartItems = config.cartItems || [];
    const optimizers = config.selectedOptimizers || [];
    const timestamp = new Date(download.created_at);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(timestamp);

    const handleRedownload = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Reconstruct or default the parameters
        // New downloads have full data, old ones might miss connections/port
        const connections = config.connections || {};
        const port = config.port || "8000";
        // User email isn't critical for script function (just comment), but we can try to use what we have or generic
        const userEmail = download.user_email;

        // Re-generate
        const { ps, bash, python, bat } = generateScripts(cartItems, optimizers, connections, port, userEmail);

        // Zip and download
        const zip = new JSZip();
        zip.file("ivoryos-setup.ps1", ps);
        zip.file("ivoryos-setup.sh", bash);
        zip.file("main.py", python);
        zip.file("start.bat", bat);

        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, "ivoryos-bundle-redownload.zip");
        });
    };

    return (
        <div className="border rounded-lg bg-card overflow-hidden transition-all hover:border-primary/50">
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                        {download.os_type === 'windows' ? (
                            <Monitor className="w-5 h-5 text-primary" />
                        ) : (
                            <Terminal className="w-5 h-5 text-primary" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">
                            {download.os_type === 'windows' ? 'Windows Build' : 'Mac/Linux Build'}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            {formattedDate}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2 hidden sm:flex hover:bg-primary/10 hover:text-primary"
                        onClick={handleRedownload}
                    >
                        <RotateCcw className="w-4 h-4" />
                        Redownload
                    </Button>
                    <div className="flex items-center gap-1.5 hidden sm:flex">
                        <Package className="w-4 h-4" />
                        <span>{cartItems.length} Modules</span>
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>

            {expanded && (
                <div className="border-t bg-muted/20 p-4">
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Build Contents</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h6 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Package className="w-4 h-4" /> Modules ({cartItems.length})
                            </h6>
                            <ul className="space-y-1">
                                {cartItems.map((item: any, idx: number) => (
                                    <li key={idx} className="text-xs flex items-center gap-2 p-1.5 bg-background rounded border">
                                        <span>{item.icon || '📦'}</span>
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-muted-foreground ml-auto">{item.module}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h6 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <FileCode className="w-4 h-4" /> Configuration
                            </h6>
                            <div className="text-xs space-y-2">
                                <div className="p-2 bg-background rounded border">
                                    <span className="text-muted-foreground block mb-1">Optimizers:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {optimizers.length > 0 ? optimizers.map((opt: string) => (
                                            <span key={opt} className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px]">
                                                {opt}
                                            </span>
                                        )) : <span className="text-muted-foreground italic">None</span>}
                                    </div>
                                </div>
                                <div className="p-2 bg-background rounded border">
                                    <span className="text-muted-foreground block mb-1">OS Target:</span>
                                    <span className="font-medium capitalize">{download.os_type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
