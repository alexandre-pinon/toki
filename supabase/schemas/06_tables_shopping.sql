-- Shopping items table
CREATE TABLE IF NOT EXISTS "public"."shopping_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "quantity" numeric,
    "checked" boolean DEFAULT false NOT NULL,
    "category" "public"."shopping_item_category" NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "unit" "public"."unit_type",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "meal_id" "uuid",
    "meal_date" "date",
    "recipe_id" "uuid",
    "ingredient_id" "uuid",
    CONSTRAINT "shopping_items_quantity_check" CHECK (("quantity" > (0)::numeric))
);

-- Primary key
ALTER TABLE ONLY "public"."shopping_items"
    ADD CONSTRAINT "shopping_items_pkey" PRIMARY KEY ("id");

-- Foreign keys
ALTER TABLE ONLY "public"."shopping_items"
    ADD CONSTRAINT "shopping_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."shopping_items"
    ADD CONSTRAINT "shopping_items_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."shopping_items"
    ADD CONSTRAINT "shopping_items_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."shopping_items"
    ADD CONSTRAINT "shopping_items_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON UPDATE CASCADE ON DELETE CASCADE;

-- Owner
ALTER TABLE "public"."shopping_items" OWNER TO "postgres";
