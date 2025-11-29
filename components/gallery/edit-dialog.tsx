"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { type Database } from "@/utils/supabase/types";

type GalleryPost = Database["public"]["Tables"]["gallery_posts"]["Row"];

interface EditDialogProps {
    post: GalleryPost;
    onUpdateSuccess: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditDialog({ post, onUpdateSuccess, open, onOpenChange }: EditDialogProps) {
    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description || "");
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from("gallery_posts")
                .update({ title, description })
                .eq("id", post.id);

            if (error) throw error;

            toast.success("Post updated successfully!");
            onUpdateSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error("Failed to update post.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
        setIsDeleting(true);

        try {
            // First delete associated likes to avoid foreign key constraint violations
            await supabase.from("likes").delete().eq("post_id", post.id);

            const { data, error } = await supabase
                .from("gallery_posts")
                .delete()
                .eq("id", post.id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Post could not be deleted. You might not have permission.");
            }

            toast.success("Post deleted successfully");
            onOpenChange(false);
            onUpdateSuccess(); // This might need to trigger a refresh of the grid
            router.refresh();
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your setup a name"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell us about your setup..."
                            className="h-32"
                        />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            disabled={loading || isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            Delete Post
                        </Button>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading || isDeleting}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    );
}
