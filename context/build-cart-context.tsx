"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface CartItem {
    id: string;
    name: string;
    category: string;
    vendor: string;
    connection: string[];
    os: string[];
    icon: string;
    specs: string;
    difficulty: string;
    package: string;
    path: string;
    module: string;
    isTested: boolean;
    contributor: any;
    init_args: any;
    start_command?: string | null;
    instanceId: string; // Unique ID for this specific instance in the cart
}

interface BuildCartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, "instanceId">) => void;
    removeFromCart: (instanceId: string) => void;
    clearCart: () => void;
}

const BuildCartContext = createContext<BuildCartContextType | undefined>(undefined);

export function BuildCartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("ivoryos-build-hardware");
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart items", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("ivoryos-build-hardware", JSON.stringify(cartItems));
        }
    }, [cartItems, isInitialized]);

    const addToCart = (item: Omit<CartItem, "instanceId">) => {
        const newItem = { ...item, instanceId: `${item.id}-${Date.now()}` };
        setCartItems((prev) => [...prev, newItem]);
        toast.success(`Added ${item.name} to Bench`);
    };

    const removeFromCart = (instanceId: string) => {
        setCartItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <BuildCartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </BuildCartContext.Provider>
    );
}

export function useBuildCart() {
    const context = useContext(BuildCartContext);
    if (context === undefined) {
        throw new Error("useBuildCart must be used within a BuildCartProvider");
    }
    return context;
}
