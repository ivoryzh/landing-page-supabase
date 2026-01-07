import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthButton } from "@/components/auth-button";

export default function NewsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex-1 w-full flex flex-col min-h-screen">
            <Navbar authButton={<AuthButton />} />
            <main className="flex-1 w-full flex flex-col items-center">
                {children}
            </main>
            <Footer />
        </div>
    );
}
