import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import './App.css'

export default function App() {
  const [lang, setLang] = useState('pl')

  return (
    <>
      <Header lang={lang} setLang={setLang} />

      <Routes>
        <Route path="/" element={<HomePage lang={lang} />} />
        <Route path="/product/:id" element={<ProductDetailPage lang={lang} />} />
      </Routes>

      <footer className="site-footer">
        <p>© 2026 Janetta</p>
      </footer>
    </>
  )
}
