"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Database } from "@/utils/supabase/types";
import { Check, ChevronsUpDown, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type Device = Database["public"]["Tables"]["devices"]["Row"];
type Module = Database["public"]["Tables"]["modules"]["Row"];

interface ContributeFormProps {
    devices: Device[];
    userId: string;
}

export function ContributeForm({ devices, userId }: ContributeFormProps) {
    const [type, setType] = useState<"module" | "device" | "template" | "post">("module");
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        const typeParam = searchParams.get("type");
        const editIdParam = searchParams.get("edit_id");

        if (typeParam && ["module", "device", "template", "post"].includes(typeParam)) {
            setType(typeParam as any);
        }

        if (editIdParam) {
            setEditId(editIdParam);
            const fetchData = async () => {
                setLoading(true);
                try {
                    if (typeParam === "module") {
                        const { data, error } = await supabase.from("modules").select("*").eq("id", editIdParam).single();
                        if (error) throw error;
                        if (data) {
                            setModuleName(data.name);
                            setModuleClassName(data.module_name);
                            setPipName(data.pip_name);
                            setImportPath(data.module_path || "");
                            setPythonVersions(data.python_versions?.join(", ") || "");
                            setSelectedDeviceId(data.device_id ? data.device_id.toString() : "agnostic");
                            setIsTested(!!data.is_tested_with_ivoryos);
                            setIsUnlisted(!!data.is_unlisted);
                            setIsOriginalDeveloper(!!data.is_original_developer);
                            setInitArgs((data.init_args as any[]) || []);
                            setOs(data.os || []);
                            setConnectionTypes(data.connection || []);
                            setStartCommand(data.start_command || "");
                            setDescription(data.description || "");
                        }
                    } else if (typeParam === "template") {
                        const { data, error } = await supabase.from("templates").select("*").eq("id", editIdParam).single();
                        if (error) throw error;
                        if (data) {
                            setTemplateName(data.title);
                            setTemplateDescription(data.description || "");
                            setTemplateJson(JSON.stringify(data.workflow_json, null, 2));
                            setSelectedModuleIds(data.module_ids?.map((id: number) => id.toString()) || []);
                        }
                    } else if (typeParam === "post") {
                        const { data, error } = await supabase.from("gallery_posts").select("*").eq("id", editIdParam).single();
                        if (error) throw error;
                        if (data) {
                            setPostTitle(data.title);
                            setPostDescription(data.description || "");
                        }
                    } else if (typeParam === "device") {
                        const { data, error } = await supabase.from("devices").select("*").eq("id", editIdParam).single();
                        if (error) throw error;
                        if (data) {
                            setDeviceName(data.name);
                            setVendor(data.vendor);
                            setCategory(data.category || "");
                            setOfficialUrl(data.official_url || "");
                            // We can't easily set the file input for image, but we can handle it if new one is uploaded
                        }
                    }
                } catch (error) {
                    console.error("Error fetching data for edit:", error);
                    toast.error("Failed to load data for editing.");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else {
            setEditId(null);
            // Reset all form fields
            setModuleName("");
            setModuleClassName("");
            setPipName("");
            setImportPath("");
            setPythonVersions("");
            setSelectedDeviceId("agnostic");
            setIsTested(false);
            setIsUnlisted(false);
            setIsOriginalDeveloper(false);
            setInitArgs([]);
            setOs([]);
            setConnectionTypes([]);
            setStartCommand("");

            setDeviceName("");
            setVendor("");
            setCategory("");
            setDeviceImage(null);
            setOfficialUrl("");

            setTemplateName("");
            setTemplateDescription("");
            setTemplateJson("");
            setSelectedModuleIds([]);

            setPostTitle("");
            setPostDescription("");
            setPostImage(null);
        }
    }, [searchParams, supabase]);

    // Module Form State
    const [moduleName, setModuleName] = useState("");
    const [moduleClassName, setModuleClassName] = useState("");
    const [pipName, setPipName] = useState("");
    const [importPath, setImportPath] = useState("");
    const [pythonVersions, setPythonVersions] = useState("");
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("agnostic");
    const [isTested, setIsTested] = useState(false);
    const [isUnlisted, setIsUnlisted] = useState(false);
    const [isOriginalDeveloper, setIsOriginalDeveloper] = useState(false);
    const [initArgs, setInitArgs] = useState<{ name: string; type: "str" | "int" | "float" | "bool" }[]>([]);
    const [newArgName, setNewArgName] = useState("");
    const [newArgType, setNewArgType] = useState<"str" | "int" | "float" | "bool">("str");
    const [openDeviceCombobox, setOpenDeviceCombobox] = useState(false);
    const [os, setOs] = useState<string[]>([]);
    const [connectionTypes, setConnectionTypes] = useState<string[]>([]);
    const [startCommand, setStartCommand] = useState("");
    const [description, setDescription] = useState("");

    // Device Form State
    const [deviceName, setDeviceName] = useState("");
    const [vendor, setVendor] = useState("");
    const [category, setCategory] = useState("");
    const [deviceImage, setDeviceImage] = useState<File | null>(null);
    const [officialUrl, setOfficialUrl] = useState("");

    // Template Form State
    const [templateName, setTemplateName] = useState("");
    const [templateDescription, setTemplateDescription] = useState("");
    const [templateJson, setTemplateJson] = useState("");
    const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
    const [availableModules, setAvailableModules] = useState<Module[]>([]);

    // Gallery Post Form State
    const [postTitle, setPostTitle] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [postImage, setPostImage] = useState<File | null>(null);

    useEffect(() => {
        const fetchModules = async () => {
            const { data } = await supabase.from("modules").select("*").order("name");
            if (data) setAvailableModules(data);
        };
        fetchModules();
    }, []);

    const handleAddArg = () => {
        if (!newArgName) return;
        setInitArgs([...initArgs, { name: newArgName, type: newArgType }]);
        setNewArgName("");
        setNewArgType("str");
    };

    const handleRemoveArg = (index: number) => {
        setInitArgs(initArgs.filter((_, i) => i !== index));
    };

    const handleDelete = async () => {
        if (!editId) return;
        setIsDeleting(true);
        try {
            let table = "";
            if (type === "module") table = "modules";
            else if (type === "template") table = "templates";
            else if (type === "post") table = "gallery_posts";
            else if (type === "device") table = "devices";
            else {
                toast.error("Deletion not supported for this type yet.");
                return;
            }

            // Verify ownership before attempting delete
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("You must be logged in to delete items.");
                return;
            }
            console.log("Attempting delete. User ID:", user.id, "Edit ID:", editId, "Type:", type);

            // Check the item's contributor_id
            const { data: itemToCheck, error: fetchError } = await supabase
                .from(table)
                .select("contributor_id")
                .eq("id", editId)
                .single();

            if (fetchError || !itemToCheck) {
                console.error("Error fetching item to check ownership:", fetchError);
            } else {
                console.log("Item contributor ID:", itemToCheck.contributor_id);
                if (itemToCheck.contributor_id !== user.id) {
                    console.error("Ownership mismatch! User:", user.id, "Contributor:", itemToCheck.contributor_id);
                    throw new Error(`Permission denied. You are user ${user.id} but this item belongs to ${itemToCheck.contributor_id}`);
                }
            }

            // First delete associated likes to avoid foreign key constraint violations
            if (type === "module") {
                await supabase.from("likes").delete().eq("module_id", editId);
            } else if (type === "template") {
                await supabase.from("likes").delete().eq("template_id", editId);
            } else if (type === "post") {
                await supabase.from("likes").delete().eq("post_id", editId);
            }

            const { data, error } = await supabase
                .from(table)
                .delete()
                .eq("id", editId)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Item could not be deleted. You might not have permission or it may not exist.");
            }

            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);

            // Redirect after deletion
            if (type === "post") router.push("/hub/gallery");
            else if (type === "template") router.push("/hub/templates");
            else if (type === "module") router.push("/hub/modules");
            else router.push("/hub");

            router.refresh();

        } catch (error: any) {
            console.error("Error deleting:", error);
            toast.error(`Failed to delete: ${error.message}`);
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (type === "module") {
                const payload = {
                    name: moduleName, // Display Name
                    module_name: moduleClassName, // Class Name
                    pip_name: pipName,
                    module_path: importPath,
                    python_versions: pythonVersions.split(",").map((v) => v.trim()),
                    is_tested_with_ivoryos: isTested,
                    is_unlisted: isUnlisted,
                    device_id: selectedDeviceId === "agnostic" ? null : parseInt(selectedDeviceId),
                    contributor_id: userId,
                    init_args: initArgs,
                    is_original_developer: isOriginalDeveloper,
                    os: os,
                    connection: connectionTypes,
                    start_command: startCommand,
                    description: description,
                };

                if (editId) {
                    const { error } = await supabase.from("modules").update(payload).eq("id", editId);
                    if (error) throw error;
                    toast.success("Module updated successfully!");
                } else {
                    const { error } = await supabase.from("modules").insert(payload);
                    if (error) throw error;
                    toast.success("Module submitted successfully!");
                }
            } else if (type === "device") {
                let imageUrl = null;
                if (deviceImage) {
                    const fileExt = deviceImage.name.split(".").pop();
                    const fileName = `${Date.now()}.${fileExt}`;
                    const { error: uploadError } = await supabase.storage
                        .from("devices")
                        .upload(fileName, deviceImage);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from("devices")
                        .getPublicUrl(fileName);

                    imageUrl = publicUrl;
                }

                // Note: Devices don't have edit support yet as per plan
                const payload: any = {
                    name: deviceName,
                    vendor: vendor,
                    category: category,
                    official_url: officialUrl,
                    connection_guide: (document.getElementById("connection-guide") as HTMLTextAreaElement)?.value || null,
                };

                if (imageUrl) {
                    payload.image_url = imageUrl;
                }

                if (editId) {
                    const { error } = await supabase.from("devices").update(payload).eq("id", editId);
                    if (error) throw error;
                    toast.success("Device updated successfully!");
                } else {
                    if (!imageUrl) {
                        // Optional: enforce image for new devices? 
                        // For now let's allow without image or maybe warn.
                    }
                    payload.image_url = imageUrl;
                    payload.contributor_id = userId; // Set contributor on creation
                    const { error } = await supabase.from("devices").insert(payload);
                    if (error) throw error;
                    toast.success("Device submitted successfully!");
                }
            } else if (type === "template") {
                let parsedJson;
                try {
                    parsedJson = JSON.parse(templateJson);
                } catch (e) {
                    throw new Error("Invalid JSON format");
                }

                const payload = {
                    title: templateName, // Schema uses title, not name
                    description: templateDescription,
                    workflow_json: parsedJson,
                    contributor_id: userId, // Updated schema to uuid
                    module_ids: selectedModuleIds.map(id => parseInt(id)), // Array of int8
                };

                if (editId) {
                    const { error } = await supabase.from("templates").update(payload).eq("id", editId);
                    if (error) throw error;
                    toast.success("Template updated successfully!");
                } else {
                    const { error } = await supabase.from("templates").insert(payload);
                    if (error) throw error;
                    toast.success("Template submitted successfully!");
                }
            } else if (type === "post") {
                // if (!postImage && !editId) throw new Error("Image is required for gallery posts"); // This check is now handled by the payload logic

                let publicUrl = null;
                if (postImage) {
                    const fileExt = postImage.name.split(".").pop();
                    const fileName = `${Date.now()}.${fileExt}`;
                    const { error: uploadError } = await supabase.storage
                        .from("gallery")
                        .upload(fileName, postImage);

                    if (uploadError) throw uploadError;

                    const { data } = supabase.storage
                        .from("gallery")
                        .getPublicUrl(fileName);
                    publicUrl = data.publicUrl;
                }

                const payload: any = {
                    title: postTitle,
                    description: postDescription,
                    user_id: userId,
                };

                if (publicUrl) {
                    payload.image_url = publicUrl;
                }

                if (editId) {
                    const { error } = await supabase.from("gallery_posts").update(payload).eq("id", editId);
                    if (error) throw error;
                    toast.success("Post updated successfully!");
                } else {
                    if (!publicUrl) throw new Error("Image is required for new posts");
                    payload.image_url = publicUrl; // Ensure it's there for insert
                    const { error } = await supabase.from("gallery_posts").insert(payload);
                    if (error) throw error;
                    toast.success("Post submitted successfully!");
                }
            }
            router.refresh();
            // Let's redirect to the relevant page based on type
            if (type === "post") router.push("/hub/gallery");
            else if (type === "template") router.push("/hub/templates");
            else if (type === "device") router.push("/hub/devices");
            else if (type === "module") router.push("/hub/modules");
            else router.push("/hub");

        } catch (error: any) {
            console.error("Error submitting:", error);
            toast.error(error.message || "Failed to submit.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-2xl font-bold">
                    {editId ? (
                        <>
                            {type === "module" && "Edit Module"}
                            {type === "device" && "Edit Device"}
                            {type === "template" && "Edit Template"}
                            {type === "post" && "Edit Gallery Post"}
                        </>
                    ) : (
                        <>
                            {type === "module" && "Add New Module"}
                            {type === "device" && "Add New Device"}
                            {type === "template" && "Add New Template"}
                            {type === "post" && "Add Gallery Post"}
                        </>
                    )}
                </h1>

                {/* Compact Type Switcher */}
                {!editId && (
                    <div className="flex bg-muted p-1 rounded-lg">
                        <button
                            onClick={() => setType("module")}
                            className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", type === "module" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            Module
                        </button>
                        <button
                            onClick={() => setType("device")}
                            className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", type === "device" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            Device
                        </button>
                        <button
                            onClick={() => setType("template")}
                            className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", type === "template" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            Template
                        </button>
                        <button
                            onClick={() => setType("post")}
                            className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", type === "post" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                            Post
                        </button>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                {type === "module" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Display Name</Label>
                                <Input
                                    required
                                    value={moduleName}
                                    onChange={(e) => setModuleName(e.target.value)}
                                    placeholder="e.g. My Custom Driver"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Pip Package Name</Label>
                                <Input
                                    required
                                    value={pipName}
                                    onChange={(e) => setPipName(e.target.value)}
                                    placeholder="e.g. my-driver-pkg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Import Path (from ...)</Label>
                                <Input
                                    required
                                    value={importPath}
                                    onChange={(e) => setImportPath(e.target.value)}
                                    placeholder="e.g. my_driver.main"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Class Name (import ...)</Label>
                                <Input
                                    required
                                    value={moduleClassName}
                                    onChange={(e) => setModuleClassName(e.target.value)}
                                    placeholder="e.g. MyDriver"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Operating System</Label>
                                <div className="flex flex-wrap gap-3">
                                    {["Windows", "Linux", "macOS"].map((osName) => (
                                        <div key={osName} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`os-${osName}`}
                                                checked={os.includes(osName)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) setOs([...os, osName]);
                                                    else setOs(os.filter((o) => o !== osName));
                                                }}
                                            />
                                            <Label htmlFor={`os-${osName}`}>{osName}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Connection Type</Label>
                                <div className="flex flex-wrap gap-3">
                                    {["usb", "ip", "serial"].map((connName) => (
                                        <div key={connName} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`conn-${connName}`}
                                                checked={connectionTypes.includes(connName)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) setConnectionTypes([...connectionTypes, connName]);
                                                    else setConnectionTypes(connectionTypes.filter((c) => c !== connName));
                                                }}
                                            />
                                            <Label htmlFor={`conn-${connName}`}>{connName.toUpperCase()}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Python Versions</Label>
                                <Input
                                    value={pythonVersions}
                                    onChange={(e) => setPythonVersions(e.target.value)}
                                    placeholder="e.g. 3.9, 3.10, 3.11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Device Association</Label>
                                <Popover open={openDeviceCombobox} onOpenChange={setOpenDeviceCombobox}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openDeviceCombobox}
                                            className="w-full justify-between"
                                        >
                                            {selectedDeviceId === "agnostic"
                                                ? "Device Agnostic"
                                                : devices.find((device) => device.id.toString() === selectedDeviceId)?.name || "Select device..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0 z-[100]" side="bottom" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search device..." />
                                            <CommandList>
                                                <CommandEmpty>
                                                    No device found.{" "}
                                                    <a
                                                        href="/hub/contribute?type=device"
                                                        target="_blank"
                                                        className="text-primary hover:underline font-medium"
                                                    >
                                                        Add new device
                                                    </a>
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    <CommandItem
                                                        value="agnostic"
                                                        onSelect={() => {
                                                            setSelectedDeviceId("agnostic");
                                                            setOpenDeviceCombobox(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedDeviceId === "agnostic" ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        Device Agnostic
                                                    </CommandItem>
                                                    {devices.map((device) => (
                                                        <CommandItem
                                                            key={device.id}
                                                            value={device.id.toString()}
                                                            keywords={[device.name, device.vendor]}
                                                            onSelect={() => {
                                                                setSelectedDeviceId(device.id.toString());
                                                                setOpenDeviceCombobox(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedDeviceId === device.id.toString() ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {device.name} ({device.vendor})
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label>Start Command (optional)</Label>
                            <p className="text-sm text-muted-foreground">
                                Command to run the module. You can use init args as variables, e.g. <code className="bg-muted px-1 rounded">python -m my_module --port {"{port}"}</code>
                            </p>
                            <Input
                                value={startCommand}
                                onChange={(e) => setStartCommand(e.target.value)}
                                placeholder="e.g. python -m my_module start"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label>Description (optional)</Label>
                            <p className="text-sm text-muted-foreground">
                                Provide a brief description of what this module does and its key features.
                            </p>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. A Python driver for controlling XYZ hardware via USB..."
                                rows={3}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label>Initialization Arguments</Label>
                            <div className="border p-4 rounded-md space-y-4 bg-card">
                                <div className="space-y-2">
                                    {initArgs.map((arg, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-muted/50 p-2 rounded">
                                            <span className="font-mono text-sm flex-1">{arg.name}</span>
                                            <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border">{arg.type}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveArg(index)}
                                                className="h-6 w-6 p-0 text-destructive"
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                    {initArgs.length === 0 && (
                                        <p className="text-sm text-muted-foreground italic">No arguments defined.</p>
                                    )}
                                </div>
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-xs">Name</Label>
                                        <Input
                                            value={newArgName}
                                            onChange={(e) => setNewArgName(e.target.value)}
                                            placeholder="e.g. port"
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="w-24 space-y-1">
                                        <Label className="text-xs">Type</Label>
                                        <Select value={newArgType} onValueChange={(v: any) => setNewArgType(v)}>
                                            <SelectTrigger className="h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="str">String</SelectItem>
                                                <SelectItem value="int">Integer</SelectItem>
                                                <SelectItem value="float">Float</SelectItem>
                                                <SelectItem value="bool">Boolean</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="button" onClick={handleAddArg} size="sm" className="h-8">
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex flex-wrap gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="original-dev"
                                    checked={isOriginalDeveloper}
                                    onCheckedChange={(c) => setIsOriginalDeveloper(!!c)}
                                />
                                <Label htmlFor="original-dev">I am the original developer of this module</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="tested"
                                    checked={isTested}
                                    onCheckedChange={(c) => setIsTested(!!c)}
                                />
                                <Label htmlFor="tested">Tested with IvoryOS</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="unlisted"
                                    checked={isUnlisted}
                                    onCheckedChange={(c) => setIsUnlisted(!!c)}
                                />
                                <Label htmlFor="unlisted">Unlisted (Private)</Label>
                            </div>
                        </div>
                    </div>
                )}

                {type === "device" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Device Name</Label>
                            <Input
                                required
                                value={deviceName}
                                onChange={(e) => setDeviceName(e.target.value)}
                                placeholder="e.g. Super Stirrer 3000"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Vendor</Label>
                            <Input
                                required
                                value={vendor}
                                onChange={(e) => setVendor(e.target.value)}
                                placeholder="e.g. LabCorp"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between"
                                    >
                                        {category || "Select or create a category"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search or create category..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                <div className="p-2">
                                                    <p className="text-sm text-muted-foreground mb-2">No category found.</p>
                                                </div>
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {[
                                                    "Liquid Handler",
                                                    "Solid Handling & Weighing",
                                                    "Reactor Control",
                                                    "Environment Control",
                                                    "Workup & Sample Processing",
                                                    "Analytical Instruments",
                                                    "Storage",
                                                    "Camera/Vision",
                                                    "Custom Electronics",
                                                    "Other"
                                                ].map((cat) => (
                                                    <CommandItem
                                                        key={cat}
                                                        value={cat}
                                                        onSelect={(currentValue) => {
                                                            setCategory(currentValue === category ? "" : currentValue);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                category === cat ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {cat}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <Input
                                placeholder="Or type a new category name..."
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mt-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Official URL (Vendor Link)</Label>
                            <Input
                                type="url"
                                value={officialUrl}
                                onChange={(e) => setOfficialUrl(e.target.value)}
                                placeholder="https://example.com/product"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label>Device Image</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setDeviceImage(e.target.files?.[0] || null)}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label>Connection Guide</Label>
                            <Textarea
                                placeholder="Instructions on how to find the correct connection method (e.g. port, IP address)..."
                                className="h-24"
                                id="connection-guide"
                            />
                        </div>
                    </div>
                )}

                {type === "template" && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Template Name</Label>
                            <Input
                                required
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                placeholder="e.g. PCR Protocol A"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={templateDescription}
                                onChange={(e) => setTemplateDescription(e.target.value)}
                                placeholder="Describe what this template does..."
                                className="h-24"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Workflow JSON</Label>
                            <div className="flex flex-col gap-2">
                                <Input
                                    type="file"
                                    accept=".json"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                try {
                                                    const content = event.target?.result as string;
                                                    const parsed = JSON.parse(content);
                                                    setTemplateJson(JSON.stringify(parsed, null, 2));

                                                    // Auto-populate description if present
                                                    if (parsed.description && typeof parsed.description === 'string') {
                                                        setTemplateDescription(parsed.description);
                                                    }
                                                } catch (err) {
                                                    toast.error("Invalid JSON file");
                                                }
                                            };
                                            reader.readAsText(file);
                                        }
                                    }}
                                />
                                <Textarea
                                    required
                                    value={templateJson}
                                    onChange={(e) => setTemplateJson(e.target.value)}
                                    placeholder='Paste your JSON here or upload a file...'
                                    className="font-mono text-xs h-40"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Associated Modules</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between h-auto min-h-[40px]"
                                    >
                                        {selectedModuleIds.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {selectedModuleIds.map((id) => {
                                                    const module = availableModules.find(m => m.id.toString() === id);
                                                    return (
                                                        <span key={id} className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md text-xs flex items-center gap-1">
                                                            {module?.name || id}
                                                            <span
                                                                className="cursor-pointer hover:text-destructive"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedModuleIds(selectedModuleIds.filter(mid => mid !== id));
                                                                }}
                                                            >
                                                                ×
                                                            </span>
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            "Select modules..."
                                        )}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search modules..." />
                                        <CommandList>
                                            <CommandEmpty>No module found.</CommandEmpty>
                                            <CommandGroup className="max-h-[200px] overflow-y-auto">
                                                {availableModules.map((module) => (
                                                    <CommandItem
                                                        key={module.id}
                                                        value={module.name}
                                                        keywords={[module.name, module.pip_name]}
                                                        onSelect={() => {
                                                            if (selectedModuleIds.includes(module.id.toString())) {
                                                                setSelectedModuleIds(selectedModuleIds.filter(id => id !== module.id.toString()));
                                                            } else {
                                                                setSelectedModuleIds([...selectedModuleIds, module.id.toString()]);
                                                            }
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedModuleIds.includes(module.id.toString()) ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {module.name} ({module.pip_name})
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                )}

                {type === "post" && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                required
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                placeholder="e.g. My Cool Setup"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={postDescription}
                                onChange={(e) => setPostDescription(e.target.value)}
                                placeholder="Tell us about your setup..."
                                className="h-24"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Image</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPostImage(e.target.files?.[0] || null)}
                                required={!editId}
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                        {editId && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={loading || isDeleting}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-4">
                        {editId && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={loading || isDeleting}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" disabled={loading || isDeleting}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {editId ? "Updating..." : "Submitting..."}
                                </>
                            ) : (
                                editId ? "Update" : "Submit"
                            )}
                        </Button>
                    </div>
                </div>
            </form>

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this {type}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
