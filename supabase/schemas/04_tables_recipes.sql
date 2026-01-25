-- Recipes table
CREATE TABLE IF NOT EXISTS "public"."recipes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "type" "public"."recipe_type" NOT NULL,
    "preparation_time" bigint,
    "cooking_time" bigint,
    "servings" smallint NOT NULL,
    "instructions" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "image_url" "text",
    "times_done" bigint DEFAULT '0'::bigint NOT NULL,
    "last_time_done" "date",
    "rest_time" bigint,
    CONSTRAINT "recipes_servings_check" CHECK (("servings" > 0))
);

-- Primary key
ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "recipes_pkey" PRIMARY KEY ("id");

-- Foreign key to auth.users
ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

-- Owner
ALTER TABLE "public"."recipes" OWNER TO "postgres";

-- Recipes to ingredients junction table
CREATE TABLE IF NOT EXISTS "public"."recipes_to_ingredients" (
    "recipe_id" "uuid" NOT NULL,
    "ingredient_id" "uuid" NOT NULL,
    "quantity" numeric,
    "unit" "public"."unit_type",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    CONSTRAINT "recipes_to_ingredients_quantity_check" CHECK (("quantity" > (0)::numeric))
);

-- Primary key
ALTER TABLE ONLY "public"."recipes_to_ingredients"
    ADD CONSTRAINT "recipes_to_ingredients_pkey" PRIMARY KEY ("recipe_id", "ingredient_id");

-- Foreign keys
ALTER TABLE ONLY "public"."recipes_to_ingredients"
    ADD CONSTRAINT "recipes_to_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."recipes_to_ingredients"
    ADD CONSTRAINT "recipes_to_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON UPDATE CASCADE ON DELETE CASCADE;

-- Owner
ALTER TABLE "public"."recipes_to_ingredients" OWNER TO "postgres";
