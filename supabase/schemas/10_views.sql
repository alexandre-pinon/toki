-- View to aggregate and normalize shopping items from upcoming meals
CREATE OR REPLACE VIEW "public"."upcoming_meals_shopping_items" WITH ("security_invoker"='on') AS
 WITH "normalized_quantities" AS (
         SELECT "shopping_items"."id",
            "shopping_items"."user_id",
            "shopping_items"."name",
            "shopping_items"."category",
            "shopping_items"."unit",
                CASE
                    WHEN ("shopping_items"."unit" = 'kg'::"public"."unit_type") THEN (COALESCE("shopping_items"."quantity", (0)::numeric) * (1000)::numeric)
                    WHEN ("shopping_items"."unit" = 'l'::"public"."unit_type") THEN (COALESCE("shopping_items"."quantity", (0)::numeric) * (1000)::numeric)
                    WHEN ("shopping_items"."unit" = 'cl'::"public"."unit_type") THEN (COALESCE("shopping_items"."quantity", (0)::numeric) * (10)::numeric)
                    ELSE "shopping_items"."quantity"
                END AS "normalized_quantity",
                CASE
                    WHEN ("shopping_items"."unit" = ANY (ARRAY['kg'::"public"."unit_type", 'g'::"public"."unit_type"])) THEN 'weight'::"text"
                    WHEN ("shopping_items"."unit" = ANY (ARRAY['l'::"public"."unit_type", 'cl'::"public"."unit_type", 'ml'::"public"."unit_type"])) THEN 'volume'::"text"
                    ELSE NULL::"text"
                END AS "unit_family",
            "shopping_items"."meal_date",
            "shopping_items"."checked"
           FROM "public"."shopping_items"
          WHERE ("shopping_items"."meal_date" >= CURRENT_DATE)
        ), "weight_volume_items" AS (
         SELECT "array_agg"("normalized_quantities"."id") AS "ids",
            "normalized_quantities"."user_id",
            "normalized_quantities"."name",
            "normalized_quantities"."category",
                CASE
                    WHEN ("normalized_quantities"."unit_family" = 'weight'::"text") THEN
                    CASE
                        WHEN ("round"("sum"("normalized_quantities"."normalized_quantity")) >= (1000)::numeric) THEN 'kg'::"public"."unit_type"
                        ELSE 'g'::"public"."unit_type"
                    END
                    WHEN ("normalized_quantities"."unit_family" = 'volume'::"text") THEN
                    CASE
                        WHEN ("round"("sum"("normalized_quantities"."normalized_quantity")) >= (1000)::numeric) THEN 'l'::"public"."unit_type"
                        WHEN ("round"("sum"("normalized_quantities"."normalized_quantity")) >= (100)::numeric) THEN 'cl'::"public"."unit_type"
                        ELSE 'ml'::"public"."unit_type"
                    END
                    ELSE NULL::"public"."unit_type"
                END AS "unit",
                CASE
                    WHEN ("normalized_quantities"."unit_family" = 'weight'::"text") THEN
                    CASE
                        WHEN ("round"("sum"("normalized_quantities"."normalized_quantity")) >= (1000)::numeric) THEN ("sum"("normalized_quantities"."normalized_quantity") / (1000)::numeric)
                        ELSE "sum"("normalized_quantities"."normalized_quantity")
                    END
                    WHEN ("normalized_quantities"."unit_family" = 'volume'::"text") THEN
                    CASE
                        WHEN ("round"("sum"("normalized_quantities"."normalized_quantity")) >= (1000)::numeric) THEN ("sum"("normalized_quantities"."normalized_quantity") / (1000)::numeric)
                        WHEN ("round"("sum"("normalized_quantities"."normalized_quantity")) >= (100)::numeric) THEN ("sum"("normalized_quantities"."normalized_quantity") / (10)::numeric)
                        ELSE "sum"("normalized_quantities"."normalized_quantity")
                    END
                    ELSE NULL::numeric
                END AS "quantity",
            "min"("normalized_quantities"."meal_date") AS "earliest_meal_date",
            "bool_and"("normalized_quantities"."checked") AS "checked"
           FROM "normalized_quantities"
          WHERE ("normalized_quantities"."unit_family" IS NOT NULL)
          GROUP BY "normalized_quantities"."user_id", "normalized_quantities"."name", "normalized_quantities"."unit_family", "normalized_quantities"."category"
        ), "other_items" AS (
         SELECT "array_agg"("normalized_quantities"."id") AS "ids",
            "normalized_quantities"."user_id",
            "normalized_quantities"."name",
            "normalized_quantities"."category",
            "normalized_quantities"."unit",
            "sum"("normalized_quantities"."normalized_quantity") AS "quantity",
            "min"("normalized_quantities"."meal_date") AS "earliest_meal_date",
            "bool_and"("normalized_quantities"."checked") AS "checked"
           FROM "normalized_quantities"
          WHERE ("normalized_quantities"."unit_family" IS NULL)
          GROUP BY "normalized_quantities"."user_id", "normalized_quantities"."name", "normalized_quantities"."unit", "normalized_quantities"."category"
        )
 SELECT "weight_volume_items"."ids",
    "weight_volume_items"."user_id",
    "weight_volume_items"."name",
    "weight_volume_items"."category",
    "weight_volume_items"."unit",
    "weight_volume_items"."quantity",
    "weight_volume_items"."earliest_meal_date" AS "meal_date",
    "weight_volume_items"."checked"
   FROM "weight_volume_items"
UNION ALL
 SELECT "other_items"."ids",
    "other_items"."user_id",
    "other_items"."name",
    "other_items"."category",
    "other_items"."unit",
    "other_items"."quantity",
    "other_items"."earliest_meal_date" AS "meal_date",
    "other_items"."checked"
   FROM "other_items";

-- Owner
ALTER TABLE "public"."upcoming_meals_shopping_items" OWNER TO "postgres";
