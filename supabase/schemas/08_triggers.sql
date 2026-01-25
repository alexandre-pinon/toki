-- Trigger to normalize ingredient names on insert/update
CREATE OR REPLACE TRIGGER "normalize_ingredient_name_trigger"
    BEFORE INSERT OR UPDATE ON "public"."ingredients"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."normalize_ingredient_name"();

-- Trigger to create shopping items when a meal is inserted
CREATE OR REPLACE TRIGGER "create_shopping_items_from_meal_trigger"
    AFTER INSERT ON "public"."meals"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."create_shopping_items_from_meal"();

-- Trigger to update shopping items when meal date changes
CREATE OR REPLACE TRIGGER "update_shopping_items_from_meal_date_trigger"
    AFTER UPDATE ON "public"."meals"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."update_shopping_items_from_meal_date"();

-- Trigger to update shopping items quantity when meal servings change
CREATE OR REPLACE TRIGGER "update_shopping_items_quantity_from_meal_servings_trigger"
    AFTER UPDATE ON "public"."meals"
    FOR EACH ROW
    WHEN (("old"."servings" IS DISTINCT FROM "new"."servings"))
    EXECUTE FUNCTION "public"."update_shopping_items_quantity_from_meal_servings"();

-- Trigger to upsert shopping items when recipe ingredients are added/updated
CREATE OR REPLACE TRIGGER "upsert_shopping_items_on_upsert_recipes_to_ingredients_trigger"
    AFTER INSERT OR UPDATE ON "public"."recipes_to_ingredients"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."upsert_shopping_items_on_upsert_recipes_to_ingredients"();

-- Trigger to delete shopping items when recipe ingredient is removed
CREATE OR REPLACE TRIGGER "delete_shopping_item_on_delete_recipes_to_ingredients_trigger"
    AFTER DELETE ON "public"."recipes_to_ingredients"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."delete_shopping_item_on_delete_recipes_to_ingredients"();
