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
      ingredients: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
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
          servings: number
          times_done?: number
          type: Database["public"]["Enums"]["recipe_type"]
          updated_at?: string
          user_id: string
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
          name: string
          quantity?: number | null
          unit?: Database["public"]["Enums"]["unit_type"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["shopping_item_category"]
          checked?: boolean
          created_at?: string
          id?: string
          name?: string
          quantity?: number | null
          unit?: Database["public"]["Enums"]["unit_type"] | null
          updated_at?: string
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
      recipe_type: "starter" | "main" | "side" | "dessert" | "sauce"
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
      recipe_type: ["starter", "main", "side", "dessert", "sauce"],
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
