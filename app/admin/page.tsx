'use client';

import { useState } from 'react';

const products = [
  { name: 'Royal Silk Saree', category: 'Sarees', price: 2499, stock: 18, status: 'Active' },
  { name: 'Printed Anarkali Suit', category: 'Suits', price: 1899, stock: 12, status: 'Active' },
  { name: 'Embroidered Kurti', category: 'Kurtis', price: 999, stock: 0, status: 'Out of stock' },
];

export default function AdminPage() {
  const [tab, setTab] = useState('Overview');
  const [showProductForm, setShowProductForm] = useState(false);

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>ARVIND</span><small>DRESSES · MANDSAUR</small></div>
        <nav>
          {['Overview', 'Products', 'Orders', 'Categories', 'Customers', 'Coupons', 'Settings'].map((item) => (
            <button className={tab === item ? 'nav-active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>
          ))}
        </nav>
        <div className="admin-help">Store is ready to connect with Supabase.<br /><strong>Admin workspace</strong></div>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <div><p className="eyebrow">ARVIND DRESSES</p><h1>{tab}</h1></div>
          <div className="admin-user"><span>AD</span><div><strong>Store Admin</strong><small>Administrator</small></div></div>
        </header>

        {tab === 'Overview' && <>
          <div className="stat-grid">
            <Stat title="Total Orders" value="128" note="+14% this month" />
            <Stat title="Revenue" value="₹2,84,650" note="+18% this month" />
            <Stat title="Products" value="246" note="12 low stock" />
            <Stat title="Customers" value="94" note="8 new this week" />
          </div>
          <div className="admin-grid">
            <div className="panel"><div className="panel-head"><div><h2>Recent orders</h2><p>Latest customer activity</p></div><button className="text-btn" onClick={() => setTab('Orders')}>View all</button></div>
              {['#AD1048 · Priya Sharma · ₹4,998 · Paid', '#AD1047 · Riya Jain · ₹2,499 · Processing', '#AD1046 · Neha Patidar · ₹1,899 · Shipped'].map((o) => <div className="order-row" key={o}><span className="order-dot" />{o}</div>)}
            </div>
            <div className="panel"><div className="panel-head"><div><h2>Inventory alerts</h2><p>Products that need attention</p></div></div>
              <div className="alert-row"><strong>Embroidered Kurti</strong><span className="danger">Out of stock</span></div>
              <div className="alert-row"><strong>Festive Silk Saree</strong><span className="warning">3 left</span></div>
              <div className="alert-row"><strong>Cotton Co-ord Set</strong><span className="warning">5 left</span></div>
            </div>
          </div>
        </>}

        {tab === 'Products' && <div className="panel"><div className="panel-head"><div><h2>Product catalogue</h2><p>Add and manage clothes shown on the website.</p></div><button className="primary-btn" onClick={() => setShowProductForm(true)}>+ Add product</button></div>
          <div className="product-table"><div className="table-head"><span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Status</span></div>
            {products.map((p) => <div className="table-row" key={p.name}><strong>{p.name}</strong><span>{p.category}</span><span>₹{p.price.toLocaleString('en-IN')}</span><span>{p.stock}</span><span className={p.stock ? 'success' : 'danger'}>{p.status}</span></div>)}
          </div>
        </div>}

        {['Orders', 'Categories', 'Customers', 'Coupons', 'Settings'].includes(tab) && <div className="panel empty-panel"><div className="empty-icon">✦</div><h2>{tab} module</h2><p>This module is scaffolded and ready for the Supabase-backed implementation.</p><button className="primary-btn" onClick={() => setTab('Products')}>Manage products</button></div>}
      </section>

      {showProductForm && <div className="modal-backdrop" onClick={() => setShowProductForm(false)}><div className="modal" onClick={(e) => e.stopPropagation()}><div className="panel-head"><div><h2>Add product</h2><p>Product details will be stored in Supabase.</p></div><button className="close-btn" onClick={() => setShowProductForm(false)}>×</button></div><div className="form-grid"><label>Product name<input placeholder="e.g. Banarasi Silk Saree" /></label><label>Category<select><option>Sarees</option><option>Suits</option><option>Kurtis</option><option>Dresses</option></select></label><label>Price<input type="number" placeholder="2499" /></label><label>Stock<input type="number" placeholder="20" /></label><label className="full">Description<textarea placeholder="Describe the product..." /></label><label className="full">Product images<input type="file" multiple accept="image/*" /></label></div><button className="primary-btn full-btn" onClick={() => setShowProductForm(false)}>Save product</button></div></div>}
    </main>
  );
}

function Stat({ title, value, note }: { title: string; value: string; note: string }) {
  return <div className="stat-card"><p>{title}</p><strong>{value}</strong><span>{note}</span></div>;
}
