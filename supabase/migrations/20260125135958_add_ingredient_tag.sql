create type "public"."ingredient_tag" as enum ('chicken', 'pork', 'beef', 'fish', 'pasta', 'rice', 'potato');

alter table "public"."ingredients" add column "tag" public.ingredient_tag;


