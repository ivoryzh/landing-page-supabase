import Link from "next/link";
import { Github, Linkedin, Youtube } from "lucide-react";
import { Copyright } from "@/components/copyright";

export function Footer() {
    return (
        <footer id="community" className="w-full border-t border-border/40 py-12 bg-muted/20">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <p className="font-semibold text-foreground text-lg">IvoryOS</p>
                        <p className="max-w-xs leading-relaxed">
                            Built for scientists, by scientists.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="https://discord.gg/3KdjhUmsYA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                        >
                            <svg role="img" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Discord</title><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 26.155 26.155 0 0 0-1.018 2.095 18.092 18.092 0 0 0-4.664 0 26.398 26.398 0 0 0-1.018-2.095.074.074 0 0 0-.08-.037 19.736 19.736 0 0 0-4.885 1.515.05.05 0 0 0-.018.077 24.032 24.032 0 0 0-2.362 10.153c.001.077 0 .154.004.23.003.111.014.22.032.327a19.866 19.866 0 0 0 5.143 2.6.049.049 0 0 0 .041-.017 14.364 14.364 0 0 0 1.056-1.724.05.05 0 0 0-.022-.068 12.835 12.835 0 0 1-1.892-.912.049.049 0 0 1-.004-.08c.119-.089.237-.184.354-.282a.05.05 0 0 1 .057-.007c3.922 1.83 8.18 1.83 12.067 0a.05.05 0 0 1 .057.007c.118.098.236.193.355.282a.049.049 0 0 1-.004.08 12.556 12.556 0 0 1-1.892.912.049.049 0 0 0-.022.068 14.398 14.398 0 0 0 1.057 1.724.048.048 0 0 0 .04.017 19.896 19.896 0 0 0 5.144-2.603c.023-.122.037-.247.04-.374.003-.061.003-.123.003-.185 0-5.18-2.322-9.457-2.362-10.153a.05.05 0 0 0-.017-.077zM8.02 15.33c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.418 2.157-2.418 1.21 0 2.176 1.096 2.157 2.418 0 1.334-.956 2.42-2.157 2.42zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.096 2.157 2.418 0 1.334-.946 2.42-2.157 2.42z" /></svg>
                            <span className="sr-only">Discord</span>
                        </Link>
                        <Link
                            href="https://linkedin.com/company/ivoryos"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                            <span className="sr-only">LinkedIn</span>
                        </Link>
                        <Link
                            href="https://youtube.com/@ivoryos"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                        >
                            <Youtube className="w-5 h-5" />
                            <span className="sr-only">YouTube</span>
                        </Link>
                        <Link
                            href="https://github.com/ivoryos-ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                        >
                            <Github className="w-5 h-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col gap-2 text-right">
                    <Copyright />
                    <p className="text-xs text-muted-foreground/60 max-w-md">
                        Disclaimer: Modules are sourced from PyPI. We do not guarantee the safety or reliability of external packages.
                    </p>
                    <div className="flex gap-4 justify-end mt-2 text-xs">
                        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                        <Link href="/terms" className="hover:underline">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
