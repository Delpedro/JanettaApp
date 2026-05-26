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
    edit: 'Edit',
    deleteConfirm: 'Delete this product? This cannot be undone.',
    deleteError: 'Failed to delete product.',
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
    edit: 'Edytuj',
    deleteConfirm: 'Usunąć ten produkt? Nie można cofnąć.',
    deleteError: 'Nie udało się usunąć produktu.',
  },
}

export default function AdminProductsPage() {
  const { lang } = useOutletContext()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const navigate = useNavigate()
  const tx = t[lang]

  useEffect(() => {
    fetch('/api/admin/products', { credentials: 'include', cache: 'no-store' })
      .then(res => {
        if (res.status === 401) { navigate('/admin/login'); return null }
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => { if (data) setProducts(data) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [navigate])

  async function handleDelete(id) {
    if (!window.confirm(tx.deleteConfirm)) return
    setDeletingId(id)
    setDeleteError('')
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', credentials: 'include' })
      if (res.status === 401) { navigate('/admin/login'); return }
      if (!res.ok) throw new Error()
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch {
      setDeleteError(tx.deleteError)
    } finally {
      setDeletingId(null)
    }
  }

  async function togglePublished(id, currentValue) {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, published: !currentValue } : p)
    )

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
      {deleteError && <p className="admin-status admin-status--error">{deleteError}</p>}

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                className={`admin-toggle${p.published ? ' admin-toggle--on' : ''}`}
                onClick={() => togglePublished(p.id, p.published)}
              >
                {p.published ? tx.visible : tx.hidden}
              </button>
              <button
                className="admin-toggle"
                onClick={() => navigate(`/admin/edit-product/${p.id}`)}
              >
                {tx.edit}
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                disabled={deletingId === p.id}
                style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '0.85rem', padding: '0.2rem 0.4rem' }}
              >
                {deletingId === p.id ? '…' : '✕'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
