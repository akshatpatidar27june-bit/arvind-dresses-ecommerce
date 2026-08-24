-- When an order item contains a size, keep that size's inventory in sync.
-- The checkout payload now preserves size/color on each order item.
create or replace function sync_product_size_stock_after_order_item()
returns trigger
language plpgsql
as $$
begin
  if new.product_id is not null and new.size is not null and btrim(new.size) <> '' then
    update product_size_variants
      set stock = greatest(0, stock - new.quantity), updated_at = now()
      where product_id = new.product_id and size = new.size;

    update products p
      set stock = coalesce((select sum(stock) from product_size_variants s where s.product_id = p.id), 0),
          updated_at = now()
      where p.id = new.product_id;
  end if;
  return new;
end;
$$;

drop trigger if exists order_item_size_stock_sync on order_items;
create trigger order_item_size_stock_sync
after insert on order_items
for each row execute function sync_product_size_stock_after_order_item();
