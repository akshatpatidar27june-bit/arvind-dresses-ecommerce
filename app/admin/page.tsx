'use client';

import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Product = {
  id: string;
  name: string;
  category_id: string | null;
  price: number;
  stock: number;
  sku: string | null;
  is_active: boolean;
};

export default function AdminPage() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', stock: '', sku: '', description: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user.email ?? null);
      setChecking(false);
      if (data.session) loadProducts();
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user.email ?? null);
      if (session) loadProducts();
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadProducts() {
    setLoadingProducts(true);
    const { data, error } = await supabase
      .from('products')
      .select('id,name,category_id,price,stock,sku,is_active')
      .order('created_at', { ascending: false });
    if (error) setMessage(error.message);
    else setProducts((data ?? []) as Product[]);
    setLoadingProducts(false);
  }

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
  }

  async function saveProduct(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const name = form.name.trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const { error } = await supabase.from('products').insert({
      name,
      slug,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      sku: form.sku.trim() || null,
      description: form.description.trim() || null,
      is_active: true,
    });
    if (error) setMessage(error.message);
    else {
      setMessage('Product added successfully.');
      setForm({ name: '', price: '', stock: '', sku: '', description: '' });
      setShowForm(false);
      await loadProducts();
    }
    setSaving(false);
  }

  async function toggleProduct(product: Product) {
    const { error } = await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id);
    if (error) setMessage(error.message);
    else loadProducts();
  }

  async function deleteProduct(id: string) {
    if (!window.confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) setMessage(error.message);
    else loadProducts();
  }

  if (checking) return <main className="admin-login"><div className="login-card"><p>Loading admin…</p></div></main>;

  if (!sessionEmail) {
    return (
      <main className="admin-login">
        <form className="login-card" onSubmit={signIn}>
          <div className="admin-brand"><span>ARVIND</span><small>DRESSES · MANDSAUR</small></div>
          <p className="eyebrow">PRIVATE STORE ADMIN</p>
          <h1>Welcome back.</h1>
          <p className="login-copy">Sign in to manage products, inventory and orders.</p>
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label>
          {loginError && <div className="form-error">{loginError}</div>}
          <button className="primary-btn full-btn" type="submit">Sign in</button>
          <small className="login-note">Admin access is controlled by Supabase Auth.</small>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>ARVIND</span><small>DRESSES · MANDSAUR</small></div>
        <nav><button className="nav-active">Products</button><button>Orders</button><button>Categories</button><button>Customers</button><button>Coupons</button><button>Settings</button></nav>
        <div className="admin-help">Signed in as<br /><strong>{sessionEmail}</strong><button onClick={() => supabase.auth.signOut()}>Sign out</button></div>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <div><p className="eyebrow">ARVIND DRESSES</p><h1>Products</h1></div>
          <button className="primary-btn" onClick={() => setShowForm(true)}>+ Add product</button>
        </header>

        {message && <div className="admin-message">{message}</div>}
        <div className="panel">
          <div className="panel-head"><div><h2>Product catalogue</h2><p>Products here are stored in your Arvind Dresses Supabase database.</p></div><button className="text-btn" onClick={loadProducts}>Refresh</button></div>
          {loadingProducts ? <p className="empty-copy">Loading products…</p> : products.length === 0 ? <div className="empty-panel"><div className="empty-icon">✦</div><h2>No products yet</h2><p>Add your first clothing product to make it available to the storefront.</p><button className="primary-btn" onClick={() => setShowForm(true)}>Add first product</button></div> : (
            <div className="product-table"><div className="table-head"><span>Product</span><span>SKU</span><span>Price</span><span>Stock</span><span>Status</span><span>Actions</span></div>
              {products.map((p) => <div className="table-row" key={p.id}><strong>{p.name}</strong><span>{p.sku || '—'}</span><span>₹{Number(p.price).toLocaleString('en-IN')}</span><span>{p.stock}</span><span className={p.is_active ? 'success' : 'danger'}>{p.is_active ? 'Active' : 'Hidden'}</span><span className="row-actions"><button onClick={() => toggleProduct(p)}>{p.is_active ? 'Hide' : 'Publish'}</button><button onClick={() => deleteProduct(p.id)}>Delete</button></span></div>)}
            </div>
          )}
        </div>
      </section>

      {showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}><form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={saveProduct}>
        <div className="panel-head"><div><h2>Add product</h2><p>Start with the essential product information.</p></div><button type="button" className="close-btn" onClick={() => setShowForm(false)}>×</button></div>
        <div className="form-grid">
          <label>Product name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Banarasi Silk Saree" required /></label>
          <label>SKU<input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="ARD-SAR-001" /></label>
          <label>Price<input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="2499" required /></label>
          <label>Stock<input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="20" required /></label>
          <label className="full">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Fabric, fit, occasion, care details…" /></label>
        </div>
        <button className="primary-btn full-btn" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</button>
      </form></div>}
    </main>
  );
}
