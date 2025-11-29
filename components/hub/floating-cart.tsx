"use client";

import { useBuildCart } from "@/context/build-cart-context";
import { FlaskConical } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCart() {
    const { cartItems } = useBuildCart();
    const itemCount = cartItems.length;

    return (
        <AnimatePresence>
            {itemCount > 0 && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="fixed bottom-8 right-8 z-50"
                >
                    <Link href="/hub">
                        <Button
                            size="lg"
                            className="rounded-full h-16 w-16 shadow-lg relative bg-primary hover:bg-primary/90"
                            title="Lab Bench"
                        >
                            <FlaskConical className="h-8 w-8" />
                            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-background">
                                {itemCount}
                            </span>
                        </Button>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
