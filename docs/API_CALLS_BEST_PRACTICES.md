# API Calls Best Practices

## Overview

This document outlines the harmonized approach to API calls in the Toki app, following React/React Native best practices.

## Current Architecture

### 1. Service Layer (`/services/`)

- **Purpose**: Raw API functions that handle database operations
- **Location**: `services/recipe.ts`, `services/meal.ts`, `services/shopping-list.ts`
- **Responsibility**: Direct Supabase calls, data transformation, error throwing

### 2. Custom Hooks (`/hooks/`)

- **Purpose**: State management and data fetching logic
- **Location**: `hooks/useRecipes.ts`, `hooks/useRecipeDetails.ts`, `hooks/useMeals.ts`
- **Responsibility**: Loading states, error handling, data caching, reusability

### 3. Context Layer (`/contexts/`)

- **Purpose**: Global state management for complex data flows
- **Location**: `contexts/ShoppingListContext.tsx`
- **Responsibility**: Shared state, complex operations, cross-component communication

### 4. UI Components (`/components/` and `/app/`)

- **Purpose**: Presentation and user interaction
- **Responsibility**: Rendering, user events, minimal business logic

## Best Practices

### ✅ Recommended: Custom Hooks Pattern

```typescript
// hooks/useRecipes.ts
export function useRecipes() {
  const { session } = useAuth();
  const { getRecipes } = useRecipeService();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch logic with proper error handling
  const fetchRecipes = async () => {
    // Implementation
  };

  useEffect(() => {
    fetchRecipes();
  }, [session?.user?.id]);

  return { recipes, isLoading, error, refetch: fetchRecipes };
}

// components/RecipeList.tsx
export function RecipeList() {
  const { recipes, isLoading, error } = useRecipes();
  // UI logic only
}
```

### ✅ Recommended: Context Pattern (for complex state)

```typescript
// contexts/ShoppingListContext.tsx
export function ShoppingListProvider({ children }) {
  // Complex state management with multiple operations
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Multiple operations: add, edit, delete, check
  const addItem = async (item) => {
    /* ... */
  };
  const editItem = async (id, item) => {
    /* ... */
  };
  const deleteItem = async (id) => {
    /* ... */
  };

  return (
    <ShoppingListContext.Provider value={{ sections, addItem, editItem, deleteItem }}>
      {children}
    </ShoppingListContext.Provider>
  );
}
```

### ❌ Avoid: Direct API calls in components

```typescript
// ❌ Bad: Direct API calls in components
export function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await getRecipes(userId);
        setRecipes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);
}
```

## When to Use Each Pattern

### Custom Hooks (`useX`)

- **Use for**: Simple data fetching with loading/error states
- **Examples**: `useRecipes()`, `useRecipeDetails(id)`, `useMeals()`
- **Benefits**: Reusable, testable, separation of concerns

### Context (`XContext`)

- **Use for**: Complex state with multiple operations
- **Examples**: `ShoppingListContext` (add, edit, delete, check operations)
- **Benefits**: Centralized state, cross-component communication

### Direct Service Calls

- **Use for**: One-off operations (create, update, delete)
- **Examples**: Form submissions, user actions
- **Benefits**: Simple, direct

## Error Handling Strategy

### 1. Service Layer

- Throw errors for network/database issues
- Transform data and validate responses

### 2. Custom Hooks

- Catch and handle errors gracefully
- Set error states for UI feedback
- Log errors for debugging

### 3. UI Components

- Display error states to users
- Provide retry mechanisms
- Show appropriate loading states

## Loading States

### Consistent Loading Patterns

```typescript
interface UseDataReturn {
  data: DataType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

### Loading UI Components

- Use `Loader` component for full-screen loading
- Use `LoadingOverlay` for overlay loading
- Use skeleton screens for better UX

## Benefits of This Approach

1. **Separation of Concerns**: API logic separated from UI
2. **Reusability**: Hooks can be used across multiple components
3. **Testability**: Easy to unit test hooks and services
4. **Consistency**: Standardized error handling and loading states
5. **Maintainability**: Centralized data fetching logic
6. **Performance**: Potential for caching and optimization

## Migration Guide

### From Direct API Calls to Custom Hooks

1. **Create custom hook** in `/hooks/` directory
2. **Move API logic** from component to hook
3. **Update component** to use hook
4. **Remove** direct service imports from component
5. **Test** the new implementation

### Example Migration

```typescript
// Before
export function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const { getRecipes } = useRecipeService();

  useEffect(() => {
    const loadRecipes = async () => {
      const data = await getRecipes(userId);
      setRecipes(data);
    };
    loadRecipes();
  }, []);
}

// After
export function RecipeList() {
  const { recipes, isLoading, error } = useRecipes();
  // Component focuses only on UI logic
}
```

## Future Enhancements

1. **Caching**: Implement React Query or SWR for advanced caching
2. **Optimistic Updates**: Update UI immediately, sync with server
3. **Offline Support**: Cache data for offline usage
4. **Real-time Updates**: WebSocket integration for live data
5. **Error Boundaries**: React Error Boundaries for better error handling
