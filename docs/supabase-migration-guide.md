# Supabase Migration Guide

> **Status:** Hypothetical — not needed currently
> **Last updated:** 2026-02-01
> **Estimated effort:** 1-2 weeks

This document outlines how to migrate Toki from Supabase to a traditional backend + Postgres setup, if ever needed.

---

## Current Architecture

```
┌─────────────┐         ┌─────────────────────────────────┐
│  React      │ ──────▶ │         Supabase                │
│  Native     │         │  ┌─────────┐  ┌──────────────┐  │
│  App        │         │  │ Auth    │  │ Postgres     │  │
└─────────────┘         │  │         │  │ + Triggers   │  │
                        │  └─────────┘  │ + RLS        │  │
                        │  ┌─────────┐  └──────────────┘  │
                        │  │ Storage │                    │
                        │  └─────────┘                    │
                        └─────────────────────────────────┘
```

## Coupling Assessment

| Component | Files | Coupling | Portability |
|-----------|-------|----------|-------------|
| Database queries | `services/*.ts` (6 files) | Medium | SDK swap needed |
| Auth | `contexts/AuthContext.tsx` | Medium | Provider swap |
| Storage | `services/image.ts` | Low | 32 lines |
| RLS policies | `supabase/schemas/11_rls_policies.sql` | N/A | Becomes middleware |
| Triggers/Functions | `supabase/schemas/07_functions.sql` | Low | Standard PL/pgSQL |

### Why Migration Would Be Manageable

1. **Services layer abstraction** — All DB calls isolated in `/services/`, not scattered in components
2. **Triggers are portable** — PL/pgSQL is standard Postgres, works anywhere
3. **Auth is isolated** — Single `AuthContext.tsx` to modify
4. **Types are decoupled** — Domain types in `/types/`, not Supabase-specific

---

## Migration Phases

### Phase 1: Database (1-2 days)

**Goal:** Swap Supabase SDK for direct Postgres access

**Options:**
- Prisma (best DX, type-safe)
- Drizzle (lighter, SQL-like)
- Raw `pg` (most control)

**Steps:**
1. Set up Postgres elsewhere (Railway, Neon, or self-hosted)
2. Export schema: `supabase db dump --schema public > schema.sql`
3. Import to new database
4. Install ORM: `pnpm add prisma` or `pnpm add drizzle-orm`
5. Generate types from schema
6. Rewrite services:

```typescript
// Before (services/recipe.ts)
const recipes = getDbResponseDataOrThrow(
  await supabase.from("recipes").select("*").eq("user_id", userId)
)

// After (Prisma example)
const recipes = await prisma.recipe.findMany({
  where: { userId }
})

// After (Drizzle example)
const recipes = await db.select().from(recipes).where(eq(recipes.userId, userId))
```

**Files to modify:**
- `lib/supabase.ts` → `lib/db.ts`
- `services/recipe.ts`
- `services/meal.ts`
- `services/ingredient.ts`
- `services/shopping-list.ts`

**Triggers/Functions:** No changes needed — they live in Postgres, not the SDK.

---

### Phase 2: Backend API Layer (3-5 days)

**Goal:** Create a backend to handle auth, security, and business logic

**Recommended stack:**
- **Hono** — lightweight, great TypeScript support
- **tRPC** — if you want type-safe API calls
- **Express** — if you prefer familiarity

**New architecture:**
```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  React      │ HTTP │   Backend   │  SQL │  Postgres   │
│  Native     │─────▶│  (Hono)     │─────▶│             │
└─────────────┘      └─────────────┘      └─────────────┘
```

**RLS → Middleware translation:**

```typescript
// Before: RLS policy in 11_rls_policies.sql
// CREATE POLICY "Users can view own recipes" ON recipes
//   FOR SELECT USING (auth.uid() = user_id);

// After: Middleware in backend
const authMiddleware = async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  const user = await verifyJWT(token)
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  c.set('userId', user.id)
  await next()
}

// Route with security
app.get('/recipes', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const recipes = await prisma.recipe.findMany({
    where: { userId }  // Security enforced here now
  })
  return c.json(recipes)
})
```

**Client changes:**

```typescript
// Before (services/recipe.ts)
export const getRecipes = async (userId: string) => {
  return getDbResponseDataOrThrow(
    await supabase.from("recipes").select("*").eq("user_id", userId)
  )
}

// After
export const getRecipes = async () => {
  const response = await fetch(`${API_URL}/recipes`, {
    headers: { Authorization: `Bearer ${await getToken()}` }
  })
  return response.json()
}
```

---

### Phase 3: Auth (1-2 days)

**Goal:** Replace Supabase Auth with alternative provider

**Options:**

| Provider | Pros | Cons |
|----------|------|------|
| **Clerk** | Great DX, drop-in React Native SDK | $$ at scale |
| **Auth.js** | Open source, flexible | More setup |
| **Firebase Auth** | Generous free tier | Google lock-in |
| **Custom JWT** | Full control | Most work |

**Good news:** Already using `@react-native-google-signin/google-signin` directly.

**Migration steps:**
1. Set up new auth provider
2. Update `AuthContext.tsx`:

```typescript
// Before
const { error } = await supabase.auth.signInWithIdToken({
  provider: "google",
  token: idToken,
})

// After (example with custom backend)
const response = await fetch(`${API_URL}/auth/google`, {
  method: 'POST',
  body: JSON.stringify({ idToken })
})
const { accessToken, refreshToken } = await response.json()
await SecureStore.setItemAsync('accessToken', accessToken)
```

3. Update session management
4. Migrate existing users (export from Supabase, import to new provider)

---

### Phase 4: Storage (0.5 days)

**Goal:** Replace Supabase Storage with S3-compatible storage

**Options:**
- AWS S3
- Cloudflare R2 (S3-compatible, cheaper)
- DigitalOcean Spaces
- Self-hosted MinIO

**Steps:**
1. Set up S3 bucket with public read access
2. Create presigned URL endpoint in backend
3. Update `services/image.ts`:

```typescript
// Before
export const uploadImage = async (uri: string, path: string, mimeType: string) => {
  const fileBody = await new File(uri).arrayBuffer()
  getStorageResponseDataOrThrow(
    await supabase.storage.from(BUCKET_NAME).upload(path, fileBody, {
      upsert: true,
      contentType: mimeType,
    })
  )
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)
  return data.publicUrl
}

// After
export const uploadImage = async (uri: string, path: string, mimeType: string) => {
  // Get presigned upload URL from backend
  const { uploadUrl, publicUrl } = await fetch(`${API_URL}/storage/presign`, {
    method: 'POST',
    body: JSON.stringify({ path, mimeType })
  }).then(r => r.json())

  // Upload directly to S3
  const fileBody = await new File(uri).arrayBuffer()
  await fetch(uploadUrl, {
    method: 'PUT',
    body: fileBody,
    headers: { 'Content-Type': mimeType }
  })

  return publicUrl
}
```

4. Migrate existing images:
```bash
# One-time migration script
aws s3 sync supabase-export/ s3://toki-images/
# Update image_url in recipes table to new domain
```

---

## Data Migration Checklist

- [ ] Export Supabase schema: `supabase db dump --schema public`
- [ ] Export data: `supabase db dump --data-only`
- [ ] Export auth users: Supabase Dashboard → Authentication → Export
- [ ] Export storage files: `supabase storage download` or direct S3 sync
- [ ] Test import on staging database
- [ ] Update DNS/environment variables
- [ ] Run migration scripts for URL updates (storage paths)
- [ ] Verify triggers work in new environment
- [ ] Test all CRUD operations
- [ ] Test auth flow end-to-end

---

## When to Actually Migrate

Consider migration when:

| Trigger | Details |
|---------|---------|
| **Cost** | Supabase pricing doesn't fit at scale |
| **Complexity** | Logic too complex for triggers/RLS |
| **Compliance** | Need data in specific region/infrastructure |
| **Team** | Backend devs more comfortable with Node than PL/pgSQL |
| **Features** | Need capabilities Supabase doesn't offer |

**Don't migrate preemptively.** Supabase is a solid choice. This guide exists for planning, not urgency.

---

## Files Quick Reference

**Database layer:**
- `lib/supabase.ts` — Supabase client (replace entirely)
- `lib/database.types.ts` — Generated types (regenerate from new ORM)

**Services (rewrite implementations):**
- `services/recipe.ts`
- `services/meal.ts`
- `services/ingredient.ts`
- `services/shopping-list.ts`
- `services/image.ts`

**Auth:**
- `contexts/AuthContext.tsx` — Single file to update

**Database (portable as-is):**
- `supabase/schemas/07_functions.sql` — Standard PL/pgSQL
- `supabase/schemas/08_triggers.sql` — Standard Postgres triggers
- `supabase/schemas/11_rls_policies.sql` — Convert to backend middleware
