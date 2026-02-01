import { FormRecipeIngredient, Recipe, RecipeTimeFields, RecipeUpsertData } from "@/types/recipe/recipe";
import { UnitType } from "@/types/unit-type";
import { safeParseOptionalFloat } from "@/utils/string";
import { CheerioAPI, load } from "cheerio";
import { Element } from "domhandler";
import { findIngredientByName } from "./ingredient";

export async function parseMarmitonRecipe(
  recipeId: string,
  html: string,
  userId: string,
): Promise<{
  recipe: RecipeUpsertData["recipe"];
  ingredients: FormRecipeIngredient[];
  instructions: RecipeUpsertData["instructions"];
}> {
  const $ = load(html);
  const ingredients = await matchRawIngredientsWithDb(userId, parseIngredients($));

  return {
    recipe: {
      id: recipeId,
      name: parseTitle($),
      type: "main",
      imageUrl: parseImageUrl($),
      servings: parseServings($),
      ...parseRecipeTimes($),
    },
    ingredients,
    instructions: parseInstructions($),
  };
}

function parseTitle($: CheerioAPI): string {
  const h1 = $("h1").first();
  return h1.text() || "Nouvelle recette";
}

function parseRecipeTimes($: CheerioAPI): Pick<Recipe, RecipeTimeFields> {
  const timeDetails = $(".time__details");
  const prepTimeText = timeDetails.find("div").first().find("div").first().text();
  const restTimeText = timeDetails.find("div").first().next().find("div").first().text();
  const cookTimeText = timeDetails.find("div").first().next().next().find("div").first().text();

  return {
    preparationTime: safeParseDurationInMinutes(prepTimeText),
    cookingTime: safeParseDurationInMinutes(cookTimeText),
    restTime: safeParseDurationInMinutes(restTimeText),
  };
}

function safeParseDurationInMinutes(durationText: string): number | undefined {
  try {
    const [duration, suffix] = durationText.split(" ");
    switch (suffix) {
      case "h":
        return parseInt(duration) * 60;
      case "min":
        return parseInt(duration);
      default:
        return;
    }
  } catch {
    return;
  }
}

function parseServings($: CheerioAPI): number {
  const servingsTag = $(".mrtn-recette_ingredients-counter");
  const servingsNb = servingsTag.attr("data-servingsnb");
  return servingsNb ? parseInt(servingsNb) : 1;
}

function parseImageUrl($: CheerioAPI): string | undefined {
  const imageTag = $("#recipe-media-viewer-thumbnail-0");
  const srcset = imageTag.attr("data-srcset");
  return srcset?.split(",").at(-1)?.trim().split(" ").at(0);
}

function parseIngredients($: CheerioAPI): FormRecipeIngredient[] {
  const ingredientsContainer = $(".mrtn-recette_ingredients-items");
  const ingredients: FormRecipeIngredient[] = [];

  ingredientsContainer.find(".card-ingredient").each((_, element) => {
    const ingredient = parseIngredient($, element);
    if (ingredient) {
      ingredients.push(ingredient);
    }
  });

  return ingredients;
}

function parseIngredient($: CheerioAPI, element: Element): FormRecipeIngredient | null {
  const $element = $(element);

  const name = $element.find(".ingredient-name").attr("data-ingredientnamesingular");
  const quantityStr = $element.find(".card-ingredient-quantity").attr("data-ingredientquantity");
  const unit = $element.find(".unit").attr("data-unitsingular");

  if (!name) return null;
  const quantity = safeParseOptionalFloat(quantityStr);

  return {
    name,
    category: "other",
    unit: parseFrenchUnitType(unit),
    ...(quantity && quantity > 0 ? { quantity } : {}),
  };
}

function parseFrenchUnitType(unitType?: string): UnitType | undefined {
  switch (unitType) {
    case "g":
    case "kg":
    case "l":
    case "cl":
    case "ml":
      return unitType;
    case "cuillère à café":
      return "tsp";
    case "cuillère à soupe":
      return "tbsp";
    case "tasse":
      return "cup";
    case "pièce":
      return "piece";
    case "pincée":
      return "pinch";
    case "botte":
      return "bunch";
    case "gousse":
      return "clove";
    case "canette":
      return "can";
    case "paquet":
      return "package";
    case "tranche":
      return "slice";
    case "au goût":
      return "to_taste";
    default:
      return;
  }
}

async function matchRawIngredientsWithDb(
  userId: string,
  rawIngredients: FormRecipeIngredient[],
): Promise<FormRecipeIngredient[]> {
  return await Promise.all(
    rawIngredients.map(async (rawIngredient) => {
      const maybeMatchingIngredient = await findIngredientByName(userId, rawIngredient.name);
      if (!maybeMatchingIngredient) {
        return rawIngredient;
      }

      return {
        ...rawIngredient,
        ingredientId: maybeMatchingIngredient.id,
        category: maybeMatchingIngredient.category,
      };
    }),
  );
}

function parseInstructions($: CheerioAPI): string[] {
  const instructionsContainer = $(".recipe-step-list");
  const instructions: string[] = [];

  instructionsContainer.find(".recipe-step-list__container").each((_, element) => {
    const instruction = parseInstruction($, element);
    if (instruction) {
      instructions.push(instruction);
    }
  });

  return instructions;
}

function parseInstruction($: CheerioAPI, element: Element): string | null {
  const $element = $(element);
  const text = $element.find("p").text();
  return text || null;
}
