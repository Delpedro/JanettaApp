import { useState, useEffect } from 'react'
import { useNavigate, Outlet, NavLink } from 'react-router-dom'
import './AdminShell.css'

const t = {
  en: { shop: '← Shop', products: 'Products', addProduct: 'Add Product', users: 'Users', help: 'Help', signOut: 'Sign out' },
  pl: { shop: '← Sklep', products: 'Produkty', addProduct: 'Dodaj produkt', users: 'Użytkownicy', help: 'Pomoc', signOut: 'Wyloguj' },
}

export default function AdminShell() {
  const [lang, setLang] = useState('en')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const tx = t[lang]

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (res.status === 401) { navigate('/admin/login'); return null }
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        if (!data) return
        if (data.forcePasswordReset) { navigate('/admin/change-password'); return }
        setEmail(data.email || '')
      })
      .catch(() => navigate('/admin/login'))
  }, [navigate])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    navigate('/admin/login')
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-top">
          <a href="/" className="admin-header-back">{tx.shop}</a>
          <div className="admin-header-right">
            <div className="admin-lang-toggle">
              <button className={`admin-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
              <button className={`admin-lang-btn${lang === 'pl' ? ' active' : ''}`} onClick={() => setLang('pl')}>PL</button>
            </div>
            <span className="admin-header-email">{email}</span>
            <button className="admin-signout-btn" onClick={handleLogout}>{tx.signOut}</button>
          </div>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>{tx.products}</NavLink>
          <NavLink to="/admin/add-product" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>{tx.addProduct}</NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>{tx.users}</NavLink>
          <NavLink to="/admin/help" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>{tx.help}</NavLink>
        </nav>
      </header>
      <main className="admin-main">
        <Outlet context={{ lang }} />
      </main>
    </div>
  )
}
