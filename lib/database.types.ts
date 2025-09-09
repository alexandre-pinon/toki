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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ingredients: {
        Row: {
          category: Database["public"]["Enums"]["shopping_item_category"] | null
          created_at: string
          id: string
          name: string
          name_normalized: string
          updated_at: string
        }
        Insert: {
          category?:
            | Database["public"]["Enums"]["shopping_item_category"]
            | null
          created_at?: string
          id?: string
          name: string
          name_normalized: string
          updated_at?: string
        }
        Update: {
          category?:
            | Database["public"]["Enums"]["shopping_item_category"]
            | null
          created_at?: string
          id?: string
          name?: string
          name_normalized?: string
          updated_at?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          created_at: string
          date: string
          id: string
          recipe_id: string
          servings: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          recipe_id: string
          servings: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          recipe_id?: string
          servings?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cooking_time: number | null
          created_at: string
          id: string
          image_url: string | null
          instructions: Json | null
          last_time_done: string | null
          name: string
          preparation_time: number | null
          rest_time: number | null
          servings: number
          times_done: number
          type: Database["public"]["Enums"]["recipe_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cooking_time?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          instructions?: Json | null
          last_time_done?: string | null
          name: string
          preparation_time?: number | null
          rest_time?: number | null
          servings: number
          times_done?: number
          type: Database["public"]["Enums"]["recipe_type"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          cooking_time?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          instructions?: Json | null
          last_time_done?: string | null
          name?: string
          preparation_time?: number | null
          rest_time?: number | null
          servings?: number
          times_done?: number
          type?: Database["public"]["Enums"]["recipe_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recipes_to_ingredients: {
        Row: {
          ingredient_id: string
          quantity: number | null
          recipe_id: string
          unit: Database["public"]["Enums"]["unit_type"] | null
        }
        Insert: {
          ingredient_id: string
          quantity?: number | null
          recipe_id: string
          unit?: Database["public"]["Enums"]["unit_type"] | null
        }
        Update: {
          ingredient_id?: string
          quantity?: number | null
          recipe_id?: string
          unit?: Database["public"]["Enums"]["unit_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_to_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_to_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_items: {
        Row: {
          category: Database["public"]["Enums"]["shopping_item_category"]
          checked: boolean
          created_at: string
          id: string
          meal_date: string | null
          meal_id: string | null
          name: string
          quantity: number | null
          unit: Database["public"]["Enums"]["unit_type"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["shopping_item_category"]
          checked?: boolean
          created_at?: string
          id?: string
          meal_date?: string | null
          meal_id?: string | null
          name: string
          quantity?: number | null
          unit?: Database["public"]["Enums"]["unit_type"] | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["shopping_item_category"]
          checked?: boolean
          created_at?: string
          id?: string
          meal_date?: string | null
          meal_id?: string | null
          name?: string
          quantity?: number | null
          unit?: Database["public"]["Enums"]["unit_type"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      upcoming_meals_shopping_items: {
        Row: {
          category: Database["public"]["Enums"]["shopping_item_category"] | null
          checked: boolean | null
          ids: string[] | null
          meal_date: string | null
          name: string | null
          quantity: number | null
          unit: Database["public"]["Enums"]["unit_type"] | null
          user_id: string | null
          week_day: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cuisine_type:
        | "chinese"
        | "japanese"
        | "korean"
        | "vietnamese"
        | "thai"
        | "indian"
        | "indonesian"
        | "malaysian"
        | "filipino"
        | "singaporean"
        | "taiwanese"
        | "tibetan"
        | "nepalese"
        | "italian"
        | "french"
        | "spanish"
        | "greek"
        | "german"
        | "british"
        | "irish"
        | "portuguese"
        | "hungarian"
        | "polish"
        | "russian"
        | "swedish"
        | "norwegian"
        | "danish"
        | "dutch"
        | "belgian"
        | "swiss"
        | "austrian"
        | "turkish"
        | "lebanese"
        | "iranian"
        | "israeli"
        | "moroccan"
        | "egyptian"
        | "syrian"
        | "iraqi"
        | "saudi"
        | "american"
        | "mexican"
        | "brazilian"
        | "peruvian"
        | "argentinian"
        | "colombian"
        | "venezuelan"
        | "caribbean"
        | "cuban"
        | "cajun"
        | "creole"
        | "canadian"
        | "ethiopian"
        | "nigerian"
        | "south_african"
        | "kenyan"
        | "ghanaian"
        | "senegalese"
        | "tanzanian"
        | "other"
      meal_type: "breakfast" | "lunch" | "dinner" | "snack"
      recipe_type: "starter" | "main" | "side" | "dessert" | "sauce" | "drink"
      shopping_item_category:
        | "fruits_vegetables"
        | "meat"
        | "fish"
        | "condiment"
        | "cereals"
        | "dairy_products"
        | "desserts"
        | "other"
      unit_type:
        | "ml"
        | "cl"
        | "l"
        | "g"
        | "kg"
        | "tsp"
        | "tbsp"
        | "cup"
        | "piece"
        | "pinch"
        | "bunch"
        | "clove"
        | "can"
        | "package"
        | "slice"
        | "to_taste"
      unit_type_family: "weight" | "volume" | "other"
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
    Enums: {
      cuisine_type: [
        "chinese",
        "japanese",
        "korean",
        "vietnamese",
        "thai",
        "indian",
        "indonesian",
        "malaysian",
        "filipino",
        "singaporean",
        "taiwanese",
        "tibetan",
        "nepalese",
        "italian",
        "french",
        "spanish",
        "greek",
        "german",
        "british",
        "irish",
        "portuguese",
        "hungarian",
        "polish",
        "russian",
        "swedish",
        "norwegian",
        "danish",
        "dutch",
        "belgian",
        "swiss",
        "austrian",
        "turkish",
        "lebanese",
        "iranian",
        "israeli",
        "moroccan",
        "egyptian",
        "syrian",
        "iraqi",
        "saudi",
        "american",
        "mexican",
        "brazilian",
        "peruvian",
        "argentinian",
        "colombian",
        "venezuelan",
        "caribbean",
        "cuban",
        "cajun",
        "creole",
        "canadian",
        "ethiopian",
        "nigerian",
        "south_african",
        "kenyan",
        "ghanaian",
        "senegalese",
        "tanzanian",
        "other",
      ],
      meal_type: ["breakfast", "lunch", "dinner", "snack"],
      recipe_type: ["starter", "main", "side", "dessert", "sauce", "drink"],
      shopping_item_category: [
        "fruits_vegetables",
        "meat",
        "fish",
        "condiment",
        "cereals",
        "dairy_products",
        "desserts",
        "other",
      ],
      unit_type: [
        "ml",
        "cl",
        "l",
        "g",
        "kg",
        "tsp",
        "tbsp",
        "cup",
        "piece",
        "pinch",
        "bunch",
        "clove",
        "can",
        "package",
        "slice",
        "to_taste",
      ],
      unit_type_family: ["weight", "volume", "other"],
    },
  },
} as const
