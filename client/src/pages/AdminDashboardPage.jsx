import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminDashboardPage.css'

const t = {
  en: {
    products: 'Products',
    loading: 'Loading…',
    error: 'Could not load products.',
    empty: 'No products yet.',
    signOut: 'Sign out',
    madeToOrder: 'Made to order',
    inStock: 'in stock',
    visible: 'Visible',
    hidden: 'Hidden',
    addUser: 'Add admin user',
    userEmail: 'Email',
    userPassword: 'Password',
    createUser: 'Create',
    userCreated: 'User created.',
    userError: 'Failed to create user.',
    userExists: 'Email already in use.',
    shortPassword: 'Password must be at least 8 characters.',
  },
  pl: {
    products: 'Produkty',
    loading: 'Ładowanie…',
    error: 'Nie udało się załadować produktów.',
    empty: 'Brak produktów.',
    signOut: 'Wyloguj',
    madeToOrder: 'Na zamówienie',
    inStock: 'szt.',
    visible: 'Widoczny',
    hidden: 'Ukryty',
    addUser: 'Dodaj administratora',
    userEmail: 'Email',
    userPassword: 'Hasło',
    createUser: 'Utwórz',
    userCreated: 'Użytkownik utworzony.',
    userError: 'Nie udało się utworzyć użytkownika.',
    userExists: 'Email jest już zajęty.',
    shortPassword: 'Hasło musi mieć co najmniej 8 znaków.',
  },
}

export default function AdminDashboardPage() {
  const [lang, setLang] = useState('en')
  const [email, setEmail] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [userMsg, setUserMsg] = useState('')
  const [userSaving, setUserSaving] = useState(false)
  const navigate = useNavigate()
  const tx = t[lang]

  const getToken = useCallback(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) { navigate('/admin/login'); return null }
    return token
  }, [navigate])

  useEffect(() => {
    const token = getToken()
    if (!token) return
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setEmail(payload.email || '')
    } catch {
      navigate('/admin/login')
      return
    }

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
  }, [navigate, getToken])

  function handleLogout() {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

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

  async function handleCreateUser(e) {
    e.preventDefault()
    const token = getToken()
    if (!token) return
    setUserMsg('')
    setUserSaving(true)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      })
      const data = await res.json()
      if (res.status === 401) { navigate('/admin/login'); return }
      if (res.status === 409) { setUserMsg(tx.userExists); return }
      if (res.status === 400 && data.error?.includes('8')) { setUserMsg(tx.shortPassword); return }
      if (!res.ok) { setUserMsg(tx.userError); return }
      setUserMsg(tx.userCreated)
      setNewEmail('')
      setNewPassword('')
    } catch {
      setUserMsg(tx.userError)
    } finally {
      setUserSaving(false)
    }
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <a href="/" className="admin-header-title">← Shop</a>
        <div className="admin-lang-toggle">
          <button className={`admin-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
          <button className={`admin-lang-btn${lang === 'pl' ? ' active' : ''}`} onClick={() => setLang('pl')}>PL</button>
        </div>
        <span className="admin-header-email">{email}</span>
        <button className="admin-signout-btn" onClick={handleLogout}>{tx.signOut}</button>
      </header>

      <main className="admin-main">
        <h2 className="admin-section-title">{tx.products}</h2>

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

        <section className="admin-users-section">
          <h2 className="admin-section-title">{tx.addUser}</h2>
          <form className="admin-user-form" onSubmit={handleCreateUser}>
            <input
              className="admin-user-input"
              type="email"
              placeholder={tx.userEmail}
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              required
            />
            <input
              className="admin-user-input"
              type="password"
              placeholder={tx.userPassword}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <button className="admin-user-btn" type="submit" disabled={userSaving}>
              {tx.createUser}
            </button>
          </form>
          {userMsg && (
            <p className={`admin-status${userMsg === tx.userCreated ? '' : ' admin-status--error'}`}>
              {userMsg}
            </p>
          )}
        </section>
      </main>
    </div>
  )
}
