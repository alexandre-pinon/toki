-- ============================================
-- MULTI-USER SECURITY FIXES MIGRATION
-- Fixes: BOO-46
-- ============================================

-- 1. FIX: Add user_id to shopping items trigger
-- ============================================
-- Problem: Trigger runs with SECURITY DEFINER, so auth.uid() won't resolve correctly.
-- Solution: Explicitly pass user_id from the meal record (NEW.user_id).

CREATE OR REPLACE FUNCTION public.create_shopping_items_from_meal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.shopping_items (
    user_id,
    name,
    quantity,
    category,
    unit,
    updated_at,
    meal_id,
    meal_date,
    recipe_id,
    ingredient_id
  )
  SELECT
    NEW.user_id,
    i.name,
    ri.quantity,
    i.category,
    ri.unit,
    NOW(),
    NEW.id AS meal_id,
    NEW.date AS meal_date,
    ri.recipe_id,
    ri.ingredient_id
  FROM public.recipes_to_ingredients ri
  JOIN public.ingredients i ON i.id = ri.ingredient_id
  WHERE ri.recipe_id = NEW.recipe_id;

  RETURN NEW;
END;
$function$;

-- 2. FIX: Add user_id to upsert trigger
-- ============================================
-- Problem: Same as above - trigger needs explicit user_id from the meal record.
-- Solution: Fetch user_id from the meal in the loop and use it in INSERT.

CREATE OR REPLACE FUNCTION public.upsert_shopping_items_on_upsert_recipes_to_ingredients()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  ingredient_name text;
  ingredient_category public.shopping_item_category;
  recipe_servings integer;
  meal_rec record;
BEGIN
  SELECT name, category INTO ingredient_name, ingredient_category
  FROM public.ingredients
  WHERE id = NEW.ingredient_id;

  SELECT servings INTO recipe_servings
  FROM public.recipes
  WHERE id = NEW.recipe_id;

  -- For each upcoming meal that uses this recipe, upsert a shopping item
  FOR meal_rec IN
    SELECT
      m.id AS meal_id,
      m.date AS meal_date,
      m.servings AS meal_servings,
      m.user_id AS meal_user_id
    FROM public.meals m
    WHERE m.recipe_id = NEW.recipe_id
      AND m.date >= current_date
  LOOP
    INSERT INTO public.shopping_items (
      user_id,
      name,
      quantity,
      category,
      unit,
      updated_at,
      meal_id,
      meal_date,
      recipe_id,
      ingredient_id
    )
    VALUES (
      meal_rec.meal_user_id,
      ingredient_name,
      CASE
        WHEN NEW.quantity IS NOT NULL
        THEN NEW.quantity::numeric * (meal_rec.meal_servings::numeric / recipe_servings::numeric)
        ELSE NULL
      END,
      ingredient_category,
      NEW.unit,
      NOW(),
      meal_rec.meal_id,
      meal_rec.meal_date,
      NEW.recipe_id,
      NEW.ingredient_id
    )
    ON CONFLICT (meal_id, recipe_id, ingredient_id)
    DO UPDATE SET
      quantity = excluded.quantity,
      unit = excluded.unit,
      updated_at = excluded.updated_at,
      checked = CASE
        WHEN excluded.quantity > public.shopping_items.quantity
          OR excluded.unit != public.shopping_items.unit
        THEN false
        ELSE public.shopping_items.checked
      END;
  END LOOP;

  RETURN NEW;
END;
$function$;

-- 3. FIX: Revoke anon permissions
-- ============================================
-- Problem: anon role has full CRUD on user-specific tables.
-- Impact: Unnecessary attack surface. RLS blocks access, but defense in depth is best practice.

REVOKE ALL ON public.recipes FROM anon;
REVOKE ALL ON public.meals FROM anon;
REVOKE ALL ON public.shopping_items FROM anon;
REVOKE ALL ON public.recipes_to_ingredients FROM anon;

-- 4. FIX: Restrict ingredient modifications
-- ============================================
-- Problem: Any authenticated user can UPDATE global ingredients.
-- Solution: Keep INSERT (to add new ingredients) but remove UPDATE capability.

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.ingredients;
