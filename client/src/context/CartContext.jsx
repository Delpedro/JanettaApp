import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  function addItem(product) {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      const maxQty = product.madeToOrder ? 10 : product.stockQty
      if (existing) {
        if (existing.qty >= maxQty) return prev
        return prev.map(i =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { product, qty: 1 }]
    })
  }

  function removeItem(productId) {
    setItems(prev => prev.filter(i => i.product.id !== productId))
  }

  function updateQty(productId, qty) {
    if (qty < 1) {
      removeItem(productId)
      return
    }
    setItems(prev =>
      prev.map(i => {
        if (i.product.id !== productId) return i
        const maxQty = i.product.madeToOrder ? 10 : i.product.stockQty
        return { ...i, qty: Math.min(qty, maxQty) }
      })
    )
  }

  function clearCart() {
    setItems([])
  }

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0)
  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
