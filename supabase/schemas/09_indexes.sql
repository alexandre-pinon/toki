-- GIN index for trigram search on normalized ingredient names
CREATE INDEX "ingredients_name_normalized_gin_trgm" ON "public"."ingredients" USING "gin" ("name_normalized" "extensions"."gin_trgm_ops");

-- Unique index for normalized ingredient names
ALTER TABLE ONLY "public"."ingredients"
    ADD CONSTRAINT "ingredients_name_normalized_key" UNIQUE ("name_normalized");

-- Unique index for shopping items to prevent duplicates
CREATE UNIQUE INDEX "shopping_items_meal_id_recipe_id_ingredient_id_key" ON "public"."shopping_items" USING "btree" ("meal_id", "recipe_id", "ingredient_id");
