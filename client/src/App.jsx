import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import AdminShell from './components/AdminShell'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import CheckoutCompletePage from './pages/CheckoutCompletePage'
import SetupPage from './pages/SetupPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminChangePasswordPage from './pages/AdminChangePasswordPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminAddProductPage from './pages/AdminAddProductPage'
import AdminEditProductPage from './pages/AdminEditProductPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminHelpPage from './pages/AdminHelpPage'
import './App.css'

function ShopShell() {
  const [lang, setLang] = useState('pl')
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <CartProvider>
      <Header lang={lang} setLang={setLang} onOpenCart={() => setCartOpen(true)} />
      {cartOpen && <CartDrawer lang={lang} onClose={() => setCartOpen(false)} />}
      <Routes>
        <Route path="/" element={<HomePage lang={lang} />} />
        <Route path="/product/:id" element={<ProductDetailPage lang={lang} />} />
        <Route path="/checkout" element={<CheckoutPage lang={lang} />} />
        <Route path="/checkout/complete" element={<CheckoutCompletePage lang={lang} />} />
      </Routes>
      <footer className="site-footer">
        <p>© 2026 Janetta</p>
        <a href="/admin/login" className="admin-footer-link">Admin</a>
      </footer>
    </CartProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<Navigate to="/admin/products" replace />} />
      <Route path="/admin/change-password" element={<AdminChangePasswordPage />} />
      <Route path="/admin" element={<AdminShell />}>
        <Route index element={<Navigate to="/admin/products" replace />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="add-product" element={<AdminAddProductPage />} />
        <Route path="edit-product/:id" element={<AdminEditProductPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="help" element={<AdminHelpPage />} />
      </Route>
      <Route path="/*" element={<ShopShell />} />
    </Routes>
  )
}
