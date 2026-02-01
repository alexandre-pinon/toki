-- ============================================
-- USER-SCOPED INGREDIENTS MIGRATION
-- BOO-46: Overlay pattern - base ingredients + user overrides
-- ============================================

-- 1. Add new columns to ingredients
-- ============================================
ALTER TABLE public.ingredients
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN base_ingredient_id uuid REFERENCES public.ingredients(id) ON DELETE CASCADE,
  ADD COLUMN is_deleted boolean NOT NULL DEFAULT false;

-- 2. Migrate existing ingredients to the existing user
-- ============================================
-- All current ingredients become base (user_id stays NULL)
-- No action needed - they're already base ingredients

-- 3. Update unique constraints
-- ============================================
-- Drop old global uniqueness constraint
ALTER TABLE public.ingredients
  DROP CONSTRAINT IF EXISTS ingredients_name_normalized_key;

-- Base ingredients: name_normalized globally unique
CREATE UNIQUE INDEX ingredients_base_name_unique
  ON public.ingredients(name_normalized)
  WHERE user_id IS NULL;

-- User ingredients: name_normalized unique per user
CREATE UNIQUE INDEX ingredients_user_name_unique
  ON public.ingredients(user_id, name_normalized)
  WHERE user_id IS NOT NULL;

-- User can only have one override per base ingredient
CREATE UNIQUE INDEX ingredients_user_override_unique
  ON public.ingredients(user_id, base_ingredient_id)
  WHERE base_ingredient_id IS NOT NULL;

-- 4. Add index for user_id queries
-- ============================================
CREATE INDEX ingredients_user_id_idx ON public.ingredients(user_id);
CREATE INDEX ingredients_base_ingredient_id_idx ON public.ingredients(base_ingredient_id);

-- 5. Update RLS policies
-- ============================================
-- Drop old policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.ingredients;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON public.ingredients;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.ingredients;

-- Base ingredients: read-only for all authenticated users
CREATE POLICY "Enable read access to base ingredients"
  ON public.ingredients
  FOR SELECT
  TO authenticated
  USING (user_id IS NULL);

-- User ingredients: full CRUD for owner
CREATE POLICY "Enable all operations on own ingredients"
  ON public.ingredients
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 6. Create trigger to migrate recipes when user creates an override
-- ============================================
CREATE OR REPLACE FUNCTION public.migrate_recipe_ingredients_to_user_override()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only for overrides (has base_ingredient_id)
  IF NEW.base_ingredient_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Migrate this user's recipes from base → user's override
  UPDATE public.recipes_to_ingredients rti
  SET ingredient_id = NEW.id
  FROM public.recipes r
  WHERE rti.recipe_id = r.id
    AND r.user_id = NEW.user_id
    AND rti.ingredient_id = NEW.base_ingredient_id;

  RETURN NEW;
END;
$function$;

CREATE TRIGGER migrate_recipe_ingredients_on_override
  AFTER INSERT ON public.ingredients
  FOR EACH ROW
  EXECUTE FUNCTION public.migrate_recipe_ingredients_to_user_override();

-- 7. Revoke anon permissions (defense in depth)
-- ============================================
REVOKE ALL ON public.ingredients FROM anon;
