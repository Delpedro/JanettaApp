export default function Header({ lang, setLang }) {
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
        </nav>
      </div>
    </header>
  )
}
