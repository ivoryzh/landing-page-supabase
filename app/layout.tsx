import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.NODE_ENV === "production"
  ? "https://ivoryos.ai"
  : "http://localhost:3000";


const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "IvoryOS | Self-Driving Lab in One Line",
  description: "Instant orchestration for your lab. Built for scientists, by scientists.",
  openGraph: {
    title: "IvoryOS | Self-Driving Lab in One Line",
    description: "Instant orchestration for your lab. Built for scientists, by scientists.",
    url: defaultUrl,
    siteName: "IvoryOS",
    images: [
      {
        url: "/opengraph-image.png",
        width: 2536,
        height: 1290,
        alt: "IvoryOS - Self-Driving Lab in One Line",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IvoryOS | Self-Driving Lab in One Line",
    description: "Instant orchestration for your lab. Built for scientists, by scientists.",
    images: ["/twitter-image.png"],
  },
};

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
