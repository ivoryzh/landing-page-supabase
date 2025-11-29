"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { type Database } from "@/utils/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function ProfileForm({
    user,
    profile,
    onSuccess,
}: {
    user: User;
    profile: Profile | null;
    onSuccess?: () => void;
}) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [fullname, setFullname] = useState(profile?.full_name || "");
    const [labInfo, setLabInfo] = useState(profile?.lab_info || "");
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
    const [uploading, setUploading] = useState(false);

    const getProfile = useCallback(async () => {
        try {
            setLoading(true);

            const { data, error, status } = await supabase
                .from("profiles")
                .select(`full_name, lab_info, avatar_url`)
                .eq("id", user?.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setFullname(data.full_name || "");
                setLabInfo(data.lab_info || "");
                setAvatarUrl(data.avatar_url || "");
            }
        } catch (error) {
            toast.error("Error loading user data!");
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        getProfile();
    }, [user, getProfile]);

    async function updateProfile({
        fullname,
        labInfo,
        avatarUrl,
    }: {
        fullname: string | null;
        labInfo: string | null;
        avatarUrl: string | null;
    }) {
        try {
            setLoading(true);

            const { error } = await supabase.from("profiles").upsert({
                id: user?.id as string,
                full_name: fullname,
                lab_info: labInfo,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            });

            if (error) throw error;
            toast.success("Profile updated!");
            onSuccess?.();
        } catch (error) {
            toast.error("Error updating the data!");
        } finally {
            setLoading(false);
        }
    }

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);

            setAvatarUrl(publicUrl);
            await updateProfile({ fullname, labInfo, avatarUrl: publicUrl });
            onSuccess?.();
        } catch (error) {
            toast.error("Error uploading avatar!");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback>{fullname?.slice(0, 2)?.toUpperCase() || user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="avatar" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        Change Avatar
                    </Label>
                    <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                        className="hidden"
                    />
                    <p className="text-xs text-muted-foreground">
                        Recommended: Square image, max 2MB.
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="text" value={user?.email} disabled />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        type="text"
                        value={fullname || ""}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="labInfo">Lab Info</Label>
                    <Textarea
                        id="labInfo"
                        value={labInfo || ""}
                        onChange={(e) => setLabInfo(e.target.value)}
                        placeholder="Tell us about your research..."
                    />
                </div>

                <Button
                    onClick={() => updateProfile({ fullname, labInfo, avatarUrl })}
                    disabled={loading}
                    className="w-fit"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </Button>
            </div>
        </div>
    );
}
