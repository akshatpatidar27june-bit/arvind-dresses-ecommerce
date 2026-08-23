"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { addToCart } from "../../../lib/cart";

type Product = { id:string; name:string; slug:string; description:string|null; price:number; compare_at_price:number|null; sku:string|null; stock:number; sizes:string[]|null; colors:string[]|null; images:string[]|null };

export default function ProductPage(){
 const {id}=useParams<{id:string}>(); const router=useRouter(); const [p,setP]=useState<Product|null>(null); const [loading,setLoading]=useState(true); const [qty,setQty]=useState(1); const [message,setMessage]=useState("");
 useEffect(()=>{(async()=>{const {data}=await supabase.from("products").select("id,name,slug,description,price,compare_at_price,sku,stock,sizes,colors,images").eq("id",id).single();setP(data as Product|null);setLoading(false)})()},[id]);
 if(loading)return <main className="detail-page"><div className="container"><p className="muted">Loading product…</p></div></main>;
 if(!p)return <main className="detail-page"><div className="container"><h1>Product not found</h1><a className="text-link" href="/">Back to shop →</a></div></main>;
 const image=p.images?.[0]||null; const discount=p.compare_at_price&&p.compare_at_price>p.price?Math.round((1-p.price/p.compare_at_price)*100):0;
 function add(){if(!p.stock)return;addToCart({id:p.id,name:p.name,price:Number(p.price),compare_at_price:p.compare_at_price?Number(p.compare_at_price):null,image,sku:p.sku,stock:p.stock},qty);setMessage("Added to your bag");}
 return <main className="detail-page"><div className="container"><a className="back-link" href="/">← Back to shop</a><div className="detail-grid"><div className="detail-image">{image?<img src={image} alt={p.name}/>:<div className="product-placeholder"><span>ARVIND</span><small>PRODUCT IMAGE</small></div>}</div><div className="detail-copy"><div className="eyebrow">ARVIND DRESSES</div><h1>{p.name}</h1><div className="detail-price"><strong>₹{Number(p.price).toLocaleString("en-IN")}</strong>{p.compare_at_price&&<><del>₹{Number(p.compare_at_price).toLocaleString("en-IN")}</del>{discount>0&&<span>{discount}% OFF</span>}</>}</div><div className={p.stock>0?"stock good":"stock bad"}>{p.stock>0?`${p.stock} available`:"Currently sold out"}</div>{p.description&&<p className="detail-description">{p.description}</p>}{p.sizes?.length?<div className="option"><b>Size</b><div>{p.sizes.map(s=><button key={s}>{s}</button>)}</div></div>:null}{p.colors?.length?<div className="option"><b>Colour</b><div>{p.colors.map(c=><button key={c}>{c}</button>)}</div></div>:null}<div className="buy-row"><div className="qty"><button onClick={()=>setQty(Math.max(1,qty-1))}>−</button><span>{qty}</span><button onClick={()=>setQty(Math.min(p.stock,qty+1))}>+</button></div><button className="cta buy-btn" disabled={!p.stock} onClick={add}>{p.stock?"Add to bag":"Sold out"} <span>→</span></button></div>{message&&<div className="cart-message">✓ {message} <button onClick={()=>router.push("/cart")}>View bag →</button></div>}<div className="detail-meta"><span>SKU: {p.sku||"—"}</span><span>Easy ordering • Reliable delivery</span></div></div></div></div></main>;
}
