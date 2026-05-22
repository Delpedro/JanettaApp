import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import SetupPage from './pages/SetupPage'
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
      </Routes>
      <footer className="site-footer">
        <p>© 2026 Janetta</p>
      </footer>
    </CartProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/*" element={<ShopShell />} />
    </Routes>
  )
}
