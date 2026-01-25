-- Function to normalize ingredient names for search
CREATE OR REPLACE FUNCTION "public"."normalize_ingredient_name"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  NEW.name_normalized = unaccent('unaccent', lower(NEW.name));
  RETURN NEW;
END;$$;

ALTER FUNCTION "public"."normalize_ingredient_name"() OWNER TO "postgres";

-- Function to create shopping items when a meal is created
CREATE OR REPLACE FUNCTION "public"."create_shopping_items_from_meal"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  -- Use recipe.servings as the multiplier. If recipe.servings IS NULL or 0, default to 1.
  INSERT INTO public.shopping_items (
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
END;$$;

ALTER FUNCTION "public"."create_shopping_items_from_meal"() OWNER TO "postgres";

-- Function to update shopping items when meal date changes
CREATE OR REPLACE FUNCTION "public"."update_shopping_items_from_meal_date"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    -- Update shopping_items meal_date for items associated with this meal
    UPDATE shopping_items si
    SET meal_date = NEW.date
    WHERE si.meal_id = NEW.id
    AND (
      si.meal_date IS NULL
      OR si.meal_date != NEW.date
    );

    RETURN NEW;
END;$$;

ALTER FUNCTION "public"."update_shopping_items_from_meal_date"() OWNER TO "postgres";

-- Function to update shopping items quantity when meal servings change
CREATE OR REPLACE FUNCTION "public"."update_shopping_items_quantity_from_meal_servings"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$declare
  recipe_servings numeric;
  ratio numeric;
begin
  ratio := new.servings::numeric / old.servings::numeric;

  -- Update quantities for related shopping items where quantity is not null
  update public.shopping_items
     set quantity = quantity * ratio
   where meal_id = new.id
     and quantity is not null;

  -- If servings increased, mark related shopping items as unchecked
  if new.servings > old.servings then
    update public.shopping_items
       set checked = false
     where meal_id = new.id;
  end if;

  return new;
end;$$;

ALTER FUNCTION "public"."update_shopping_items_quantity_from_meal_servings"() OWNER TO "postgres";

-- Function to upsert shopping items when recipe ingredients are added/updated
CREATE OR REPLACE FUNCTION "public"."upsert_shopping_items_on_upsert_recipes_to_ingredients"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$declare
  ingredient_name text;
  ingredient_category public.shopping_item_category;
  recipe_servings integer;
  meal_rec record;
begin
  -- Retrieve ingredient name
  select name, category into ingredient_name, ingredient_category
  from public.ingredients
  where id = NEW.ingredient_id;

  select servings into recipe_servings
  from public.recipes
  where id = NEW.recipe_id;

  -- For each upcoming meal that uses this recipe, upsert a shopping item
  for meal_rec in
    select
      m.id as meal_id,
      m.date as meal_date,
      m.servings as meal_servings
    from public.meals m
    where m.recipe_id = NEW.recipe_id
      and m.date >= current_date
  loop
    insert into public.shopping_items (
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
    values (
      ingredient_name,
      case
        when NEW.quantity is not null then NEW.quantity::numeric * (meal_rec.meal_servings::numeric / recipe_servings::numeric)
        else null
      end,
      ingredient_category,
      NEW.unit,
      now(),
      meal_rec.meal_id,
      meal_rec.meal_date,
      NEW.recipe_id,
      NEW.ingredient_id
    )
    on conflict (meal_id, recipe_id, ingredient_id)
    do update set
      quantity = excluded.quantity,
      unit = excluded.unit,
      updated_at = excluded.updated_at,
      checked = case
        when
          excluded.quantity > public.shopping_items.quantity
          or excluded.unit != public.shopping_items.unit
        then false
        else public.shopping_items.checked
      end;
  end loop;

  return NEW;
end;$$;

ALTER FUNCTION "public"."upsert_shopping_items_on_upsert_recipes_to_ingredients"() OWNER TO "postgres";

-- Function to delete shopping items when recipe ingredient is removed
CREATE OR REPLACE FUNCTION "public"."delete_shopping_item_on_delete_recipes_to_ingredients"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  -- delete any shopping items that reference the deleted recipe/ingredient pair
  delete from public.shopping_items
  where recipe_id = OLD.recipe_id
    and ingredient_id = OLD.ingredient_id;

  return OLD;
end;
$$;

ALTER FUNCTION "public"."delete_shopping_item_on_delete_recipes_to_ingredients"() OWNER TO "postgres";
