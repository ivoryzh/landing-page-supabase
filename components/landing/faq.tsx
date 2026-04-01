"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const faqs = [
    {
        question: "Why automate scientific research?",
        answer: "Automation isn’t just about saving time or improving reproducibility. It enables autonomous discovery — systems that can run, learn, and decide what to try next. The goal isn’t faster experiments — it’s faster discovery.",
        image: "/faq/1-autonomous.png"
    },
    {
        question: "Why is flexibility critical in R&D automation?",
        answer: "R&D is unpredictable. Workflows constantly change, and trial-and-error is essential. Scientists need to modify workflows quickly and add new instruments or steps easily. Rigid systems slow down discovery — flexibility isn’t optional, it’s essential.",
        image: "/faq/2-flexibility.png"
    },
    {
        question: "Why is coordinating multiple instruments so hard?",
        answer: "Modern labs have many systems — robots, analytical tools, software — that don’t naturally communicate. Existing software is usually closed, hardware-specific, and rigid, so there’s no solution for dynamic, multi-instrument workflows.",
        image: "/faq/3-challenges.png"
    },
    {
        question: "Why is programming still the best solution today?",
        answer: "Programming remains the most flexible, powerful, and scalable way to automate scientific research. However, most scientists are not trained to code, and even if they were, it would be a waste of their time and talent.",
        image: "/faq/4-why-programming.png"
    },
    {
        question: "Why not just hire more engineers?",
        answer: "The bottleneck is collaboration, not execution. Communication takes time, iterations slow down, and small changes become expensive. Scientists need independence in experimental design.",
        image: "/faq/5-why-not-more-engineers.png"
    },
    {
        question: "How does IvoryOS solve this?",
        answer: "IvoryOS combines an open, plug-and-play core (connect any instrument), flexible interface (visual + programmable), and an ecosystem layer (share and collaborate). It turns experiments into something programmable, composable, and scalable.",
        image: "/faq/6-how-ivoryos-solves.png"
    },
    {
        question: "Why does an ecosystem matter?",
        answer: "The problem isn’t just tools — it’s fragmentation. An ecosystem allows sharing workflows, reusing integrations, and connecting people. Instead of retraining everyone, you connect and build on each other.",
        image: "/faq/7-ecosystem.png"
    },
    {
        question: "Who is IvoryOS for?",
        answer: "IvoryOS is for labs building automation from scratch, teams scaling complex workflows, researchers who want more control, and manufacturers with dynamic processes.",
        image: "/faq/8-who-is-for.png"
    },
    {
        question: "Can I use IvoryOS for beyond science, like on coffee-making robots?",
        answer: "Technically yes — but it’s overkill. IvoryOS shines when workflows are dynamic, iterative, and decision-driven. If your goal is to autonomously optimize the best ingredient and brewing method combination, that’s exactly what we can do.",
        image: "/faq/9-coffee-2.png"
    }
];

export function FAQ() {
    return (
        <section id="faq" className="w-full py-24 md:py-32 border-t border-border/40 bg-zinc-50 dark:bg-zinc-950/20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="text-center space-y-4 mb-24 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Why IvoryOS?</h2>
                    <p className="text-xl text-muted-foreground">
                        The journey to autonomous discovery and how we're changing the future of lab automation.
                    </p>
                </div>

                <div className="relative w-full">
                    {/* The central timeline line */}
                    <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-primary/80 via-border to-transparent transform md:-translate-x-1/2 rounded-full" />

                    <div className="flex flex-col gap-16 md:gap-32">
                        {faqs.map((faq, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                                    className="relative flex flex-col md:flex-row items-center justify-between w-full"
                                >
                                    {/* Timeline Node (The Number Circle) */}
                                    <div className="absolute left-6 md:left-1/2 w-12 h-12 rounded-full border-4 border-background bg-zinc-200 dark:bg-zinc-800 shadow-lg transform -translate-x-1/2 flex items-center justify-center text-base font-bold z-10 text-muted-foreground transition-colors">
                                        <span className="text-primary font-bold">{index + 1}</span>
                                    </div>

                                    {/* Text Box (QA) */}
                                    <div
                                        className={`order-1 w-full md:w-[45%] pl-20 md:pl-0 flex flex-col justify-center
                                        ${isEven ? 'md:order-1 md:pr-16 md:items-end md:text-right' : 'md:order-2 md:pl-16 md:items-start md:text-left'}
                                        `}
                                    >
                                        <h3 className="font-bold text-2xl md:text-3xl mb-6 tracking-tight text-foreground">
                                            {faq.question}
                                        </h3>
                                        <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                                            {faq.answer}
                                        </p>
                                    </div>

                                    {/* Image Box */}
                                    <div
                                        className={`order-2 w-full md:w-[45%] pl-20 md:pl-0 mt-8 md:mt-0 
                                        ${isEven ? 'md:order-2 md:pl-16' : 'md:order-1 md:pr-16'}
                                        `}
                                    >
                                        <div className="relative w-full aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border/40 bg-zinc-900 group">
                                            <Image
                                                src={faq.image}
                                                alt={faq.question}
                                                fill
                                                className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                                quality={90}
                                            />
                                            {/* Subtle gradient overlay to enhance visual depth */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                                        </div>
                                    </div>

                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
