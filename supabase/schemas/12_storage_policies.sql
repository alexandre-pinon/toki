-- Storage bucket for recipe images
INSERT INTO "storage"."buckets" ("id", "name", "public")
VALUES ('toki-images', 'toki-images', false)
ON CONFLICT ("id") DO NOTHING;

-- Storage policies for toki-images bucket
CREATE POLICY "Allow all operation for authenticated users 1y9pnsc_0"
ON "storage"."objects"
AS permissive
FOR SELECT
TO authenticated
USING ((bucket_id = 'toki-images'::text));

CREATE POLICY "Allow all operation for authenticated users 1y9pnsc_1"
ON "storage"."objects"
AS permissive
FOR INSERT
TO authenticated
WITH CHECK ((bucket_id = 'toki-images'::text));

CREATE POLICY "Allow all operation for authenticated users 1y9pnsc_2"
ON "storage"."objects"
AS permissive
FOR UPDATE
TO authenticated
USING ((bucket_id = 'toki-images'::text));

CREATE POLICY "Allow all operation  authenticated users 1y9pnsc_3"
ON "storage"."objects"
AS permissive
FOR DELETE
TO authenticated
USING ((bucket_id = 'toki-images'::text));
