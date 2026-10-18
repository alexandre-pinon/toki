# Toki

A shopping list app built with Expo and Supabase.

## Setup

1. Create a new Supabase project at https://supabase.com
2. Run the SQL migrations in the `supabase/migrations` directory
3. Get your Supabase URL and anon key from the project settings
4. Create a `.env` file in the root directory with the following variables:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Install dependencies:
   ```bash
   pnpm install
   ```
6. Start the development server:
   ```bash
   pnpm start
   ```

## Features

- Create, read, update, and delete shopping list items
- Organize items by categories
- Support for different units of measurement
- Real-time updates with Supabase
- Offline support with local storage

## Tech Stack

- [Expo](https://expo.dev)
- [React Native](https://reactnative.dev)
- [Supabase](https://supabase.com)
- [TypeScript](https://www.typescriptlang.org)
- [Expo Router](https://docs.expo.dev/router/introduction/)
