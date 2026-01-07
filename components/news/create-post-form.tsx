"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function CreatePostForm({ post }: { post?: any }) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(post?.title || "");
    const [content, setContent] = useState(post?.content || "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(post?.image_url || null);

    const router = useRouter();
    const supabase = createClient();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            let imageUrl = null;

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('news_images')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('news_images')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            if (post) {
                // Update
                const { error: updateError } = await supabase
                    .from('news_posts')
                    .update({
                        title,
                        content,
                        ...(imageUrl ? { image_url: imageUrl } : {}), // Only update image if new one uploaded
                        // If user removed image? We need logic for that. 
                        // Current logic: removeImage sets imagePreview to null.
                        // If imagePreview is null and post.image_url was not, we should set image_url to null.
                        // Let's handle explicit nulling.
                        image_url: imagePreview ? (imageUrl || imagePreview) : null
                    })
                    .eq('id', post.id);

                if (updateError) throw updateError;
                toast.success("Post updated successfully!");
            } else {
                // Insert
                const { error: insertError } = await supabase
                    .from('news_posts')
                    .insert({
                        title,
                        content,
                        image_url: imageUrl,
                        author_id: user?.id,
                    });

                if (insertError) throw insertError;
                toast.success("Post created successfully!");
            }
            router.push("/news");
            router.refresh();
        } catch (error: any) {
            console.error("Error creating post:", error);
            toast.error(error.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-card border rounded-xl p-6 shadow-sm">
            <div className="space-y-2">
                <Label htmlFor="title" className="text-lg">Post Title</Label>
                <Input
                    id="title"
                    placeholder="Enter a catchy title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="text-lg"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="image" className="text-lg">Cover Image</Label>
                <div className="flex flex-col gap-4">
                    {!imagePreview ? (
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="image-upload"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors border-muted-foreground/25"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                                </div>
                                <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                    ) : (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden group">
                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button type="button" variant="destructive" size="sm" onClick={removeImage}>
                                    <X className="mr-2 h-4 w-4" /> Remove Image
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="content" className="text-lg">Content</Label>
                <Textarea
                    id="content"
                    placeholder="Write your news post here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="min-h-[300px] text-base leading-relaxed p-4"
                />
                <p className="text-xs text-muted-foreground text-right">{content.length} characters</p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="min-w-[120px]">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {post ? "Updating..." : "Creating..."}
                        </>
                    ) : (
                        post ? "Update Post" : "Publish Post"
                    )}
                </Button>
            </div>
        </form>
    );
}
