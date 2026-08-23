const categories = ["Sarees", "Suits & Sets", "Kurtis", "Dresses"];
const products = [
  { name: "Elegant Festive Saree", price: "₹2,499", old: "₹3,199" },
  { name: "Printed Anarkali Suit", price: "₹1,899", old: "₹2,399" },
  { name: "Premium Cotton Kurti", price: "₹899", old: "₹1,199" },
  { name: "Designer Party Dress", price: "₹1,699", old: "₹2,199" },
];

export default function Home() {
  return (
    <main>
      <div className="topbar">Free delivery on selected orders • Shop Arvind Dresses, Mandsaur</div>
      <header className="nav">
        <div className="container nav-inner">
          <a className="logo" href="#"><span>ARVIND</span> DRESSES</a>
          <nav className="nav-links">
            <a href="#shop">Shop</a><a href="#categories">Categories</a><a href="#offers">Offers</a><a href="#contact">Contact</a>
          </nav>
          <div className="nav-actions"><button className="icon-btn">Search</button><button className="icon-btn">Bag (0)</button></div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Mandsaur • Since 1990s</div>
            <h1>Style that feels uniquely yours.</h1>
            <p>Discover curated ethnic and contemporary fashion from Arvind Dresses. New arrivals, festive looks and everyday favourites — all in one place.</p>
            <a className="cta" href="#shop">Shop New Arrivals →</a>
          </div>
          <div className="hero-card"><div><strong>NEW COLLECTION</strong><br/><span className="muted">Festive 2026 • Coming soon</span></div></div>
        </div>
      </section>

      <section className="section" id="categories">
        <div className="container">
          <div className="section-head"><div><div className="eyebrow">Explore</div><h2>Shop by category</h2></div><span className="muted">Easy browsing for every occasion</span></div>
          <div className="categories">{categories.map((category) => <a className="category" href="#shop" key={category}><span className="muted">Collection</span><strong>{category}</strong></a>)}</div>
        </div>
      </section>

      <section className="section" id="shop">
        <div className="container">
          <div className="section-head"><div><div className="eyebrow">Featured</div><h2>Best sellers</h2></div><span className="muted">More products will be managed from Admin</span></div>
          <div className="products">{products.map((product) => <article className="product" key={product.name}><div className="product-image">Product photo</div><div className="product-body"><h3>{product.name}</h3><span className="price">{product.price}</span><span className="old">{product.old}</span></div></article>)}</div>
        </div>
      </section>

      <section className="section" id="offers">
        <div className="container"><div className="hero-card" style={{minHeight: 230}}><div><div className="eyebrow">Coming next</div><h2>Online shopping, local trust.</h2><span className="muted">Secure checkout • Order updates • Blue Dart delivery</span></div></div></div>
      </section>

      <footer className="footer" id="contact"><div className="container footer-grid"><div><div className="logo"><span>ARVIND</span> DRESSES</div><p className="muted">Your fashion destination in Mandsaur, now online.</p></div><div><strong>Customer Care</strong><p className="muted">Orders & support<br/>Delivery information<br/>Returns policy</p></div><div><strong>Visit Us</strong><p className="muted">Mandsaur, Madhya Pradesh<br/>India</p></div></div></footer>
    </main>
  );
}
