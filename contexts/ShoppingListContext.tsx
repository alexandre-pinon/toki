import {
  addShoppingListItem,
  deleteShoppingListItem,
  getShoppingListItems,
  setCheckedShoppingListItems,
  updateShoppingListItem,
} from "@/services/shopping-list";
import type { ShoppingItem } from "@/types/shopping/shopping-item";
import type { ShoppingListSection } from "@/types/shopping/shopping-list";
import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext";

type ShoppingListContextType = {
  sections: ShoppingListSection[];
  error: Error | null;
  isLoading: boolean;
  loadShoppingList: (userId: string) => Promise<void>;
  setChecked: (ids: string[], checked: boolean, userId: string) => Promise<void>;
  deleteItem: (id: string, userId: string) => Promise<void>;
  addItem: (item: Omit<ShoppingItem, "id">) => Promise<void>;
  editItem: (id: string, item: Omit<ShoppingItem, "id">) => Promise<void>;
};

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<ShoppingListSection[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  const loadShoppingList = useCallback(async (userId: string, options?: { skipLoading: boolean }) => {
    try {
      setIsLoading(!options?.skipLoading);
      const items = await getShoppingListItems(userId);
      setSections(items);
      setError(null);
    } catch (err) {
      handleError(err, "Failed to load shopping list");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleError = (err: unknown, message: string) => {
    const error = err instanceof Error ? err : new Error(message);
    setError(error);
    Alert.alert("Error", message);
  };

  useEffect(() => {
    if (!session) return;
    loadShoppingList(session.user.id);
  }, [session, loadShoppingList]);

  const addItem = async (item: Omit<ShoppingItem, "id">) => {
    try {
      setIsLoading(true);
      await addShoppingListItem(item);
      await loadShoppingList(item.userId);
      setError(null);
    } catch (err) {
      handleError(err, "Failed to add item");
    } finally {
      setIsLoading(false);
    }
  };

  const setChecked = async (ids: string[], checked: boolean, userId: string) => {
    try {
      await setCheckedShoppingListItems(ids, checked);
      await loadShoppingList(userId, { skipLoading: true });
      setError(null);
    } catch (err) {
      handleError(err, "Failed to update item");
    }
  };

  const editItem = async (id: string, item: Omit<ShoppingItem, "id">) => {
    try {
      setIsLoading(true);
      await updateShoppingListItem(id, item);
      await loadShoppingList(item.userId);
      setError(null);
    } catch (err) {
      handleError(err, "Failed to edit item");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string, userId: string) => {
    try {
      setIsLoading(true);
      await deleteShoppingListItem(id);
      await loadShoppingList(userId);
      setError(null);
    } catch (err) {
      handleError(err, "Failed to delete item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ShoppingListContext.Provider
      value={{
        sections,
        error,
        isLoading,
        loadShoppingList,
        setChecked,
        deleteItem,
        addItem,
        editItem,
      }}
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
