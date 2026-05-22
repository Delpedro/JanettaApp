import { useState } from 'react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import { products } from './data/mockProducts'
import './App.css'

export default function App() {
  const [lang, setLang] = useState('pl')

  return (
    <>
      <Header lang={lang} setLang={setLang} />

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

      <footer className="site-footer">
        <p>© 2026 Janetta</p>
      </footer>
    </>
  )
}
