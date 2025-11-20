"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
// import { useAuth } from "@/hooks/useAuth";


export default function Navigation() {
//   const { user, loading } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };



  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo-container">
          <div className="logo-placeholder">
            <span className="logo-text">IvoryOS</span>
          </div>
        </div>

        <div className="nav-right">
          <ul className="nav-links">
            <li><a href="#hero" className="nav-link">Home</a></li>
            <li><a href="#problem" className="nav-link">Solution</a></li>
            <li><a href="#vision" className="nav-link">Vision</a></li>
            <li><a href="#community" className="nav-link">Community</a></li>
          </ul>

          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <div className="auth-container">
          <Suspense>
                <AuthButton />
              </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}
