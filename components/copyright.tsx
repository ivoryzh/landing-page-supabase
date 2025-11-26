"use client";

import { useEffect, useState } from "react";

export function Copyright() {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    // Render a fallback or nothing during server-side rendering to avoid hydration mismatch
    // strictly speaking, for a year, it's usually fine, but this is safest.
    // However, for SEO, we might want the text.
    // Let's just render the text without the year initially or just static 2025 if we want.
    // Actually, just returning the text with the year is fine in a client component
    // because it runs on the client.
    // BUT, to avoid hydration mismatch if the server renders one thing and client another (e.g. new year eve),
    // we should use mounted state.

    if (!year) {
        return <p>© IvoryOS. All rights reserved.</p>;
    }

    return (
        <p>© {year} IvoryOS. All rights reserved.</p>
    );
}
