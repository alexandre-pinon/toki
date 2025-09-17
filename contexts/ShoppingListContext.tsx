import {
  addShoppingListItem,
  deleteShoppingListItem,
  getShoppingListItems,
  setCheckedShoppingListItems,
  updateShoppingListItem,
} from "@/services/shopping-list";
import type { ShoppingItem } from "@/types/shopping/shopping-item";
import type { ShoppingListSection } from "@/types/shopping/shopping-list";
import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext";

type ShoppingListContextType = {
  sections: ShoppingListSection[];
  error: Error | null;
  isLoading: boolean;
  loadShoppingList: () => Promise<void>;
  setChecked: (ids: string[], checked: boolean) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addItem: (item: Omit<ShoppingItem, "id">) => Promise<void>;
  editItem: (id: string, item: Omit<ShoppingItem, "id">) => Promise<void>;
};

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<ShoppingListSection[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  const loadShoppingList = useCallback(
    async (options?: { skipLoading: boolean }) => {
      if (!session?.user.id) {
        setSections([]);
        return;
      }

      try {
        setIsLoading(!options?.skipLoading);
        const items = await getShoppingListItems(session.user.id);
        setSections(items);
        setError(null);
      } catch (err) {
        handleError(err, "Failed to load shopping list");
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user.id],
  );

  const handleError = (err: unknown, message: string) => {
    const error = err instanceof Error ? err : new Error(message);
    setError(error);
    Alert.alert("Error", message);
  };

  useEffect(() => {
    loadShoppingList();
  }, [loadShoppingList]);

  const addItem = useCallback(
    async (item: Omit<ShoppingItem, "id">) => {
      try {
        setIsLoading(true);
        await addShoppingListItem(item);
        await loadShoppingList();
        setError(null);
      } catch (err) {
        handleError(err, "Failed to add item");
      } finally {
        setIsLoading(false);
      }
    },
    [loadShoppingList],
  );

  const setChecked = useCallback(
    async (ids: string[], checked: boolean) => {
      try {
        await setCheckedShoppingListItems(ids, checked);
        await loadShoppingList({ skipLoading: true });
        setError(null);
      } catch (err) {
        handleError(err, "Failed to update item");
      }
    },
    [loadShoppingList],
  );

  const editItem = useCallback(
    async (id: string, item: Omit<ShoppingItem, "id">) => {
      try {
        setIsLoading(true);
        await updateShoppingListItem(id, item);
        await loadShoppingList();
        setError(null);
      } catch (err) {
        handleError(err, "Failed to edit item");
      } finally {
        setIsLoading(false);
      }
    },
    [loadShoppingList],
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        await deleteShoppingListItem(id);
        await loadShoppingList();
        setError(null);
      } catch (err) {
        handleError(err, "Failed to delete item");
      } finally {
        setIsLoading(false);
      }
    },
    [loadShoppingList],
  );

  const contextValue = useMemo(() => {
    return {
      sections,
      error,
      isLoading,
      loadShoppingList,
      setChecked,
      deleteItem,
      addItem,
      editItem,
    };
  }, [addItem, editItem, deleteItem, error, isLoading, loadShoppingList, sections, setChecked]);

  return <ShoppingListContext.Provider value={contextValue}>{children}</ShoppingListContext.Provider>;
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error("useShoppingList must be used within a ShoppingListProvider");
  }
  return context;
}
