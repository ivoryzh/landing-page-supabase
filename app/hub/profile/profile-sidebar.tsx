"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Database } from "@/utils/supabase/types";
import { Pencil } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ProfileForm } from "./profile-form";
import { User } from "@supabase/supabase-js";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileSidebarProps {
    user: User | null;
    profile: Profile;
    readOnly?: boolean;
}

export function ProfileSidebar({ user, profile, readOnly = false }: ProfileSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6 w-full md:w-64 shrink-0">
            <div className="flex flex-col items-center text-center gap-4 p-6 border rounded-lg bg-card shadow-sm">
                <Avatar className="h-32 w-32">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="text-4xl">
                        {profile.full_name?.slice(0, 2)?.toUpperCase() ||
                            profile.username?.slice(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h2 className="text-xl font-bold">
                        {profile.full_name || "Anonymous User"}
                    </h2>
                    {!readOnly && user && (
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    )}
                </div>

                {!readOnly && user && (
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full gap-2">
                                <Pencil className="h-4 w-4" />
                                Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                            </DialogHeader>
                            <ProfileForm user={user} profile={profile} onSuccess={() => setIsOpen(false)} />
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {profile.lab_info && (
                <div className="p-6 border rounded-lg bg-card shadow-sm space-y-3">
                    <h3 className="font-semibold">Lab Info</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {profile.lab_info}
                    </p>
                </div>
            )}
        </div>
    );
}
