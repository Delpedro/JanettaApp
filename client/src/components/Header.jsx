import { useCart } from '../context/CartContext'

export default function Header({ lang, setLang, onOpenCart }) {
  const { itemCount } = useCart()

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__logo">
          <span className="site-header__shop-name">Janetta</span>
          <span className="site-header__tagline">
            {lang === 'pl' ? 'Ręcznie robione z sercem' : 'Handmade with love'}
          </span>
        </div>

        <nav className="site-header__nav">
          <div className="lang-toggle">
            <button
              className={`lang-toggle__btn ${lang === 'pl' ? 'lang-toggle__btn--active' : ''}`}
              onClick={() => setLang('pl')}
            >
              PL
            </button>
            <span className="lang-toggle__sep">|</span>
            <button
              className={`lang-toggle__btn ${lang === 'en' ? 'lang-toggle__btn--active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>

          <button className="cart-btn" onClick={onOpenCart} aria-label="Open cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
