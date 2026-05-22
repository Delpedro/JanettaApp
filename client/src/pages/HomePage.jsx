import ProductCard from '../components/ProductCard'
import { products } from '../data/mockProducts'

export default function HomePage({ lang }) {
  return (
    <main className="main">
      <section className="hero-banner">
        <h1 className="hero-banner__title">
          {lang === 'pl' ? 'Witaj w moim sklepie' : 'Welcome to my shop'}
        </h1>
        <p className="hero-banner__sub">
          {lang === 'pl'
            ? 'Ręcznie robione przedmioty z miłością i dbałością o każdy detal.'
            : 'Handcrafted items made with love and care in every detail.'}
        </p>
      </section>

      <section className="product-grid-section">
        <h2 className="section-title">
          {lang === 'pl' ? 'Nasze produkty' : 'Our products'}
        </h2>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} lang={lang} />
          ))}
        </div>
      </section>
    </main>
  )
}
