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
import { useAuth } from "./AuthContext";

type ShoppingListContextType = {
  showedSections: ShoppingListSection[];
  isLoading: boolean;
  showCheckedItems: boolean;
  toggleCheckedItemsSwitch: () => void;
  loadShoppingList: () => Promise<void>;
  setChecked: (ids: string[], checked: boolean) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addItem: (item: Omit<ShoppingItem, "id">) => Promise<void>;
  editItem: (id: string, item: Omit<ShoppingItem, "id">) => Promise<void>;
};

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [showCheckedItems, setShowCheckedItems] = useState(false);
  const [sections, setSections] = useState<ShoppingListSection[]>([]);
  const [showedSections, setShowedSections] = useState<ShoppingListSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    if (showCheckedItems) {
      setShowedSections(sections);
    } else {
      setShowedSections(
        sections
          .map((section) => ({ title: section.title, data: section.data.filter((item) => !item.checked) }))
          .filter((section) => section.data.length > 0),
      );
    }
  }, [sections, showCheckedItems]);

  const toggleCheckedItemsSwitch = useCallback(() => {
    setShowCheckedItems((prev) => !prev);
  }, []);

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
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user.id],
  );

  useEffect(() => {
    loadShoppingList();
  }, [loadShoppingList]);

  const addItem = useCallback(
    async (item: Omit<ShoppingItem, "id">) => {
      try {
        setIsLoading(true);
        await addShoppingListItem(item);
        await loadShoppingList();
      } finally {
        setIsLoading(false);
      }
    },
    [loadShoppingList],
  );

  const setChecked = useCallback(
    async (ids: string[], checked: boolean) => {
      await setCheckedShoppingListItems(ids, checked);
      await loadShoppingList({ skipLoading: true });
    },
    [loadShoppingList],
  );

  const editItem = useCallback(
    async (id: string, item: Omit<ShoppingItem, "id">) => {
      try {
        setIsLoading(true);
        await updateShoppingListItem(id, item);
        await loadShoppingList();
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
      } finally {
        setIsLoading(false);
      }
    },
    [loadShoppingList],
  );

  const contextValue = useMemo(() => {
    return {
      showedSections,
      isLoading,
      loadShoppingList,
      setChecked,
      deleteItem,
      addItem,
      editItem,
      showCheckedItems,
      toggleCheckedItemsSwitch,
    };
  }, [
    addItem,
    editItem,
    deleteItem,
    isLoading,
    loadShoppingList,
    showedSections,
    setChecked,
    showCheckedItems,
    toggleCheckedItemsSwitch,
  ]);

  return <ShoppingListContext.Provider value={contextValue}>{children}</ShoppingListContext.Provider>;
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error("useShoppingList must be used within a ShoppingListProvider");
  }
  return context;
}
