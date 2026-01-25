create extension if not exists "pg_cron" with schema "pg_catalog";

create extension if not exists "pg_trgm" with schema "extensions";

create extension if not exists "pgjwt" with schema "extensions";

create extension if not exists "unaccent" with schema "extensions";

drop extension if exists "pg_net";

create type "public"."cuisine_type" as enum ('chinese', 'japanese', 'korean', 'vietnamese', 'thai', 'indian', 'indonesian', 'malaysian', 'filipino', 'singaporean', 'taiwanese', 'tibetan', 'nepalese', 'italian', 'french', 'spanish', 'greek', 'german', 'british', 'irish', 'portuguese', 'hungarian', 'polish', 'russian', 'swedish', 'norwegian', 'danish', 'dutch', 'belgian', 'swiss', 'austrian', 'turkish', 'lebanese', 'iranian', 'israeli', 'moroccan', 'egyptian', 'syrian', 'iraqi', 'saudi', 'american', 'mexican', 'brazilian', 'peruvian', 'argentinian', 'colombian', 'venezuelan', 'caribbean', 'cuban', 'cajun', 'creole', 'canadian', 'ethiopian', 'nigerian', 'south_african', 'kenyan', 'ghanaian', 'senegalese', 'tanzanian', 'other');

create type "public"."meal_type" as enum ('breakfast', 'lunch', 'dinner', 'snack');

create type "public"."recipe_type" as enum ('starter', 'main', 'side', 'dessert', 'sauce', 'drink');

create type "public"."shopping_item_category" as enum ('fruits_vegetables', 'meat', 'fish', 'condiment', 'cereals', 'dairy_products', 'desserts', 'other');

create type "public"."unit_type" as enum ('ml', 'cl', 'l', 'g', 'kg', 'tsp', 'tbsp', 'cup', 'piece', 'pinch', 'bunch', 'clove', 'can', 'package', 'slice', 'to_taste');

create type "public"."unit_type_family" as enum ('weight', 'volume', 'other');


  create table "public"."ingredients" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null,
    "category" public.shopping_item_category,
    "name_normalized" text not null
      );


alter table "public"."ingredients" enable row level security;


  create table "public"."meals" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null,
    "recipe_id" uuid not null,
    "date" date not null,
    "servings" smallint not null,
    "user_id" uuid not null default auth.uid()
      );


alter table "public"."meals" enable row level security;


  create table "public"."recipes" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "type" public.recipe_type not null,
    "preparation_time" bigint,
    "cooking_time" bigint,
    "servings" smallint not null,
    "instructions" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null,
    "user_id" uuid not null default auth.uid(),
    "image_url" text,
    "times_done" bigint not null default '0'::bigint,
    "last_time_done" date,
    "rest_time" bigint
      );


alter table "public"."recipes" enable row level security;


  create table "public"."recipes_to_ingredients" (
    "recipe_id" uuid not null,
    "ingredient_id" uuid not null,
    "quantity" numeric,
    "unit" public.unit_type,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null
      );


alter table "public"."recipes_to_ingredients" enable row level security;


  create table "public"."shopping_items" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "quantity" numeric,
    "checked" boolean not null default false,
    "category" public.shopping_item_category not null,
    "user_id" uuid not null default auth.uid(),
    "unit" public.unit_type,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null,
    "meal_id" uuid,
    "meal_date" date,
    "recipe_id" uuid,
    "ingredient_id" uuid
      );


alter table "public"."shopping_items" enable row level security;

CREATE INDEX ingredients_name_normalized_gin_trgm ON public.ingredients USING gin (name_normalized extensions.gin_trgm_ops);

CREATE UNIQUE INDEX ingredients_name_normalized_key ON public.ingredients USING btree (name_normalized);

CREATE UNIQUE INDEX ingredients_pkey ON public.ingredients USING btree (id);

CREATE UNIQUE INDEX meal_pkey ON public.meals USING btree (id);

CREATE UNIQUE INDEX recipes_pkey ON public.recipes USING btree (id);

CREATE UNIQUE INDEX recipes_to_ingredients_pkey ON public.recipes_to_ingredients USING btree (recipe_id, ingredient_id);

CREATE UNIQUE INDEX shopping_items_meal_id_recipe_id_ingredient_id_key ON public.shopping_items USING btree (meal_id, recipe_id, ingredient_id);

CREATE UNIQUE INDEX shopping_items_pkey ON public.shopping_items USING btree (id);

alter table "public"."ingredients" add constraint "ingredients_pkey" PRIMARY KEY using index "ingredients_pkey";

alter table "public"."meals" add constraint "meal_pkey" PRIMARY KEY using index "meal_pkey";

alter table "public"."recipes" add constraint "recipes_pkey" PRIMARY KEY using index "recipes_pkey";

alter table "public"."recipes_to_ingredients" add constraint "recipes_to_ingredients_pkey" PRIMARY KEY using index "recipes_to_ingredients_pkey";

alter table "public"."shopping_items" add constraint "shopping_items_pkey" PRIMARY KEY using index "shopping_items_pkey";

alter table "public"."ingredients" add constraint "ingredients_name_normalized_key" UNIQUE using index "ingredients_name_normalized_key";

alter table "public"."meals" add constraint "meal_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."meals" validate constraint "meal_recipe_id_fkey";

alter table "public"."meals" add constraint "meal_servings_check" CHECK ((servings > 0)) not valid;

alter table "public"."meals" validate constraint "meal_servings_check";

alter table "public"."meals" add constraint "meal_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."meals" validate constraint "meal_user_id_fkey";

alter table "public"."recipes" add constraint "recipes_servings_check" CHECK ((servings > 0)) not valid;

alter table "public"."recipes" validate constraint "recipes_servings_check";

alter table "public"."recipes" add constraint "recipes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."recipes" validate constraint "recipes_user_id_fkey";

alter table "public"."recipes_to_ingredients" add constraint "recipes_to_ingredients_ingredient_id_fkey" FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."recipes_to_ingredients" validate constraint "recipes_to_ingredients_ingredient_id_fkey";

alter table "public"."recipes_to_ingredients" add constraint "recipes_to_ingredients_quantity_check" CHECK ((quantity > (0)::numeric)) not valid;

alter table "public"."recipes_to_ingredients" validate constraint "recipes_to_ingredients_quantity_check";

alter table "public"."recipes_to_ingredients" add constraint "recipes_to_ingredients_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."recipes_to_ingredients" validate constraint "recipes_to_ingredients_recipe_id_fkey";

alter table "public"."shopping_items" add constraint "shopping_items_ingredient_id_fkey" FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."shopping_items" validate constraint "shopping_items_ingredient_id_fkey";

alter table "public"."shopping_items" add constraint "shopping_items_meal_id_fkey" FOREIGN KEY (meal_id) REFERENCES public.meals(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."shopping_items" validate constraint "shopping_items_meal_id_fkey";

alter table "public"."shopping_items" add constraint "shopping_items_quantity_check" CHECK ((quantity > (0)::numeric)) not valid;

alter table "public"."shopping_items" validate constraint "shopping_items_quantity_check";

alter table "public"."shopping_items" add constraint "shopping_items_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."shopping_items" validate constraint "shopping_items_recipe_id_fkey";

alter table "public"."shopping_items" add constraint "shopping_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."shopping_items" validate constraint "shopping_items_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_shopping_items_from_meal()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.delete_shopping_item_on_delete_recipes_to_ingredients()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  -- delete any shopping items that reference the deleted recipe/ingredient pair
  delete from public.shopping_items
  where recipe_id = OLD.recipe_id
    and ingredient_id = OLD.ingredient_id;

  return OLD;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.normalize_ingredient_name()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW.name_normalized = unaccent('unaccent', lower(NEW.name));
  RETURN NEW;
END;$function$
;

create or replace view "public"."upcoming_meals_shopping_items" as  WITH normalized_quantities AS (
         SELECT shopping_items.id,
            shopping_items.user_id,
            shopping_items.name,
            shopping_items.category,
            shopping_items.unit,
                CASE
                    WHEN (shopping_items.unit = 'kg'::public.unit_type) THEN (COALESCE(shopping_items.quantity, (0)::numeric) * (1000)::numeric)
                    WHEN (shopping_items.unit = 'l'::public.unit_type) THEN (COALESCE(shopping_items.quantity, (0)::numeric) * (1000)::numeric)
                    WHEN (shopping_items.unit = 'cl'::public.unit_type) THEN (COALESCE(shopping_items.quantity, (0)::numeric) * (10)::numeric)
                    ELSE shopping_items.quantity
                END AS normalized_quantity,
                CASE
                    WHEN (shopping_items.unit = ANY (ARRAY['kg'::public.unit_type, 'g'::public.unit_type])) THEN 'weight'::text
                    WHEN (shopping_items.unit = ANY (ARRAY['l'::public.unit_type, 'cl'::public.unit_type, 'ml'::public.unit_type])) THEN 'volume'::text
                    ELSE NULL::text
                END AS unit_family,
            shopping_items.meal_date,
            shopping_items.checked
           FROM public.shopping_items
          WHERE (shopping_items.meal_date >= CURRENT_DATE)
        ), weight_volume_items AS (
         SELECT array_agg(normalized_quantities.id) AS ids,
            normalized_quantities.user_id,
            normalized_quantities.name,
            normalized_quantities.category,
                CASE
                    WHEN (normalized_quantities.unit_family = 'weight'::text) THEN
                    CASE
                        WHEN (round(sum(normalized_quantities.normalized_quantity)) >= (1000)::numeric) THEN 'kg'::public.unit_type
                        ELSE 'g'::public.unit_type
                    END
                    WHEN (normalized_quantities.unit_family = 'volume'::text) THEN
                    CASE
                        WHEN (round(sum(normalized_quantities.normalized_quantity)) >= (1000)::numeric) THEN 'l'::public.unit_type
                        WHEN (round(sum(normalized_quantities.normalized_quantity)) >= (100)::numeric) THEN 'cl'::public.unit_type
                        ELSE 'ml'::public.unit_type
                    END
                    ELSE NULL::public.unit_type
                END AS unit,
                CASE
                    WHEN (normalized_quantities.unit_family = 'weight'::text) THEN
                    CASE
                        WHEN (round(sum(normalized_quantities.normalized_quantity)) >= (1000)::numeric) THEN (sum(normalized_quantities.normalized_quantity) / (1000)::numeric)
                        ELSE sum(normalized_quantities.normalized_quantity)
                    END
                    WHEN (normalized_quantities.unit_family = 'volume'::text) THEN
                    CASE
                        WHEN (round(sum(normalized_quantities.normalized_quantity)) >= (1000)::numeric) THEN (sum(normalized_quantities.normalized_quantity) / (1000)::numeric)
                        WHEN (round(sum(normalized_quantities.normalized_quantity)) >= (100)::numeric) THEN (sum(normalized_quantities.normalized_quantity) / (10)::numeric)
                        ELSE sum(normalized_quantities.normalized_quantity)
                    END
                    ELSE NULL::numeric
                END AS quantity,
            min(normalized_quantities.meal_date) AS earliest_meal_date,
            bool_and(normalized_quantities.checked) AS checked
           FROM normalized_quantities
          WHERE (normalized_quantities.unit_family IS NOT NULL)
          GROUP BY normalized_quantities.user_id, normalized_quantities.name, normalized_quantities.unit_family, normalized_quantities.category
        ), other_items AS (
         SELECT array_agg(normalized_quantities.id) AS ids,
            normalized_quantities.user_id,
            normalized_quantities.name,
            normalized_quantities.category,
            normalized_quantities.unit,
            sum(normalized_quantities.normalized_quantity) AS quantity,
            min(normalized_quantities.meal_date) AS earliest_meal_date,
            bool_and(normalized_quantities.checked) AS checked
           FROM normalized_quantities
          WHERE (normalized_quantities.unit_family IS NULL)
          GROUP BY normalized_quantities.user_id, normalized_quantities.name, normalized_quantities.unit, normalized_quantities.category
        )
 SELECT weight_volume_items.ids,
    weight_volume_items.user_id,
    weight_volume_items.name,
    weight_volume_items.category,
    weight_volume_items.unit,
    weight_volume_items.quantity,
    weight_volume_items.earliest_meal_date AS meal_date,
    weight_volume_items.checked
   FROM weight_volume_items
UNION ALL
 SELECT other_items.ids,
    other_items.user_id,
    other_items.name,
    other_items.category,
    other_items.unit,
    other_items.quantity,
    other_items.earliest_meal_date AS meal_date,
    other_items.checked
   FROM other_items;


CREATE OR REPLACE FUNCTION public.update_shopping_items_from_meal_date()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Update shopping_items meal_date for items associated with this meal
    UPDATE shopping_items si
    SET meal_date = NEW.date
    WHERE si.meal_id = NEW.id
    AND (
      si.meal_date IS NULL
      OR si.meal_date != NEW.date
    );

    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_shopping_items_quantity_from_meal_servings()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$declare
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
end;$function$
;

CREATE OR REPLACE FUNCTION public.upsert_shopping_items_on_upsert_recipes_to_ingredients()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$declare
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
end;$function$
;

grant delete on table "public"."ingredients" to "anon";

grant insert on table "public"."ingredients" to "anon";

grant references on table "public"."ingredients" to "anon";

grant select on table "public"."ingredients" to "anon";

grant trigger on table "public"."ingredients" to "anon";

grant truncate on table "public"."ingredients" to "anon";

grant update on table "public"."ingredients" to "anon";

grant delete on table "public"."ingredients" to "authenticated";

grant insert on table "public"."ingredients" to "authenticated";

grant references on table "public"."ingredients" to "authenticated";

grant select on table "public"."ingredients" to "authenticated";

grant trigger on table "public"."ingredients" to "authenticated";

grant truncate on table "public"."ingredients" to "authenticated";

grant update on table "public"."ingredients" to "authenticated";

grant delete on table "public"."ingredients" to "service_role";

grant insert on table "public"."ingredients" to "service_role";

grant references on table "public"."ingredients" to "service_role";

grant select on table "public"."ingredients" to "service_role";

grant trigger on table "public"."ingredients" to "service_role";

grant truncate on table "public"."ingredients" to "service_role";

grant update on table "public"."ingredients" to "service_role";

grant delete on table "public"."meals" to "anon";

grant insert on table "public"."meals" to "anon";

grant references on table "public"."meals" to "anon";

grant select on table "public"."meals" to "anon";

grant trigger on table "public"."meals" to "anon";

grant truncate on table "public"."meals" to "anon";

grant update on table "public"."meals" to "anon";

grant delete on table "public"."meals" to "authenticated";

grant insert on table "public"."meals" to "authenticated";

grant references on table "public"."meals" to "authenticated";

grant select on table "public"."meals" to "authenticated";

grant trigger on table "public"."meals" to "authenticated";

grant truncate on table "public"."meals" to "authenticated";

grant update on table "public"."meals" to "authenticated";

grant delete on table "public"."meals" to "service_role";

grant insert on table "public"."meals" to "service_role";

grant references on table "public"."meals" to "service_role";

grant select on table "public"."meals" to "service_role";

grant trigger on table "public"."meals" to "service_role";

grant truncate on table "public"."meals" to "service_role";

grant update on table "public"."meals" to "service_role";

grant delete on table "public"."recipes" to "anon";

grant insert on table "public"."recipes" to "anon";

grant references on table "public"."recipes" to "anon";

grant select on table "public"."recipes" to "anon";

grant trigger on table "public"."recipes" to "anon";

grant truncate on table "public"."recipes" to "anon";

grant update on table "public"."recipes" to "anon";

grant delete on table "public"."recipes" to "authenticated";

grant insert on table "public"."recipes" to "authenticated";

grant references on table "public"."recipes" to "authenticated";

grant select on table "public"."recipes" to "authenticated";

grant trigger on table "public"."recipes" to "authenticated";

grant truncate on table "public"."recipes" to "authenticated";

grant update on table "public"."recipes" to "authenticated";

grant delete on table "public"."recipes" to "service_role";

grant insert on table "public"."recipes" to "service_role";

grant references on table "public"."recipes" to "service_role";

grant select on table "public"."recipes" to "service_role";

grant trigger on table "public"."recipes" to "service_role";

grant truncate on table "public"."recipes" to "service_role";

grant update on table "public"."recipes" to "service_role";

grant delete on table "public"."recipes_to_ingredients" to "anon";

grant insert on table "public"."recipes_to_ingredients" to "anon";

grant references on table "public"."recipes_to_ingredients" to "anon";

grant select on table "public"."recipes_to_ingredients" to "anon";

grant trigger on table "public"."recipes_to_ingredients" to "anon";

grant truncate on table "public"."recipes_to_ingredients" to "anon";

grant update on table "public"."recipes_to_ingredients" to "anon";

grant delete on table "public"."recipes_to_ingredients" to "authenticated";

grant insert on table "public"."recipes_to_ingredients" to "authenticated";

grant references on table "public"."recipes_to_ingredients" to "authenticated";

grant select on table "public"."recipes_to_ingredients" to "authenticated";

grant trigger on table "public"."recipes_to_ingredients" to "authenticated";

grant truncate on table "public"."recipes_to_ingredients" to "authenticated";

grant update on table "public"."recipes_to_ingredients" to "authenticated";

grant delete on table "public"."recipes_to_ingredients" to "service_role";

grant insert on table "public"."recipes_to_ingredients" to "service_role";

grant references on table "public"."recipes_to_ingredients" to "service_role";

grant select on table "public"."recipes_to_ingredients" to "service_role";

grant trigger on table "public"."recipes_to_ingredients" to "service_role";

grant truncate on table "public"."recipes_to_ingredients" to "service_role";

grant update on table "public"."recipes_to_ingredients" to "service_role";

grant delete on table "public"."shopping_items" to "anon";

grant insert on table "public"."shopping_items" to "anon";

grant references on table "public"."shopping_items" to "anon";

grant select on table "public"."shopping_items" to "anon";

grant trigger on table "public"."shopping_items" to "anon";

grant truncate on table "public"."shopping_items" to "anon";

grant update on table "public"."shopping_items" to "anon";

grant delete on table "public"."shopping_items" to "authenticated";

grant insert on table "public"."shopping_items" to "authenticated";

grant references on table "public"."shopping_items" to "authenticated";

grant select on table "public"."shopping_items" to "authenticated";

grant trigger on table "public"."shopping_items" to "authenticated";

grant truncate on table "public"."shopping_items" to "authenticated";

grant update on table "public"."shopping_items" to "authenticated";

grant delete on table "public"."shopping_items" to "service_role";

grant insert on table "public"."shopping_items" to "service_role";

grant references on table "public"."shopping_items" to "service_role";

grant select on table "public"."shopping_items" to "service_role";

grant trigger on table "public"."shopping_items" to "service_role";

grant truncate on table "public"."shopping_items" to "service_role";

grant update on table "public"."shopping_items" to "service_role";


  create policy "Enable insert for authenticated users only"
  on "public"."ingredients"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for authenticated users only"
  on "public"."ingredients"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Enable update for authenticated users only"
  on "public"."ingredients"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Enable users all operations on their own data only"
  on "public"."meals"
  as permissive
  for all
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users all operations on their own data only"
  on "public"."recipes"
  as permissive
  for all
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users all operations on their own data only"
  on "public"."recipes_to_ingredients"
  as permissive
  for all
  to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT recipes.user_id
   FROM public.recipes
  WHERE (recipes.id = recipes_to_ingredients.recipe_id))));



  create policy "Enable users all operations on their own data only"
  on "public"."shopping_items"
  as permissive
  for all
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


CREATE TRIGGER normalize_ingredient_name_trigger BEFORE INSERT OR UPDATE ON public.ingredients FOR EACH ROW EXECUTE FUNCTION public.normalize_ingredient_name();

CREATE TRIGGER create_shopping_items_from_meal_trigger AFTER INSERT ON public.meals FOR EACH ROW EXECUTE FUNCTION public.create_shopping_items_from_meal();

CREATE TRIGGER update_shopping_items_from_meal_date_trigger AFTER UPDATE ON public.meals FOR EACH ROW EXECUTE FUNCTION public.update_shopping_items_from_meal_date();

CREATE TRIGGER update_shopping_items_quantity_from_meal_servings_trigger AFTER UPDATE ON public.meals FOR EACH ROW WHEN ((old.servings IS DISTINCT FROM new.servings)) EXECUTE FUNCTION public.update_shopping_items_quantity_from_meal_servings();

CREATE TRIGGER delete_shopping_item_on_delete_recipes_to_ingredients_trigger AFTER DELETE ON public.recipes_to_ingredients FOR EACH ROW EXECUTE FUNCTION public.delete_shopping_item_on_delete_recipes_to_ingredients();

CREATE TRIGGER upsert_shopping_items_on_upsert_recipes_to_ingredients_trigger AFTER INSERT OR UPDATE ON public.recipes_to_ingredients FOR EACH ROW EXECUTE FUNCTION public.upsert_shopping_items_on_upsert_recipes_to_ingredients();


  create policy "Allow all operation for authenticated users 1y9pnsc_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'toki-images'::text));



  create policy "Allow all operation for authenticated users 1y9pnsc_1"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'toki-images'::text));



  create policy "Allow all operation for authenticated users 1y9pnsc_2"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'toki-images'::text));



  create policy "Allow all operation  authenticated users 1y9pnsc_3"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'toki-images'::text));
