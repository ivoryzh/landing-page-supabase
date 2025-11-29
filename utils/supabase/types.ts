export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
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
                    post_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    post_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    post_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "likes_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "gallery_posts"
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
            profiles: {
                Row: {
                    avatar_url: string | null
                    full_name: string | null
                    id: string
                    lab_info: string | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    full_name?: string | null
                    id: string
                    lab_info?: string | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    full_name?: string | null
                    id?: string
                    lab_info?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
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
