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
      invite_codes: {
        Row: {
          code: string
          created_at: string
          current_uses: number | null
          id: string
          max_uses: number
          status: Database["public"]["Enums"]["invite_code_status"] | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number | null
          id?: string
          max_uses: number
          status?: Database["public"]["Enums"]["invite_code_status"] | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number | null
          id?: string
          max_uses?: number
          status?: Database["public"]["Enums"]["invite_code_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      search_history: {
        Row: {
          bulk_search_urls: string[] | null
          created_at: string
          id: string
          search_query: string
          search_type: string
          user_id: string
        }
        Insert: {
          bulk_search_urls?: string[] | null
          created_at?: string
          id?: string
          search_query: string
          search_type: string
          user_id: string
        }
        Update: {
          bulk_search_urls?: string[] | null
          created_at?: string
          id?: string
          search_query?: string
          search_type?: string
          user_id?: string
        }
        Relationships: []
      }
      search_results: {
        Row: {
          created_at: string
          id: string
          results: Json
          search_history_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          results: Json
          search_history_id: string
        }
        Update: {
          created_at?: string
          id?: string
          results?: Json
          search_history_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_results_search_history_id_fkey"
            columns: ["search_history_id"]
            isOneToOne: false
            referencedRelation: "search_history"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_logs: {
        Row: {
          created_at: string
          details: Json | null
          event: Database["public"]["Enums"]["subscription_event"]
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event: Database["public"]["Enums"]["subscription_event"]
          id?: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          event?: Database["public"]["Enums"]["subscription_event"]
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_requests: {
        Row: {
          created_at: string
          id: string
          last_reset_at: string | null
          period_end: string
          period_start: string
          request_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_reset_at?: string | null
          period_end: string
          period_start: string
          request_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_reset_at?: string | null
          period_end?: string
          period_start?: string
          request_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_subscription_tier: {
        Args: {
          user_id: string
        }
        Returns: Database["public"]["Enums"]["subscription_tier"]
      }
      validate_invite_code: {
        Args: {
          p_code: string
        }
        Returns: boolean
      }
    }
    Enums: {
      invite_code_status: "active" | "expired"
      subscription_event:
        | "subscription_check"
        | "subscription_created"
        | "subscription_updated"
        | "subscription_cancelled"
      subscription_tier: "free" | "premium" | "ultra"
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
