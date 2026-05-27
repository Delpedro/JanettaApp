import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

const STATUS_LABELS = {
  en: { paid: 'Paid', payment_pending: 'Awaiting payment', failed: 'Failed', pending: 'Pending' },
  pl: { paid: 'Opłacone', payment_pending: 'Oczekuje na płatność', failed: 'Nieudane', pending: 'Oczekujące' },
}

const STATUS_COLORS = {
  paid: { background: '#e8f5e9', color: '#2e7d32' },
  payment_pending: { background: '#fff8e1', color: '#f57f17' },
  failed: { background: '#fdecea', color: '#c62828' },
  pending: { background: '#f5f5f5', color: '#616161' },
}

const t = {
  en: {
    title: 'Orders',
    loading: 'Loading…',
    error: 'Could not load orders.',
    empty: 'No orders yet.',
    customer: 'Customer',
    address: 'Address',
    items: 'Items',
    total: 'Total',
    status: 'Status',
    date: 'Date',
    madeToOrder: 'made to order',
  },
  pl: {
    title: 'Zamówienia',
    loading: 'Ładowanie…',
    error: 'Nie udało się załadować zamówień.',
    empty: 'Brak zamówień.',
    customer: 'Klient',
    address: 'Adres',
    items: 'Produkty',
    total: 'Łącznie',
    status: 'Status',
    date: 'Data',
    madeToOrder: 'na zamówienie',
  },
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminOrdersPage() {
  const { lang } = useOutletContext()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()
  const tx = t[lang]
  const statusLabels = STATUS_LABELS[lang]

  useEffect(() => {
    fetch('/api/admin/orders', { credentials: 'include', cache: 'no-store' })
      .then(res => {
        if (res.status === 401) { navigate('/admin/login'); return null }
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => { if (data) setOrders(data) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [navigate])

  function toggleExpand(id) {
    setExpanded(prev => (prev === id ? null : id))
  }

  return (
    <>
      <h2 className="admin-section-title">{tx.title}</h2>

      {loading && <p className="admin-status">{tx.loading}</p>}
      {error && <p className="admin-status admin-status--error">{tx.error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="admin-status">{tx.empty}</p>
      )}

      <ul className="admin-product-list" style={{ gap: '0.5rem' }}>
        {orders.map(order => {
          const isOpen = expanded === order.id
          const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.pending
          return (
            <li
              key={order.id}
              className="admin-product-row"
              style={{ flexDirection: 'column', alignItems: 'stretch', cursor: 'pointer', padding: '0.75rem 1rem' }}
              onClick={() => toggleExpand(order.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                  <span style={{ fontWeight: 600, color: '#8b5e3c', flexShrink: 0 }}>#{order.id}</span>
                  <span style={{ fontSize: '0.9rem', color: '#3d2b1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.customerName}
                  </span>
                  <span
                    style={{
                      ...statusStyle,
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                  <span style={{ fontWeight: 600, color: '#3d2b1f' }}>{Number(order.total).toFixed(2)} zł</span>
                  <span style={{ fontSize: '0.8rem', color: '#9e7b6b' }}>{formatDate(order.createdAt)}</span>
                  <span style={{ color: '#9e7b6b', fontSize: '0.8rem' }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {isOpen && (
                <div
                  style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f0e8df' }}
                  onClick={e => e.stopPropagation()}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#9e7b6b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tx.customer}</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#3d2b1f' }}>{order.customerName}</p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b4c3b' }}>{order.customerEmail}</p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#9e7b6b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tx.address}</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#3d2b1f', lineHeight: 1.5 }}>
                        {order.address.street}<br />
                        {order.address.postal} {order.address.city}
                      </p>
                    </div>
                  </div>

                  <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: '#9e7b6b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tx.items}</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {order.items.map((item, i) => (
                      <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '4px 0', borderBottom: '1px solid #f0e8df', color: '#3d2b1f' }}>
                        <span>{lang === 'pl' ? item.name_pl : item.name_en} × {item.qty}</span>
                        <span style={{ color: '#8b5e3c' }}>{(item.price_snapshot * item.qty).toFixed(2)} zł</span>
                      </li>
                    ))}
                  </ul>
                  <p style={{ margin: '8px 0 0', textAlign: 'right', fontWeight: 700, color: '#3d2b1f' }}>
                    {tx.total}: {Number(order.total).toFixed(2)} zł
                  </p>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}
