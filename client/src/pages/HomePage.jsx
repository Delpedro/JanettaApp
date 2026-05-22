import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'

export default function HomePage({ lang }) {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/products')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load products')
        return r.json()
      })
      .then(setProducts)
      .catch(() => setError(true))
  }, [])

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

        {error ? (
          <p className="error-message">
            {lang === 'pl' ? 'Nie udało się załadować produktów.' : 'Could not load products.'}
          </p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} lang={lang} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
