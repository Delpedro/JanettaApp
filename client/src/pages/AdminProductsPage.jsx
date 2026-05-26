import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

const t = {
  en: {
    title: 'Products',
    loading: 'Loading…',
    error: 'Could not load products.',
    empty: 'No products yet.',
    madeToOrder: 'Made to order',
    inStock: 'in stock',
    visible: 'Visible',
    hidden: 'Hidden',
  },
  pl: {
    title: 'Produkty',
    loading: 'Ładowanie…',
    error: 'Nie udało się załadować produktów.',
    empty: 'Brak produktów.',
    madeToOrder: 'Na zamówienie',
    inStock: 'szt.',
    visible: 'Widoczny',
    hidden: 'Ukryty',
  },
}

export default function AdminProductsPage() {
  const { getToken, lang } = useOutletContext()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const tx = t[lang]

  useEffect(() => {
    const token = getToken()
    if (!token) return

    fetch('/api/admin/products', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.status === 401) { navigate('/admin/login'); return null }
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => { if (data) setProducts(data) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [getToken, navigate])

  async function togglePublished(id, currentValue) {
    const token = getToken()
    if (!token) return

    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, published: !currentValue } : p)
    )

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: !currentValue }),
      })
      if (res.status === 401) { navigate('/admin/login'); return }
      if (!res.ok) throw new Error()
    } catch {
      setProducts(prev =>
        prev.map(p => p.id === id ? { ...p, published: currentValue } : p)
      )
    }
  }

  return (
    <>
      <h2 className="admin-section-title">{tx.title}</h2>

      {loading && <p className="admin-status">{tx.loading}</p>}
      {error && <p className="admin-status admin-status--error">{tx.error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="admin-status">{tx.empty}</p>
      )}

      <ul className="admin-product-list">
        {products.map(p => (
          <li key={p.id} className={`admin-product-row${p.published ? '' : ' admin-product-row--hidden'}`}>
            <div className="admin-product-info">
              <span className="admin-product-name">{lang === 'pl' ? p.name_pl : p.name_en}</span>
              <span className="admin-product-name-sub">{lang === 'pl' ? p.name_en : p.name_pl}</span>
              <span className="admin-product-meta">
                {Number(p.price).toFixed(2)} PLN
                {' · '}
                {p.madeToOrder ? tx.madeToOrder : `${p.stockQty ?? 0} ${tx.inStock}`}
              </span>
            </div>
            <button
              className={`admin-toggle${p.published ? ' admin-toggle--on' : ''}`}
              onClick={() => togglePublished(p.id, p.published)}
            >
              {p.published ? tx.visible : tx.hidden}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
