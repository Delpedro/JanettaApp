import { useCart } from '../context/CartContext'

export default function CartDrawer({ lang, onClose }) {
  const { items, removeItem, updateQty, total } = useCart()

  const t = {
    title:    lang === 'pl' ? 'Koszyk'              : 'Cart',
    empty:    lang === 'pl' ? 'Koszyk jest pusty'   : 'Your cart is empty',
    remove:   lang === 'pl' ? 'Usuń'                : 'Remove',
    total:    lang === 'pl' ? 'Razem'               : 'Total',
    checkout: lang === 'pl' ? 'Przejdź do kasy'     : 'Checkout',
  }

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />

      <div className="cart-drawer" role="dialog" aria-label={t.title}>
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">{t.title}</h2>
          <button className="cart-drawer__close" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty__icon">🛒</span>
              <p className="cart-empty__text">{t.empty}</p>
            </div>
          ) : (
            items.map(({ product, qty }) => {
              const name = lang === 'pl' ? product.name_pl : product.name_en
              const maxQty = product.madeToOrder ? 10 : product.stockQty
              return (
                <div key={product.id} className="cart-item">
                  <img
                    src={product.image}
                    alt={name}
                    className="cart-item__image"
                  />
                  <div className="cart-item__info">
                    <p className="cart-item__name">{name}</p>
                    <p className="cart-item__price">{product.price} zł × {qty} = {product.price * qty} zł</p>
                    <div className="cart-item__controls">
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQty(product.id, qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart-item__qty">{qty}</span>
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQty(product.id, qty + 1)}
                        disabled={qty >= maxQty}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        className="cart-item__remove"
                        onClick={() => removeItem(product.id)}
                      >
                        {t.remove}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="cart-drawer__footer">
          <div className="cart-total">
            <span className="cart-total__label">{t.total}</span>
            <span className="cart-total__amount">{total} zł</span>
          </div>
          <button
            className="btn btn--primary btn--checkout"
            disabled={items.length === 0}
          >
            {t.checkout}
          </button>
        </div>
      </div>
    </>
  )
}
