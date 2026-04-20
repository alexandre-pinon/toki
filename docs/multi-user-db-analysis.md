# Multi-User Database Readiness Analysis

> Analysis performed: January 2026
> Updated: February 2026
> Status: ✅ Ready for production multi-user support

## Current Schema Overview

### Tables
- **ingredients** - Base ingredients (shared) + user overrides (overlay pattern)
- **recipes** - User-specific recipes with `user_id`
- **recipes_to_ingredients** - Junction table linking recipes to ingredients
- **meals** - User-specific meal planning with `user_id`
- **shopping_items** - User-specific shopping list with `user_id`

### Views
- **upcoming_meals_shopping_items** - Aggregates shopping items from future meals

---

## ✅ Completed Fixes

| Component | Status | Migration |
|-----------|--------|-----------|
| Trigger functions pass `user_id` | ✅ | `20260201090720_multi_user_security_fixes.sql` |
| Anon role permissions revoked | ✅ | `20260201090720_multi_user_security_fixes.sql` |
| User-scoped ingredients (overlay pattern) | ✅ | `20260201102334_user_scoped_ingredients.sql` |

---

## 🔶 Pending Fixes

### Storage Bucket Cross-User Access

**Problem:** Any authenticated user can access any file in the bucket.

**Fix required:**
1. Store images with user-prefixed paths: `{user_id}/image.jpg`
2. Update storage policies to check folder ownership

**Files to update:**
- `services/image.ts` - Update upload path generation
- Create new migration for storage policies

---

## 🧅 Ingredients: Overlay Pattern

### Design

Instead of copying all base ingredients for each user (wasteful), we use an **overlay pattern**:

| `user_id` | `base_ingredient_id` | Meaning |
|-----------|---------------------|---------|
| `NULL` | `NULL` | Base ingredient (shared, read-only) |
| `uuid` | `NULL` | User's own new ingredient |
| `uuid` | `<base_id>` | User's override of a base ingredient |
| `uuid` | `<base_id>` + `is_deleted=true` | User "deleted" a base ingredient |

### Behavior

| Action | What Happens |
|--------|--------------|
| **Add new ingredient** | INSERT with `user_id`, `base_ingredient_id = NULL` |
| **Edit base ingredient** | INSERT override with `base_ingredient_id = <base>` |
| **Delete base ingredient** | INSERT override with `is_deleted = true` |
| **Edit own ingredient** | UPDATE existing row |
| **Delete own ingredient** | DELETE row (cascades to recipe links) |

### Query Logic (Service Layer)

```typescript
// 1. Get user's ingredients (own + overrides, not deleted)
const userIngredients = await supabase
  .from("ingredients")
  .select("*")
  .eq("user_id", userId)
  .eq("is_deleted", false);

// 2. Get base ingredients not overridden by user
const overriddenBaseIds = userIngredients
  .filter(i => i.base_ingredient_id)
  .map(i => i.base_ingredient_id);

const baseIngredients = await supabase
  .from("ingredients")
  .select("*")
  .is("user_id", null)
  .not("id", "in", `(${overriddenBaseIds.join(",")})`);

// 3. Merge
return [...userIngredients, ...baseIngredients];
```

### Recipe Migration Trigger

When a user creates an override of a base ingredient, their existing recipes automatically migrate:

```sql
CREATE TRIGGER migrate_recipe_ingredients_on_override
  AFTER INSERT ON public.ingredients
  FOR EACH ROW
  EXECUTE FUNCTION public.migrate_recipe_ingredients_to_user_override();
```

This updates `recipes_to_ingredients.ingredient_id` from the base ID to the user's override ID.

### RLS Policies

```sql
-- Base ingredients: read-only for all authenticated users
CREATE POLICY "Enable read access to base ingredients"
  ON public.ingredients FOR SELECT TO authenticated
  USING (user_id IS NULL);

-- User ingredients: full CRUD for owner
CREATE POLICY "Enable all operations on own ingredients"
  ON public.ingredients FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### Unique Constraints

```sql
-- Base: name_normalized globally unique
CREATE UNIQUE INDEX ingredients_base_name_unique
  ON ingredients(name_normalized) WHERE user_id IS NULL;

-- User: name_normalized unique per user
CREATE UNIQUE INDEX ingredients_user_name_unique
  ON ingredients(user_id, name_normalized) WHERE user_id IS NOT NULL;

-- User: only one override per base ingredient
CREATE UNIQUE INDEX ingredients_user_override_unique
  ON ingredients(user_id, base_ingredient_id) WHERE base_ingredient_id IS NOT NULL;
```

---

## 📊 Summary

| Issue | Severity | Status |
|-------|----------|--------|
| Triggers missing `user_id` | 🔴 Critical | ✅ Fixed |
| Anon role grants | 🟡 Medium | ✅ Fixed |
| Ingredients user-scoped | 🟡 Medium | ✅ Fixed (overlay pattern) |
| Storage cross-user access | 🔴 Critical | 🔶 Pending |

---

## Migration Files

1. `20260125123336_remote_schema.sql` - Initial schema
2. `20260125135958_add_ingredient_tag.sql` - Add ingredient tags
3. `20260201090720_multi_user_security_fixes.sql` - Trigger fixes, anon revoke
4. `20260201102334_user_scoped_ingredients.sql` - User-scoped ingredients with overlay pattern
