import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
    const faqs = [
        {
            question: "What is IvoryOS?",
            answer: "IvoryOS is a modular platform for rapid hardware and analysis development, designed to simplify lab automation for scientists and engineers."
        },
        {
            question: "Do I need to know Python?",
            answer: "While IvoryOS is built on Python, we provide a visual experiment builder and high-level abstractions so you can get started with minimal coding. However, Python knowledge allows for deeper customization."
        },
        {
            question: "Is it open source?",
            answer: "Yes, IvoryOS is committed to open science. We encourage contributions from the community to expand the ecosystem of drivers and modules."
        },
        {
            question: "Can I use my own hardware?",
            answer: "Absolutely. IvoryOS is designed to be hardware-agnostic. You can use existing drivers or write your own to connect any instrument to the platform."
        },
        {
            question: "How do I get started?",
            answer: "You can download the launcher from our website, or install the python package directly. Check out our documentation for a quick start guide."
        }
    ];

    return (
        <section id="faq" className="w-full py-16 md:py-24 border-t border-border/40">
            <div className="max-w-3xl mx-auto px-4 flex flex-col gap-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                    <p className="text-xl text-muted-foreground">
                        Everything you need to know about IvoryOS.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`}>
                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
