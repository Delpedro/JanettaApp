import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductDetailPage({ lang }) {
  const { id } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (r.status === 404) { setError('notfound'); return null }
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((data) => { if (data) setProduct(data) })
      .catch(() => setError('error'))
  }, [id])

  if (error === 'notfound') {
    return (
      <main className="main">
        <div className="not-found">
          <p>{lang === 'pl' ? 'Produkt nie znaleziony.' : 'Product not found.'}</p>
          <Link to="/" className="back-link">
            {lang === 'pl' ? '← Wróć do sklepu' : '← Back to shop'}
          </Link>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="main">
        <div className="not-found">
          <p>{lang === 'pl' ? 'Nie udało się załadować produktu.' : 'Could not load product.'}</p>
          <Link to="/" className="back-link">
            {lang === 'pl' ? '← Wróć do sklepu' : '← Back to shop'}
          </Link>
        </div>
      </main>
    )
  }

  if (!product) return null

  const name = lang === 'pl' ? product.name_pl : product.name_en
  const description = lang === 'pl' ? product.description_pl : product.description_en

  const badge = product.madeToOrder
    ? { text: lang === 'pl' ? 'Na zamówienie' : 'Made to order', cls: 'badge--order' }
    : product.inStock
    ? { text: lang === 'pl' ? 'Dostępny' : 'In stock', cls: 'badge--stock' }
    : { text: lang === 'pl' ? 'Niedostępny' : 'Out of stock', cls: 'badge--empty' }

  const canBuy = product.inStock || product.madeToOrder

  return (
    <main className="main">
      <Link to="/" className="back-link">
        {lang === 'pl' ? '← Wróć do sklepu' : '← Back to shop'}
      </Link>

      <div className="product-detail">
        <div className="product-detail__image-wrap">
          <img src={product.image} alt={name} className="product-detail__image" />
        </div>

        <div className="product-detail__info">
          <span className={`badge badge--inline ${badge.cls}`}>{badge.text}</span>
          <h1 className="product-detail__name">{name}</h1>
          <p className="product-detail__price">{product.price} zł</p>
          <p className="product-detail__desc">{description}</p>

          {product.inStock && !product.madeToOrder && (
            <p className="product-detail__stock">
              {lang === 'pl'
                ? `Dostępna ilość: ${product.stockQty} szt.`
                : `Available: ${product.stockQty} in stock`}
            </p>
          )}

          <button
            className="btn btn--primary btn--large"
            disabled={!canBuy}
            onClick={() => canBuy && addItem(product)}
          >
            {canBuy
              ? lang === 'pl' ? 'Dodaj do koszyka' : 'Add to cart'
              : lang === 'pl' ? 'Niedostępny' : 'Out of stock'}
          </button>
        </div>
      </div>
    </main>
  )
}
