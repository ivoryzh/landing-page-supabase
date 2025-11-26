"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export function DeveloperDemo() {
    const [currentScreenshot, setCurrentScreenshot] = useState(0);

    const screenshots = [
        {
            src: "assets/screenshots/screenshot1.png",
            title: "Experiment Builder",
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

    const nextScreenshot = () => {
        setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
    };

    const prevScreenshot = () => {
        setCurrentScreenshot((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    };

    const codeString = `import ivoryos

class MySelfDrivingLab:
    def add_liquid(self, amount: float, ...):
        """Add reagent"""
        ...

    def analyze(self):
        """Analyze data"""
        return 1

robot = MySelfDrivingLab()

ivoryos.run(__name__)`;

    return (
        <section id="developer" className="w-full py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">Powered by IvoryOS</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Write your lab automation once. IvoryOS turns it into an experiment platform in one line.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
                    {/* Code Side */}
                    <div className="w-full max-w-md bg-[#282c34] rounded-lg shadow-xl overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 bg-[#21252b] border-b border-white/10">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <span className="ml-2 text-xs text-gray-400 font-mono">robot_controller.py</span>
                        </div>
                        <div className="p-4 text-sm font-mono overflow-x-auto">
                            <SyntaxHighlighter
                                language="python"
                                style={oneDark}
                                customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                                showLineNumbers={false}
                            >
                                {codeString}
                            </SyntaxHighlighter>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
                        <span className="text-4xl lg:rotate-0 rotate-90">→</span>
                        <span className="text-sm font-medium">launches</span>
                    </div>

                    {/* Screenshot Carousel */}
                    <div className="w-full max-w-xl bg-card border rounded-xl shadow-xl overflow-hidden flex flex-col">
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
                </div>

                <div className="flex flex-col items-center gap-4 mt-8">
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Launch with one line</p>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                        <code className="relative block bg-background border border-border px-8 py-4 rounded-lg text-xl md:text-2xl font-mono font-bold text-foreground shadow-xl">
                            ivoryos.run(__name__)
                        </code>
                    </div>
                </div>
            </div>
        </section>
    );
}
