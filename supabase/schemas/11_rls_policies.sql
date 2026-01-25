-- Enable Row Level Security on all tables
ALTER TABLE "public"."ingredients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."meals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."recipes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."recipes_to_ingredients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."shopping_items" ENABLE ROW LEVEL SECURITY;

-- Ingredients policies (shared resource - all authenticated users can read/write)
CREATE POLICY "Enable insert for authenticated users only"
    ON "public"."ingredients"
    FOR INSERT
    TO "authenticated"
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users only"
    ON "public"."ingredients"
    FOR SELECT
    TO "authenticated"
    USING (true);

CREATE POLICY "Enable update for authenticated users only"
    ON "public"."ingredients"
    FOR UPDATE
    TO "authenticated"
    USING (true)
    WITH CHECK (true);

-- Meals policies (user-specific data)
CREATE POLICY "Enable users all operations on their own data only"
    ON "public"."meals"
    TO "authenticated"
    USING ((SELECT "auth"."uid"()) = "user_id");

-- Recipes policies (user-specific data)
CREATE POLICY "Enable users all operations on their own data only"
    ON "public"."recipes"
    TO "authenticated"
    USING ((SELECT "auth"."uid"()) = "user_id");

-- Recipes to ingredients policies (based on recipe ownership)
CREATE POLICY "Enable users all operations on their own data only"
    ON "public"."recipes_to_ingredients"
    TO "authenticated"
    USING ((SELECT "auth"."uid"()) = (
        SELECT "recipes"."user_id"
        FROM "public"."recipes"
        WHERE ("recipes"."id" = "recipes_to_ingredients"."recipe_id")
    ));

-- Shopping items policies (user-specific data)
CREATE POLICY "Enable users all operations on their own data only"
    ON "public"."shopping_items"
    TO "authenticated"
    USING ((SELECT "auth"."uid"()) = "user_id");
