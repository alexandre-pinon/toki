import { IngredientEditForm } from "@/components/IngredientEditForm";
import { useFormIngredient } from "@/contexts/FormIngredientContext";
import { router } from "expo-router";

export default function IngredientEditScreen() {
  const { upsertIngredient } = useFormIngredient();

  const handleSave = async () => {
    await upsertIngredient();
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return <IngredientEditForm onSave={handleSave} onCancel={handleCancel} />;
}
