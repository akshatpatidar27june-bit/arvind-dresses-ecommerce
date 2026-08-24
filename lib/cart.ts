export type CartItem = {
  id: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  image: string | null;
  sku: string | null;
  quantity: number;
  stock: number;
  size?: string | null;
  color?: string | null;
};

const KEY = "arvind-dresses-cart";
export function getCart(): CartItem[] { if (typeof window === "undefined") return []; try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } }
export function saveCart(items: CartItem[]) { localStorage.setItem(KEY, JSON.stringify(items)); window.dispatchEvent(new Event("arvind-cart-updated")); }
export function addToCart(product: Omit<CartItem, "quantity">, quantity = 1) { const items=getCart(); const existing=items.find(i=>i.id===product.id&&i.size===product.size&&i.color===product.color); if(existing) existing.quantity=Math.min(existing.quantity+quantity,product.stock); else items.push({...product,quantity:Math.min(quantity,product.stock)}); saveCart(items); }
export function cartCount() { return getCart().reduce((sum,item)=>sum+item.quantity,0); }
export function cartTotal() { return getCart().reduce((sum,item)=>sum+item.price*item.quantity,0); }
