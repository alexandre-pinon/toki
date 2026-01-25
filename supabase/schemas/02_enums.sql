-- Cuisine types for recipe categorization
CREATE TYPE "public"."cuisine_type" AS ENUM (
    'chinese',
    'japanese',
    'korean',
    'vietnamese',
    'thai',
    'indian',
    'indonesian',
    'malaysian',
    'filipino',
    'singaporean',
    'taiwanese',
    'tibetan',
    'nepalese',
    'italian',
    'french',
    'spanish',
    'greek',
    'german',
    'british',
    'irish',
    'portuguese',
    'hungarian',
    'polish',
    'russian',
    'swedish',
    'norwegian',
    'danish',
    'dutch',
    'belgian',
    'swiss',
    'austrian',
    'turkish',
    'lebanese',
    'iranian',
    'israeli',
    'moroccan',
    'egyptian',
    'syrian',
    'iraqi',
    'saudi',
    'american',
    'mexican',
    'brazilian',
    'peruvian',
    'argentinian',
    'colombian',
    'venezuelan',
    'caribbean',
    'cuban',
    'cajun',
    'creole',
    'canadian',
    'ethiopian',
    'nigerian',
    'south_african',
    'kenyan',
    'ghanaian',
    'senegalese',
    'tanzanian',
    'other'
);

ALTER TYPE "public"."cuisine_type" OWNER TO "postgres";

-- Ingredient tags for categorization
CREATE TYPE "public"."ingredient_tag" AS ENUM (
    'chicken',
    'pork',
    'beef',
    'fish',
    'pasta',
    'rice',
    'potato'
);

ALTER TYPE "public"."ingredient_tag" OWNER TO "postgres";

-- Meal time categorization
CREATE TYPE "public"."meal_type" AS ENUM (
    'breakfast',
    'lunch',
    'dinner',
    'snack'
);

ALTER TYPE "public"."meal_type" OWNER TO "postgres";

-- Recipe course types
CREATE TYPE "public"."recipe_type" AS ENUM (
    'starter',
    'main',
    'side',
    'dessert',
    'sauce',
    'drink'
);

ALTER TYPE "public"."recipe_type" OWNER TO "postgres";

-- Shopping item categories
CREATE TYPE "public"."shopping_item_category" AS ENUM (
    'fruits_vegetables',
    'meat',
    'fish',
    'condiment',
    'cereals',
    'dairy_products',
    'desserts',
    'other'
);

ALTER TYPE "public"."shopping_item_category" OWNER TO "postgres";

-- Unit types for measurements
CREATE TYPE "public"."unit_type" AS ENUM (
    'ml',
    'cl',
    'l',
    'g',
    'kg',
    'tsp',
    'tbsp',
    'cup',
    'piece',
    'pinch',
    'bunch',
    'clove',
    'can',
    'package',
    'slice',
    'to_taste'
);

ALTER TYPE "public"."unit_type" OWNER TO "postgres";

-- Unit type families for conversions
CREATE TYPE "public"."unit_type_family" AS ENUM (
    'weight',
    'volume',
    'other'
);

ALTER TYPE "public"."unit_type_family" OWNER TO "postgres";
