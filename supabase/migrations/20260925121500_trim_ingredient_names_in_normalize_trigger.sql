CREATE OR REPLACE FUNCTION public.normalize_ingredient_name()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW.name = btrim(NEW.name);
  NEW.name_normalized = unaccent('unaccent', lower(NEW.name));
  RETURN NEW;
END;$function$;
