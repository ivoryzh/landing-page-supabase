"use client";

import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";

const screenshots = [
    {
        src: "assets/screenshots/screenshot1.png",
        title: "Workflow Builder",
        description: "Design experiments with visual drag-and-drop interface",
    },
    {
        src: "assets/screenshots/screenshot2.png",
        title: "Optimization Setup",
        description: "Configure optimization algorithms and parameters",
    },
    {
        src: "assets/screenshots/screenshot3.png",
        title: "Results Dashboard",
        description: "Visualize experimental records and data",
    },
    {
        src: "assets/screenshots/screenshot4.png",
        title: "Natural Language Interface",
        description: "Chat with your robots in natural language",
    },
];

export function DeveloperDemo() {
    const [currentScreenshot, setCurrentScreenshot] = useState(0);
    const [typedCode, setTypedCode] = useState("");
    const [showInterface, setShowInterface] = useState(false);
    const [isTyping, setIsTyping] = useState(true);
    const [autoPlayScreenshots, setAutoPlayScreenshots] = useState(true);

    const baseCode = `import ivoryos

class MySelfDrivingLab:
    def add_liquid(self, amount: float, ...):
        """Add reagent"""
        ...

    def analyze(self):
        """Analyze data"""
        return 1

robot = MySelfDrivingLab()

`;
    const typingText = "ivoryos.run(__name__)";

    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.3 });

    // Auto-play screenshots
    useEffect(() => {
        if (!autoPlayScreenshots) return;
        const interval = setInterval(() => {
            setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [autoPlayScreenshots, screenshots.length]);

    useEffect(() => {
        let currentIndex = 0;
        const typingDelay = 100; // ms per char
        const startDelay = 500; // ms before start
        const loopDelay = 12200; // ms before restarting loop (4 slides * 3s + 200ms offset)

        // Initialize with null/undefined to satisfy linter
        let typingInterval: NodeJS.Timeout | undefined;
        let loopTimeout: NodeJS.Timeout | undefined;
        let initialTimeout: NodeJS.Timeout | undefined;

        const startAnimation = () => {
            // Reset state
            setTypedCode("");
            setShowInterface(false);
            setIsTyping(true);
            setAutoPlayScreenshots(false); // Prevent background cycling
            setCurrentScreenshot(0);       // Always start from 0
            currentIndex = 0;

            // Start typing
            typingInterval = setInterval(() => {
                if (currentIndex <= typingText.length) {
                    setTypedCode(typingText.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    setIsTyping(false);
                    setTimeout(() => {
                        setShowInterface(true);
                        setAutoPlayScreenshots(true); // Start cycling only when visible
                    }, 200); // reduced delay for snappier feel

                    // Schedule next loop
                    loopTimeout = setTimeout(startAnimation, loopDelay);
                }
            }, typingDelay);
        };

        if (isInView) {
            initialTimeout = setTimeout(startAnimation, startDelay);
            // autoPlayScreenshots is handled by startAnimation
        } else {
            // Reset when out of view
            setTypedCode("");
            setShowInterface(false);
            setIsTyping(true);
            clearTimeout(initialTimeout);
            clearInterval(typingInterval);
            clearTimeout(loopTimeout);
            setAutoPlayScreenshots(false); // Pause screenshots when out of view
        }

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(typingInterval);
            clearTimeout(loopTimeout);
        };
    }, [isInView]);



    const nextScreenshot = () => {
        setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
    };

    const prevScreenshot = () => {
        setCurrentScreenshot((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    };

    const fullCode = baseCode + typedCode;

    return (
        <section id="developer" ref={containerRef} className="w-full py-16 bg-muted/30 border-y border-border/40">
            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-12">
                <div className="text-center space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">IvoryOS Core</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Develop in Python? IvoryOS turns it into an autonomous experiment platform in one line.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted font-mono text-sm border border-border/50">
                            <span className="text-blue-500">$</span>
                            <span>pip install ivoryos</span>
                            <button
                                onClick={() => navigator.clipboard.writeText("pip install ivoryos")}
                                className="ml-2 p-1.5 hover:bg-background rounded-md transition-colors text-muted-foreground hover:text-foreground"
                                title="Copy command"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                            </button>
                        </div>

                        <a
                            href="https://github.com/ivoryos-ai/ivoryos"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                            View on GitHub
                        </a>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 min-h-[500px]">
                    {/* Code Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-lg bg-[#282c34] rounded-lg shadow-xl overflow-hidden"
                    >
                        <div className="flex items-center gap-2 px-4 py-3 bg-[#21252b] border-b border-white/10">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <span className="ml-2 text-xs text-gray-400 font-mono">robot_controller.py</span>
                        </div>
                        <div className="p-4 text-sm font-mono overflow-x-auto relative min-h-[300px] whitespace-pre">
                            <SyntaxHighlighter
                                language="python"
                                style={oneDark}
                                customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                                showLineNumbers={false}
                                PreTag="span"
                            >
                                {fullCode}
                            </SyntaxHighlighter>
                            {isTyping && (
                                <span className="inline-block w-2.5 h-5 bg-blue-500 animate-pulse ml-0.5 align-text-bottom" />
                            )}
                        </div>
                    </motion.div>

                    {/* Arrow / Launch Animation */}
                    <div className="flex flex-col items-center justify-center gap-4 h-[120px] min-w-[120px]">
                        <AnimatePresence mode="wait">
                            {showInterface && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center gap-2"
                                >
                                    {/* Text first, then arrow (Reverse format?) or Arrow with Text */}
                                    {/* User said "reverse the launched format and appear the arrow with the text" */}
                                    {/* Let's try combining them into a cohesive vertical unit */}

                                    <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm border border-primary/20 text-foreground px-6 py-2.5 rounded-full shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                        </span>
                                        <span className="font-mono font-medium tracking-wider text-sm">SYSTEM LAUNCHED</span>
                                    </div>
                                    <span className="text-4xl text-muted-foreground/50 lg:rotate-0 rotate-90 block">→</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Screenshot Carousel - Reveal Animation */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                        animate={showInterface ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="w-full max-w-lg"
                    >
                        <div className="bg-card border rounded-xl shadow-xl overflow-hidden flex flex-col">
                            <div className="p-4 border-b bg-muted/20">
                                <h3 className="font-semibold">{screenshots[currentScreenshot].title}</h3>
                                <p className="text-sm text-muted-foreground">{screenshots[currentScreenshot].description}</p>
                            </div>
                            <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden group">
                                <Image
                                    src={`/${screenshots[currentScreenshot].src}`}
                                    alt={screenshots[currentScreenshot].title}
                                    fill
                                    className="object-cover"
                                />

                                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={prevScreenshot}
                                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextScreenshot}
                                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 flex justify-center gap-2">
                                {screenshots.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentScreenshot(idx)}
                                        className={`w-2 h-2 rounded-full transition-colors ${idx === currentScreenshot ? "bg-primary" : "bg-muted-foreground/30"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>

    );
}
