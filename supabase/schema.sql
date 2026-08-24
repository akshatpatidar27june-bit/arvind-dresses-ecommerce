-- Arvind Dresses e-commerce database
-- Run this in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  category_id uuid references categories(id) on delete set null,
  price numeric(12,2) not null default 0,
  compare_at_price numeric(12,2),
  sku text unique,
  stock integer not null default 0,
  sizes text[] default '{}',
  colors text[] default '{}',
  images text[] default '{}',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists product_size_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(product_id, size)
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null,
  phone text not null,
  address_line text not null,
  city text not null,
  state text not null default 'Madhya Pradesh',
  pincode text not null,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  shipping_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  order_status text not null default 'pending' check (order_status in ('pending','confirmed','packed','shipped','delivered','cancelled')),
  payment_reference text,
  courier text default 'Blue Dart',
  tracking_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  sku text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  size text,
  color text,
  created_at timestamptz default now()
);

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  discount_value numeric(12,2) not null,
  minimum_order numeric(12,2) default 0,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists products_category_idx on products(category_id);
create index if not exists products_active_idx on products(is_active);
create index if not exists product_size_variants_product_idx on product_size_variants(product_id);
create index if not exists orders_status_idx on orders(order_status);
create index if not exists orders_created_idx on orders(created_at desc);
create index if not exists order_items_order_idx on order_items(order_id);

insert into categories (name, slug) values
  ('Sarees', 'sarees'),
  ('Suits', 'suits'),
  ('Kurtis', 'kurtis'),
  ('Dresses', 'dresses'),
  ('Lehengas', 'lehengas'),
  ('Kids Wear', 'kids-wear')
on conflict (slug) do nothing;
