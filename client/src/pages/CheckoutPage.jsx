import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const FIELDS = {
  pl: {
    title:       'Zamówienie',
    contact:     'Dane kontaktowe',
    delivery:    'Adres dostawy',
    name:        'Imię i nazwisko',
    email:       'Adres e-mail',
    street:      'Ulica i numer',
    city:        'Miasto',
    postal:      'Kod pocztowy',
    summary:     'Podsumowanie zamówienia',
    total:       'Razem',
    place:       'Złóż zamówienie',
    back:        '← Powrót do sklepu',
    emptyCart:   'Koszyk jest pusty.',
    confirmed:   'Zamówienie złożone!',
    confirmSub:  (email) => `Potwierdzenie wyślemy na ${email}`,
    backShop:    'Wróć do sklepu',
    required:    'To pole jest wymagane',
    emailBad:    'Podaj poprawny adres e-mail',
  },
  en: {
    title:       'Checkout',
    contact:     'Contact details',
    delivery:    'Delivery address',
    name:        'Full name',
    email:       'Email address',
    street:      'Street address',
    city:        'City',
    postal:      'Postal code',
    summary:     'Order summary',
    total:       'Total',
    place:       'Place order',
    back:        '← Back to shop',
    emptyCart:   'Your cart is empty.',
    confirmed:   'Order confirmed!',
    confirmSub:  (email) => `A confirmation will be sent to ${email}`,
    backShop:    'Back to shop',
    required:    'This field is required',
    emailBad:    'Enter a valid email address',
  },
}

const EMPTY_FORM = { name: '', email: '', street: '', city: '', postal: '' }

function validate(form, t) {
  const errors = {}
  if (!form.name.trim())   errors.name   = t.required
  if (!form.email.trim())  errors.email  = t.required
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = t.emailBad
  if (!form.street.trim()) errors.street = t.required
  if (!form.city.trim())   errors.city   = t.required
  if (!form.postal.trim()) errors.postal = t.required
  return errors
}

export default function CheckoutPage({ lang }) {
  const t = FIELDS[lang] ?? FIELDS.pl
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm]         = useState(EMPTY_FORM)
  const [errors, setErrors]     = useState({})
  const [confirmed, setConfirmed] = useState(false)
  const [confirmedEmail, setConfirmedEmail] = useState('')

  if (items.length === 0 && !confirmed) {
    return (
      <main className="main">
        <Link to="/" className="back-link">{t.back}</Link>
        <p className="checkout-empty">{t.emptyCart}</p>
      </main>
    )
  }

  if (confirmed) {
    return (
      <main className="main">
        <div className="checkout-confirm">
          <div className="checkout-confirm__icon">✓</div>
          <h1 className="checkout-confirm__title">{t.confirmed}</h1>
          <p className="checkout-confirm__sub">{t.confirmSub(confirmedEmail)}</p>
          <Link to="/" className="btn btn--primary checkout-confirm__btn">{t.backShop}</Link>
        </div>
      </main>
    )
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form, t)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    // Schema signal: order = { customer_name, customer_email, address_street, address_city,
    //   address_postal, total, status, created_at }
    // Schema signal: order_items[] = { product_id, qty, price_snapshot, name_pl, name_en }
    setConfirmedEmail(form.email)
    clearCart()
    setConfirmed(true)
  }

  return (
    <main className="main">
      <Link to="/" className="back-link">{t.back}</Link>
      <h1 className="checkout-title">{t.title}</h1>

      <div className="checkout-layout">

        {/* ── Form ── */}
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>

          <fieldset className="checkout-fieldset">
            <legend className="checkout-legend">{t.contact}</legend>

            <div className="checkout-field">
              <label className="checkout-label" htmlFor="name">{t.name}</label>
              <input
                id="name" name="name" type="text"
                className={`checkout-input${errors.name ? ' checkout-input--error' : ''}`}
                value={form.name} onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <span className="checkout-error">{errors.name}</span>}
            </div>

            <div className="checkout-field">
              <label className="checkout-label" htmlFor="email">{t.email}</label>
              <input
                id="email" name="email" type="email"
                className={`checkout-input${errors.email ? ' checkout-input--error' : ''}`}
                value={form.email} onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <span className="checkout-error">{errors.email}</span>}
            </div>
          </fieldset>

          <fieldset className="checkout-fieldset">
            <legend className="checkout-legend">{t.delivery}</legend>

            <div className="checkout-field">
              <label className="checkout-label" htmlFor="street">{t.street}</label>
              <input
                id="street" name="street" type="text"
                className={`checkout-input${errors.street ? ' checkout-input--error' : ''}`}
                value={form.street} onChange={handleChange}
                autoComplete="street-address"
              />
              {errors.street && <span className="checkout-error">{errors.street}</span>}
            </div>

            <div className="checkout-field-row">
              <div className="checkout-field checkout-field--grow">
                <label className="checkout-label" htmlFor="city">{t.city}</label>
                <input
                  id="city" name="city" type="text"
                  className={`checkout-input${errors.city ? ' checkout-input--error' : ''}`}
                  value={form.city} onChange={handleChange}
                  autoComplete="address-level2"
                />
                {errors.city && <span className="checkout-error">{errors.city}</span>}
              </div>

              <div className="checkout-field checkout-field--postal">
                <label className="checkout-label" htmlFor="postal">{t.postal}</label>
                <input
                  id="postal" name="postal" type="text"
                  className={`checkout-input${errors.postal ? ' checkout-input--error' : ''}`}
                  value={form.postal} onChange={handleChange}
                  autoComplete="postal-code"
                />
                {errors.postal && <span className="checkout-error">{errors.postal}</span>}
              </div>
            </div>
          </fieldset>

          <button type="submit" className="btn btn--primary btn--large checkout-submit">
            {t.place}
          </button>
        </form>

        {/* ── Order summary ── */}
        <aside className="checkout-summary">
          <h2 className="checkout-summary__title">{t.summary}</h2>

          <ul className="checkout-summary__list">
            {items.map(({ product, qty }) => {
              const name = lang === 'pl' ? product.name_pl : product.name_en
              return (
                <li key={product.id} className="checkout-summary__item">
                  <img
                    src={product.image}
                    alt={name}
                    className="checkout-summary__img"
                  />
                  <div className="checkout-summary__item-info">
                    <span className="checkout-summary__item-name">{name}</span>
                    <span className="checkout-summary__item-qty">× {qty}</span>
                  </div>
                  <span className="checkout-summary__item-price">{product.price * qty} zł</span>
                </li>
              )
            })}
          </ul>

          <div className="checkout-summary__total">
            <span className="checkout-summary__total-label">{t.total}</span>
            <span className="checkout-summary__total-amount">{total} zł</span>
          </div>
        </aside>

      </div>
    </main>
  )
}
