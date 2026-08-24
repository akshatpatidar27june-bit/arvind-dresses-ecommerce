-- Per-size inventory for clothing products.
-- Run this once in the Supabase SQL editor before using the Size Inventory admin page.
create table if not exists product_size_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(product_id, size)
);
create index if not exists product_size_variants_product_idx on product_size_variants(product_id);
