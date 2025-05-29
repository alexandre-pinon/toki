import type { ShoppingItem } from "@/types/shopping/shopping-item";
import { type ReactNode, createContext, useContext, useState } from "react";
import { useShoppingListService } from "../services/shopping-list";
import type { ShoppingListSection } from "../types/shopping/shopping-list";

interface ShoppingListContextType {
  sections: ShoppingListSection[];
  loadShoppingList: () => Promise<void>;
  setChecked: (id: number, checked: boolean) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  addItem: (item: Omit<ShoppingItem, "id">) => Promise<void>;
  editItem: (id: number, item: Omit<ShoppingItem, "id">) => Promise<void>;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<ShoppingListSection[]>([]);
  const {
    getShoppingListItems,
    addShoppingListItem,
    updateShoppingListItem,
    deleteShoppingListItem,
  } = useShoppingListService();

  const loadShoppingList = async () => {
    const items = await getShoppingListItems();
    setSections(items);
  };

  const addItem = async (item: Omit<ShoppingItem, "id">) => {
    await addShoppingListItem(item);
    await loadShoppingList();
  };

  const setChecked = async (id: number, checked: boolean) => {
    const section = sections.find((s) => s.data.some((item) => item.id === id));
    const item = section?.data.find((item) => item.id === id);
    if (!item) return;

    await updateShoppingListItem(id, { ...item, checked });
    await loadShoppingList();
  };

  const editItem = async (id: number, item: Omit<ShoppingItem, "id">) => {
    await updateShoppingListItem(id, item);
    await loadShoppingList();
  };

  const handleDelete = async (id: number) => {
    await deleteShoppingListItem(id);
    await loadShoppingList();
  };

  return (
    <ShoppingListContext.Provider
      value={{ sections, loadShoppingList, setChecked, handleDelete, addItem, editItem }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error("useShoppingList must be used within a ShoppingListProvider");
  }
  return context;
}
