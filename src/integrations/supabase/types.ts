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
      applications: {
        Row: {
          cover_letter: string
          created_at: string
          freelancer_id: string
          id: string
          job_id: string
          status: string | null
        }
        Insert: {
          cover_letter: string
          created_at?: string
          freelancer_id: string
          id?: string
          job_id: string
          status?: string | null
        }
        Update: {
          cover_letter?: string
          created_at?: string
          freelancer_id?: string
          id?: string
          job_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          credential_url: string | null
          expiry_date: string | null
          freelancer_id: string
          id: string
          issue_date: string
          issuer: string
          name: string
        }
        Insert: {
          created_at?: string
          credential_url?: string | null
          expiry_date?: string | null
          freelancer_id: string
          id?: string
          issue_date: string
          issuer: string
          name: string
        }
        Update: {
          created_at?: string
          credential_url?: string | null
          expiry_date?: string | null
          freelancer_id?: string
          id?: string
          issue_date?: string
          issuer?: string
          name?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          contract_details: Json | null
          has_contract: boolean | null
          id: string
          job_id: string | null
          last_message_at: string
          participant1_id: string
          participant2_id: string
        }
        Insert: {
          contract_details?: Json | null
          has_contract?: boolean | null
          id?: string
          job_id?: string | null
          last_message_at?: string
          participant1_id: string
          participant2_id: string
        }
        Update: {
          contract_details?: Json | null
          has_contract?: boolean | null
          id?: string
          job_id?: string | null
          last_message_at?: string
          participant1_id?: string
          participant2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant1_id_fkey"
            columns: ["participant1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant2_id_fkey"
            columns: ["participant2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          current: boolean
          description: string | null
          end_date: string | null
          freelancer_id: string
          id: string
          start_date: string
          title: string
        }
        Insert: {
          company: string
          created_at?: string
          current?: boolean
          description?: string | null
          end_date?: string | null
          freelancer_id: string
          id?: string
          start_date: string
          title: string
        }
        Update: {
          company?: string
          created_at?: string
          current?: boolean
          description?: string | null
          end_date?: string | null
          freelancer_id?: string
          id?: string
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          budget: number
          cover_image: string | null
          created_at: string
          deadline: string
          description: string
          id: string
          provider_id: string
          skills: string[] | null
          status: string | null
          title: string
        }
        Insert: {
          budget: number
          cover_image?: string | null
          created_at?: string
          deadline?: string
          description: string
          id?: string
          provider_id: string
          skills?: string[] | null
          status?: string | null
          title: string
        }
        Update: {
          budget?: number
          cover_image?: string | null
          created_at?: string
          deadline?: string
          description?: string
          id?: string
          provider_id?: string
          skills?: string[] | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          related_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          related_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          related_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          available_until: string | null
          bio: string | null
          cover_picture: string | null
          created_at: string
          email: string
          id: string
          name: string
          profile_picture: string | null
          rating: number | null
          role: string
          skills: string[] | null
          total_ratings: number | null
          verified: boolean | null
        }
        Insert: {
          available_until?: string | null
          bio?: string | null
          cover_picture?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          profile_picture?: string | null
          rating?: number | null
          role: string
          skills?: string[] | null
          total_ratings?: number | null
          verified?: boolean | null
        }
        Update: {
          available_until?: string | null
          bio?: string | null
          cover_picture?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          profile_picture?: string | null
          rating?: number | null
          role?: string
          skills?: string[] | null
          total_ratings?: number | null
          verified?: boolean | null
        }
        Relationships: []
      }
      project_checklists: {
        Row: {
          created_at: string | null
          done_items: Json | null
          id: string
          in_progress_items: Json | null
          project_id: string
          todo_items: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          done_items?: Json | null
          id?: string
          in_progress_items?: Json | null
          project_id: string
          todo_items?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          done_items?: Json | null
          id?: string
          in_progress_items?: Json | null
          project_id?: string
          todo_items?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_checklists_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      project_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          project_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          project_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          project_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_whiteboards: {
        Row: {
          canvas_json: string
          created_at: string | null
          id: string
          project_id: string
          updated_at: string | null
        }
        Insert: {
          canvas_json?: string
          created_at?: string | null
          id?: string
          project_id: string
          updated_at?: string | null
        }
        Update: {
          canvas_json?: string
          created_at?: string | null
          id?: string
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_whiteboards_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string
          freelancer_id: string
          id: string
          images: string[] | null
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          freelancer_id: string
          id?: string
          images?: string[] | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          freelancer_id?: string
          id?: string
          images?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_requests: {
        Row: {
          created_at: string
          documents: string[] | null
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          documents?: string[] | null
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          documents?: string[] | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_user_id_fkey"
            columns: ["user_id"]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
