export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id: string;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          title?: string;
        };
        Relationships: [];
      };
      clubs: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_public: boolean;
          name: string;
          owner_user_id: string | null;
          region: string;
          city: string;
          sport_id: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_public?: boolean;
          name: string;
          owner_user_id?: string | null;
          region: string;
          city: string;
          sport_id?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_public?: boolean;
          name?: string;
          owner_user_id?: string | null;
          region?: string;
          city?: string;
          sport_id?: string | null;
        };
        Relationships: [];
      };
      club_members: {
        Row: {
          club_id: string;
          joined_at: string;
          role: string;
          user_id: string;
        };
        Insert: {
          club_id: string;
          joined_at?: string;
          role?: string;
          user_id: string;
        };
        Update: {
          club_id?: string;
          joined_at?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      event_registrations: {
        Row: {
          created_at: string;
          event_id: string;
          id: string;
          registration_type: "participant" | "spectator";
          user_id: string;
        };
        Insert: {
          created_at?: string;
          event_id: string;
          id?: string;
          registration_type: "participant" | "spectator";
          user_id: string;
        };
        Update: {
          created_at?: string;
          event_id?: string;
          id?: string;
          registration_type?: "participant" | "spectator";
          user_id?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          capacity: number;
          city: string;
          club_id: string | null;
          created_at: string;
          description: string | null;
          entry_fee_text: string | null;
          event_type: "community" | "club" | "showcase";
          id: string;
          organizer_user_id: string;
          region: string;
          sport_id: string;
          starts_at: string;
          status: "draft" | "published" | "completed" | "cancelled";
          title: string;
          venue: string;
        };
        Insert: {
          capacity?: number;
          city: string;
          club_id?: string | null;
          created_at?: string;
          description?: string | null;
          entry_fee_text?: string | null;
          event_type: "community" | "club" | "showcase";
          id?: string;
          organizer_user_id: string;
          region: string;
          sport_id: string;
          starts_at: string;
          status?: "draft" | "published" | "completed" | "cancelled";
          title: string;
          venue: string;
        };
        Update: {
          capacity?: number;
          city?: string;
          club_id?: string | null;
          created_at?: string;
          description?: string | null;
          entry_fee_text?: string | null;
          event_type?: "community" | "club" | "showcase";
          id?: string;
          organizer_user_id?: string;
          region?: string;
          sport_id?: string;
          starts_at?: string;
          status?: "draft" | "published" | "completed" | "cancelled";
          title?: string;
          venue?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          author_user_id: string;
          body: string;
          created_at: string;
          id: string;
          sport_id: string | null;
        };
        Insert: {
          author_user_id: string;
          body: string;
          created_at?: string;
          id?: string;
          sport_id?: string | null;
        };
        Update: {
          author_user_id?: string;
          body?: string;
          created_at?: string;
          id?: string;
          sport_id?: string | null;
        };
        Relationships: [];
      };
      profile_sports: {
        Row: {
          profile_id: string;
          sport_id: string;
        };
        Insert: {
          profile_id: string;
          sport_id: string;
        };
        Update: {
          profile_id?: string;
          sport_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          full_name: string;
          id: string;
          is_public: boolean;
          region: string | null;
          roles: string[];
          updated_at: string;
          username: string;
          xp_total: number;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          full_name: string;
          id: string;
          is_public?: boolean;
          region?: string | null;
          roles?: string[];
          updated_at?: string;
          username: string;
          xp_total?: number;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          full_name?: string;
          id?: string;
          is_public?: boolean;
          region?: string | null;
          roles?: string[];
          updated_at?: string;
          username?: string;
          xp_total?: number;
        };
        Relationships: [];
      };
      ratings: {
        Row: {
          author_user_id: string;
          comment: string | null;
          created_at: string;
          event_id: string;
          id: string;
          score: number;
          target_user_id: string | null;
        };
        Insert: {
          author_user_id: string;
          comment?: string | null;
          created_at?: string;
          event_id: string;
          id?: string;
          score: number;
          target_user_id?: string | null;
        };
        Update: {
          author_user_id?: string;
          comment?: string | null;
          created_at?: string;
          event_id?: string;
          id?: string;
          score?: number;
          target_user_id?: string | null;
        };
        Relationships: [];
      };
      sports: {
        Row: {
          category: string;
          emoji: string;
          id: string;
          name: string;
        };
        Insert: {
          category: string;
          emoji: string;
          id: string;
          name: string;
        };
        Update: {
          category?: string;
          emoji?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          achievement_id: string;
          awarded_at: string;
          user_id: string;
        };
        Insert: {
          achievement_id: string;
          awarded_at?: string;
          user_id: string;
        };
        Update: {
          achievement_id?: string;
          awarded_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      xp_ledger: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          reason: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          reason: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          reason?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
