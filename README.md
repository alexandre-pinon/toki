# Toki

A meal planning app built with Expo and Supabase. Plan meals for the week, import recipes from the web, and get the grocery list built automatically.

## Features

- Shopping list that builds itself from planned meals, with quantity aggregation across recipes and units
- Meal planning with per-recipe servings and dates
- Recipes with ingredients, instructions, times and photos
- Recipe import from Marmiton
- Ingredient catalog shared across users
- Statistics on cooked history
- Offline support with local storage and automatic sync
- Google sign-in

## Setup

1. Create a Supabase project at https://supabase.com
2. Apply the migrations from `supabase/migrations`
3. Create `.env` (and `.env.production` for release builds) with:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id
   ```
4. Install dependencies:
   ```bash
   pnpm install
   ```
5. Start the development server:
   ```bash
   pnpm start
   ```

## Builds

EAS handles builds and OTA updates, driven by the `APP_PROFILE` env var (`dev`, `preview`, `prod`), which selects the app name and bundle id in `app.config.js`. See `eas.json` for the matching profiles and channels.

## Tech Stack

- [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev)
- [Supabase](https://supabase.com)
- [TypeScript](https://www.typescriptlang.org)
