import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const title = "IvoryOS - Self-Driving Labs in One Line";
const description = "The plug-and-play orchestrator for rapid lab automation. Built for scientists, by scientists.";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: title,
    template: "%s | IvoryOS",
  },
  description,
  keywords: [
    "Lab Automation",
    "Python",
    "Science",
    "Robotics",
    "Self-Driving Labs",
    "Chemistry",
    "Biology",
    "Research",
    "Open Source",
  ],
  authors: [
    {
      name: "IvoryOS Team",
      url: "https://ivoryos.ai",
    },
  ],
  creator: "IvoryOS Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    title,
    description,
    siteName: "IvoryOS",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "IvoryOS Landing Page",
      },
    ],
  },

  alternates: {
    canonical: defaultUrl,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
