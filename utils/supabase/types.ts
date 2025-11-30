// @ts-nocheck
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "13.0.5"
    }
    public: {
        Tables: {
            devices: {
                Row: {
                    category: string | null
                    connection_guide: string | null
                    created_at: string
                    id: number
                    image_url: string | null
                    name: string
                    official_url: string | null
                    updated_at: string | null
                    vendor: string
                }
                Insert: {
                    category?: string | null
                    connection_guide?: string | null
                    created_at?: string
                    id?: number
                    image_url?: string | null
                    name: string
                    official_url?: string | null
                    updated_at?: string | null
                    vendor: string
                }
                Update: {
                    category?: string | null
                    connection_guide?: string | null
                    created_at?: string
                    id?: number
                    image_url?: string | null
                    name?: string
                    official_url?: string | null
                    updated_at?: string | null
                    vendor?: string
                }
                Relationships: []
            }
            gallery_posts: {
                Row: {
                    created_at: string
                    description: string | null
                    id: string
                    image_url: string
                    title: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    image_url: string
                    title: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    image_url?: string
                    title?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "gallery_posts_profiles_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            likes: {
                Row: {
                    created_at: string
                    id: string
                    module_id: number | null
                    post_id: string | null
                    template_id: number | null
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    module_id?: number | null
                    post_id?: string | null
                    template_id?: number | null
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    module_id?: number | null
                    post_id?: string | null
                    template_id?: number | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "likes_module_id_fkey"
                        columns: ["module_id"]
                        isOneToOne: false
                        referencedRelation: "modules"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "likes_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "gallery_posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "likes_template_id_fkey"
                        columns: ["template_id"]
                        isOneToOne: false
                        referencedRelation: "templates"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "likes_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            modules: {
                Row: {
                    connection: string[] | null
                    contributor_id: string | null
                    created_at: string
                    description: string | null
                    device_id: number | null
                    difficulty: string | null
                    download_count: number | null
                    icon_emoji: string | null
                    id: number
                    init_args: Json | null
                    is_original_developer: boolean | null
                    is_tested_with_ivoryos: boolean | null
                    is_unlisted: boolean | null
                    module_name: string
                    module_path: string | null
                    name: string
                    os: string[] | null
                    pip_name: string
                    python_versions: string[] | null
                    start_command: string | null
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    connection?: string[] | null
                    contributor_id?: string | null
                    created_at?: string
                    description?: string | null
                    device_id?: number | null
                    difficulty?: string | null
                    download_count?: number | null
                    icon_emoji?: string | null
                    id?: number
                    init_args?: Json | null
                    is_original_developer?: boolean | null
                    is_tested_with_ivoryos?: boolean | null
                    is_unlisted?: boolean | null
                    module_name: string
                    module_path?: string | null
                    name: string
                    os?: string[] | null
                    pip_name: string
                    python_versions?: string[] | null
                    start_command?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    connection?: string[] | null
                    contributor_id?: string | null
                    created_at?: string
                    description?: string | null
                    device_id?: number | null
                    difficulty?: string | null
                    download_count?: number | null
                    icon_emoji?: string | null
                    id?: number
                    init_args?: Json | null
                    is_original_developer?: boolean | null
                    is_tested_with_ivoryos?: boolean | null
                    is_unlisted?: boolean | null
                    module_name?: string
                    module_path?: string | null
                    name?: string
                    os?: string[] | null
                    pip_name?: string
                    python_versions?: string[] | null
                    start_command?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "modules_contributor_id_fkey"
                        columns: ["contributor_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "modules_device_id_fkey"
                        columns: ["device_id"]
                        isOneToOne: false
                        referencedRelation: "devices"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string
                    full_name: string | null
                    id: string
                    lab_info: string | null
                    updated_at: string | null
                    username: string | null
                    website: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string
                    full_name?: string | null
                    id: string
                    lab_info?: string | null
                    updated_at?: string | null
                    username?: string | null
                    website?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string
                    full_name?: string | null
                    id?: string
                    lab_info?: string | null
                    updated_at?: string | null
                    username?: string | null
                    website?: string | null
                }
                Relationships: []
            }
            templates: {
                Row: {
                    contributor_id: string | null
                    created_at: string
                    description: string | null
                    download_count: number | null
                    id: number
                    module_ids: number[] | null
                    title: string
                    updated_at: string | null
                    workflow_json: Json
                }
                Insert: {
                    contributor_id?: string | null
                    created_at?: string
                    description?: string | null
                    download_count?: number | null
                    id?: number
                    module_ids?: number[] | null
                    title: string
                    updated_at?: string | null
                    workflow_json: Json
                }
                Update: {
                    contributor_id?: string | null
                    created_at?: string
                    description?: string | null
                    download_count?: number | null
                    id?: number
                    module_ids?: number[] | null
                    title?: string
                    updated_at?: string | null
                    workflow_json?: Json
                }
                Relationships: [
                    {
                        foreignKeyName: "templates_contributor_id_fkey"
                        columns: ["contributor_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
