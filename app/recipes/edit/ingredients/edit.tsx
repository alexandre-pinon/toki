import { IngredientEditForm } from "@/components/IngredientEditForm";
import { useFormIngredient } from "@/contexts/FormIngredientContext";
import { useFormRecipe } from "@/contexts/FormRecipeContext";
import { UnitType } from "@/types/unit-type";
import { safeParseOptionalFloat } from "@/utils/string";
import { router, useLocalSearchParams } from "expo-router";

export default function RecipeEditIngredientEditScreen() {
  const { index, quantity, unit } = useLocalSearchParams<{
    index?: string;
    quantity?: string;
    unit?: UnitType;
  }>();
  const { setFormCurrentIngredient } = useFormRecipe();
  const { upsertIngredient } = useFormIngredient();

  const handleSave = async () => {
    const upsertedIngredient = await upsertIngredient();
    if (!upsertedIngredient) return;

    setFormCurrentIngredient({
      ingredientId: upsertedIngredient.id,
      name: upsertedIngredient.name,
      category: upsertedIngredient.category,
      quantity: safeParseOptionalFloat(quantity),
      unit,
    });
    router.push({ pathname: "./quantity", params: { index } });
  };

  const handleCancel = () => {
    router.back();
  };

  return <IngredientEditForm onSave={handleSave} onCancel={handleCancel} />;
}
