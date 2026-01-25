-- Ingredients table
CREATE TABLE IF NOT EXISTS "public"."ingredients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "category" "public"."shopping_item_category",
    "name_normalized" "text" NOT NULL
);

-- Primary key
ALTER TABLE ONLY "public"."ingredients"
    ADD CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id");

-- Owner
ALTER TABLE "public"."ingredients" OWNER TO "postgres";
