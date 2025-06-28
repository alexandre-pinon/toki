CREATE
OR REPLACE VIEW upcoming_meals_shopping_items AS WITH normalized_quantities AS (
  SELECT
    id,
    user_id,
    name,
    category,
    unit,
    CASE
      WHEN unit = 'kg' THEN COALESCE(quantity, 0) * 1000
      WHEN unit = 'l' THEN COALESCE(quantity, 0) * 1000
      WHEN unit = 'cl' THEN COALESCE(quantity, 0) * 10
      ELSE quantity
    END as normalized_quantity,
    CASE
      WHEN unit IN ('kg', 'g') THEN 'weight'
      WHEN unit IN ('l', 'cl', 'ml') THEN 'volume'
      ELSE NULL
    END as unit_family,
    meal_date,
    checked
  FROM
    shopping_items
  WHERE
    meal_date >= CURRENT_DATE
),
weight_volume_items AS (
  SELECT
    array_agg(id) as ids,
    user_id,
    name,
    category,
    CASE
      WHEN unit_family = 'weight' THEN CASE
        WHEN SUM(normalized_quantity) >= 1000 THEN 'kg' :: unit_type
        ELSE 'g' :: unit_type
      END
      WHEN unit_family = 'volume' THEN CASE
        WHEN SUM(normalized_quantity) >= 1000 THEN 'l' :: unit_type
        WHEN SUM(normalized_quantity) >= 10 THEN 'cl' :: unit_type
        ELSE 'ml' :: unit_type
      END
    END as unit,
    CASE
      WHEN unit_family = 'weight' THEN CASE
        WHEN SUM(normalized_quantity) >= 1000 THEN ROUND(SUM(normalized_quantity) / 1000, 2)
        ELSE SUM(normalized_quantity)
      END
      WHEN unit_family = 'volume' THEN CASE
        WHEN SUM(normalized_quantity) >= 1000 THEN ROUND(SUM(normalized_quantity) / 1000, 2)
        WHEN SUM(normalized_quantity) >= 100 THEN ROUND(SUM(normalized_quantity) / 100, 2)
        WHEN SUM(normalized_quantity) >= 10 THEN ROUND(SUM(normalized_quantity) / 10, 2)
        ELSE SUM(normalized_quantity)
      END
    END as quantity,
    MIN(meal_date) as earliest_meal_date,
    bool_and(checked) as checked
  FROM
    normalized_quantities
  WHERE
    unit_family IS NOT NULL
  GROUP BY
    user_id,
    name,
    unit_family,
    category
),
other_items AS (
  SELECT
    array_agg(id) as ids,
    user_id,
    name,
    category,
    unit,
    SUM(normalized_quantity) as quantity,
    MIN(meal_date) as earliest_meal_date,
    bool_and(checked) as checked
  FROM
    normalized_quantities
  WHERE
    unit_family IS NULL
  GROUP BY
    user_id,
    name,
    unit,
    category
)
SELECT
  ids,
  user_id,
  name,
  category,
  unit,
  quantity,
  earliest_meal_date AS meal_date,
  EXTRACT(
    ISODOW
    FROM
      earliest_meal_date
  ) AS week_day,
  checked
FROM
  weight_volume_items
UNION
ALL
SELECT
  ids,
  user_id,
  name,
  category,
  unit,
  quantity,
  earliest_meal_date AS meal_date,
  EXTRACT(
    ISODOW
    FROM
      earliest_meal_date
  ) AS week_day,
  checked
FROM
  other_items
ORDER BY
  category,
  week_day;