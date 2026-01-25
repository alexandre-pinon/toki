-- Meals table
CREATE TABLE IF NOT EXISTS "public"."meals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "recipe_id" "uuid" NOT NULL,
    "date" "date" NOT NULL,
    "servings" smallint NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    CONSTRAINT "meal_servings_check" CHECK (("servings" > 0))
);

-- Primary key
ALTER TABLE ONLY "public"."meals"
    ADD CONSTRAINT "meal_pkey" PRIMARY KEY ("id");

-- Foreign keys
ALTER TABLE ONLY "public"."meals"
    ADD CONSTRAINT "meal_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."meals"
    ADD CONSTRAINT "meal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

-- Owner
ALTER TABLE "public"."meals" OWNER TO "postgres";
