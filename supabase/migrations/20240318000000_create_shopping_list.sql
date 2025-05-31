create type unit_type as enum (
  'g',
  'kg',
  'l',
  'cl',
  'ml',
  'tsp',
  'tbsp',
  'cup',
  'piece',
  'pinch',
  'bunch',
  'clove',
  'can',
  'package',
  'slice',
  'totaste'
);

create type shopping_item_category as enum (
  'Autre',
  'Fruits & Légumes',
  'Viande',
  'Poisson',
  'Épices & Condiments',
  'Céréales',
  'Produits laitiers',
  'Dessert',
  'Œufs & Produits frais'
);

create table shopping_list_items (
  id bigint primary key generated always as identity,
  name text not null,
  quantity float,
  unit unit_type,
  category shopping_item_category not null default 'Autre',
  checked boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable Row Level Security
alter table
  shopping_list_items enable row level security;

-- Create a policy that allows all operations for authenticated users
create policy "Allow all operations for authenticated users" on shopping_list_items for all to authenticated using (true) with check (true);

-- Create a policy that allows read-only access for anonymous users
create policy "Allow read-only access for anonymous users" on shopping_list_items for
select
  to anon using (true);