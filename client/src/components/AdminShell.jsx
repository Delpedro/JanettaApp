import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Outlet, NavLink } from 'react-router-dom'
import './AdminShell.css'

const t = {
  en: { shop: '← Shop', products: 'Products', addProduct: 'Add Product', users: 'Users', signOut: 'Sign out' },
  pl: { shop: '← Sklep', products: 'Produkty', addProduct: 'Dodaj produkt', users: 'Użytkownicy', signOut: 'Wyloguj' },
}

export default function AdminShell() {
  const [lang, setLang] = useState('en')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const tx = t[lang]

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) { navigate('/admin/login'); return }
    if (localStorage.getItem('adminForceReset') === '1') { navigate('/admin/change-password'); return }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setEmail(payload.email || '')
    } catch {
      localStorage.removeItem('adminToken')
      navigate('/admin/login')
    }
  }, [navigate])

  const getToken = useCallback(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) { navigate('/admin/login'); return null }
    return token
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('adminToken')
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
        </nav>
      </header>
      <main className="admin-main">
        <Outlet context={{ getToken, lang }} />
      </main>
    </div>
  )
}
