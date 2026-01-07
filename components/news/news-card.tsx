"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { deletePost } from "@/app/news/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function NewsCard({ post, isAdmin }: { post: any, isAdmin?: boolean }) {
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        if (!confirm("Are you sure you want to delete this post?")) return;

        const result = await deletePost(post.id);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Post deleted");
            router.refresh(); // Refresh to update UI
        }
    };

    return (
        <Link href={`/news/${post.id}`}>
            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 hover:bg-card">
                {post.image_url && (
                    <div className="relative h-48 w-full overflow-hidden">
                        <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                )}
                <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-xl font-bold line-clamp-2 leading-tight flex-1">{post.title}</h3>
                        {isAdmin && (
                            <div className="flex gap-1 shrink-0">
                                <Link href={`/news/edit/${post.id}`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500" onClick={(e) => e.stopPropagation()}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={handleDelete}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                        {post.content}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
}
