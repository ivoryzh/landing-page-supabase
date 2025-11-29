import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, User } from "lucide-react";
import { TemplateCard } from "@/components/hub/template-card";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    const { data: templates, error } = await supabase
        .from("templates")
        .select(`
            *,
            profiles:contributor_id (*)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching templates:", error);
        return <div>Error loading templates</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Templates</h1>
                    <p className="text-muted-foreground">
                        Pre-configured workflows to get you started.
                    </p>
                </div>
                <Link
                    href="/hub/contribute?type=template"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
                >
                    + Submit Template
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates?.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                ))}

                {templates?.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No templates found. Be the first to contribute!
                    </div>
                )}
            </div>
        </div>
    );
}
