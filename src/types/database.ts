/**
 * Replace with generated types:
 * npx supabase gen types typescript --linked > src/types/database.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "customer" | "admin";
          locale: string;
          display_name: string | null;
          preferred_currency: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          status: "draft" | "active" | "archived";
          delivery_mode: "auto" | "manual";
          price_cents: number;
          compare_at_cents: number | null;
          sort_order: number;
          is_featured: boolean;
        };
      };
      product_translations: {
        Row: {
          id: string;
          product_id: string;
          locale: string;
          name: string;
          short_description: string | null;
          slug: string;
        };
      };
      categories: {
        Row: {
          id: string;
          sort_order: number;
          is_active: boolean;
          icon_url: string | null;
        };
      };
      category_translations: {
        Row: {
          id: string;
          category_id: string;
          locale: string;
          name: string;
          slug: string;
          description: string | null;
          meta_title: string | null;
          meta_description: string | null;
        };
      };
      product_fields: {
        Row: {
          id: string;
          product_id: string;
          field_key: string;
          field_type: string;
          label: Json;
          help_text: Json | null;
          required: boolean;
          sort_order: number;
          options: Json | null;
          is_sensitive: boolean;
        };
      };
      product_media: {
        Row: {
          id: string;
          product_id: string;
          media_type: "image" | "video";
          storage_path: string;
          alt: string | null;
          sort_order: number;
        };
      };
      site_settings: {
        Row: {
          id: string;
          payment_instructions_en: string | null;
          payment_instructions_ar: string | null;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          coupon_type: "percent" | "fixed";
          value: number;
          min_order_cents: number | null;
          max_discount_cents: number | null;
          usage_limit: number | null;
          usage_count: number;
          starts_at: string | null;
          expires_at: string | null;
          is_active: boolean;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          guest_email: string | null;
          status: string;
          subtotal_cents: number;
          discount_cents: number;
          total_cents: number;
          currency: string;
          locale: string;
          submitted_at: string;
        };
        Insert: {
          order_number: string;
          user_id?: string | null;
          guest_email?: string | null;
          status: string;
          subtotal_cents: number;
          discount_cents?: number;
          total_cents: number;
          currency?: string;
          coupon_id?: string | null;
          coupon_code_snapshot?: string | null;
          locale: string;
          customer_note?: string | null;
          terms_accepted_at?: string;
        };
        Update: Record<string, unknown>;
        Relationships: [];
      };
      order_items: {
        Row: { id: string; order_id: string; product_id: string };
        Insert: {
          order_id: string;
          product_id: string;
          product_name_snapshot: Json;
          unit_price_cents: number;
          quantity: number;
          delivery_mode: string;
        };
        Update: Record<string, unknown>;
      };
      order_field_values: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      order_status_history: {
        Row: Record<string, unknown>;
        Insert: {
          order_id: string;
          from_status?: string | null;
          to_status: string;
          note?: string | null;
        };
        Update: Record<string, unknown>;
      };
      guest_order_access: {
        Row: Record<string, unknown>;
        Insert: {
          order_id: string;
          token_hash: string;
          expires_at: string;
        };
        Update: Record<string, unknown>;
      };
      delivery_inventory: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
