import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SinglePostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from("news_posts")
        .select("*, profiles(role)")
        .eq("id", id)
        .single();

    if (!post) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl space-y-8">
            <Link href="/news">
                <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to News
                </Button>
            </Link>

            <div className="space-y-4 border-b pb-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">{post.title}</h1>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <time dateTime={post.created_at}>
                        {new Date(post.created_at).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                </div>
            </div>

            {post.image_url && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-muted">
                    <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-xl prose-headings:font-bold">
                <div className="whitespace-pre-wrap leading-relaxed text-foreground/90 font-serif text-lg">
                    {post.content}
                </div>
            </div>
        </div>
    );
}
