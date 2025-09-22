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
      creator_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          followers_count: number | null
          id: string
          is_verified: boolean | null
          tier: string | null
          total_earnings: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          followers_count?: number | null
          id?: string
          is_verified?: boolean | null
          tier?: string | null
          total_earnings?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          followers_count?: number | null
          id?: string
          is_verified?: boolean | null
          tier?: string | null
          total_earnings?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      creator_services: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          duration_minutes: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          price: number
          service_name: string
          service_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          duration_minutes?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          price: number
          service_name: string
          service_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          duration_minutes?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          price?: number
          service_name?: string
          service_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_creator_services_creator_id"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_analytics: {
        Row: {
          clicks: number | null
          comments: number | null
          created_at: string
          date: string
          engagement_rate: number | null
          followers_gained: number | null
          id: string
          impressions: number | null
          likes: number | null
          marketing_video_id: string
          saves: number | null
          shares: number | null
          views: number | null
        }
        Insert: {
          clicks?: number | null
          comments?: number | null
          created_at?: string
          date?: string
          engagement_rate?: number | null
          followers_gained?: number | null
          id?: string
          impressions?: number | null
          likes?: number | null
          marketing_video_id: string
          saves?: number | null
          shares?: number | null
          views?: number | null
        }
        Update: {
          clicks?: number | null
          comments?: number | null
          created_at?: string
          date?: string
          engagement_rate?: number | null
          followers_gained?: number | null
          id?: string
          impressions?: number | null
          likes?: number | null
          marketing_video_id?: string
          saves?: number | null
          shares?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_analytics_marketing_video_id_fkey"
            columns: ["marketing_video_id"]
            isOneToOne: false
            referencedRelation: "marketing_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_videos: {
        Row: {
          budget_used: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          package_type: string
          review_notes: string | null
          start_date: string | null
          status: string
          target_audience: string | null
          thumbnail_url: string | null
          title: string
          total_budget: number
          updated_at: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          budget_used?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          package_type: string
          review_notes?: string | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          thumbnail_url?: string | null
          title: string
          total_budget: number
          updated_at?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          budget_used?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          package_type?: string
          review_notes?: string | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          thumbnail_url?: string | null
          title?: string
          total_budget?: number
          updated_at?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          creator_id: string
          currency: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          service_id: string | null
          status: string | null
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          creator_id: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          service_id?: string | null
          status?: string | null
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          creator_id?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          service_id?: string | null
          status?: string | null
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_creator_id"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_transactions_service_id"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "creator_services"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics_summary: {
        Row: {
          id: string
          last_updated: string
          total_followers_gained: number | null
          total_likes: number | null
          total_marketing_videos: number | null
          total_spent: number | null
          total_views: number | null
          user_id: string
        }
        Insert: {
          id?: string
          last_updated?: string
          total_followers_gained?: number | null
          total_likes?: number | null
          total_marketing_videos?: number | null
          total_spent?: number | null
          total_views?: number | null
          user_id: string
        }
        Update: {
          id?: string
          last_updated?: string
          total_followers_gained?: number | null
          total_likes?: number | null
          total_marketing_videos?: number | null
          total_spent?: number | null
          total_views?: number | null
          user_id?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
