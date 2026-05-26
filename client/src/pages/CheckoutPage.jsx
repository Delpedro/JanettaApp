import { useState } from 'react'
import { Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const T = {
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
    next:        'Przejdź do płatności',
    processing:  'Przetwarzanie...',
    pay:         'Zapłać',
    back:        '← Powrót do sklepu',
    backForm:    '← Wróć do formularza',
    emptyCart:   'Koszyk jest pusty.',
    required:    'To pole jest wymagane',
    emailBad:    'Podaj poprawny adres e-mail',
    orderError:  'Błąd podczas składania zamówienia. Spróbuj ponownie.',
    paymentTitle: 'Płatność',
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
    next:        'Continue to payment',
    processing:  'Processing...',
    pay:         'Pay now',
    back:        '← Back to shop',
    backForm:    '← Back to details',
    emptyCart:   'Your cart is empty.',
    required:    'This field is required',
    emailBad:    'Enter a valid email address',
    orderError:  'Something went wrong. Please try again.',
    paymentTitle: 'Payment',
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

function OrderSummary({ items, total, lang, t }) {
  return (
    <aside className="checkout-summary">
      <h2 className="checkout-summary__title">{t.summary}</h2>
      <ul className="checkout-summary__list">
        {items.map(({ product, qty }) => {
          const name = lang === 'pl' ? product.name_pl : product.name_en
          return (
            <li key={product.id} className="checkout-summary__item">
              <img src={product.image} alt={name} className="checkout-summary__img" />
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
  )
}

function PaymentForm({ t, onBack }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return

    setSubmitting(true)
    setError('')

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/complete`,
      },
    })

    // Only reaches here if confirmPayment fails immediately (network, card error)
    if (stripeError) {
      setError(stripeError.message)
      setSubmitting(false)
    }
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="checkout-server-error" style={{ marginTop: '1rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button type="button" className="btn btn--secondary" onClick={onBack} disabled={submitting}>
          {t.backForm}
        </button>
        <button type="submit" className="btn btn--primary btn--large checkout-submit" disabled={!stripe || submitting}>
          {submitting ? t.processing : t.pay}
        </button>
      </div>
    </form>
  )
}

export default function CheckoutPage({ lang }) {
  const t = T[lang] ?? T.pl
  const { items, total } = useCart()

  const [form, setForm]               = useState(EMPTY_FORM)
  const [errors, setErrors]           = useState({})
  const [submitting, setSubmitting]   = useState(false)
  const [serverError, setServerError] = useState('')
  const [clientSecret, setClientSecret] = useState(null)

  if (items.length === 0) {
    return (
      <main className="main">
        <Link to="/" className="back-link">{t.back}</Link>
        <p className="checkout-empty">{t.emptyCart}</p>
      </main>
    )
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    const errs = validate(form, t)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    setServerError('')

    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name:   form.name,
          customer_email:  form.email,
          address_street:  form.street,
          address_city:    form.city,
          address_postal:  form.postal,
          items: items.map(({ product, qty }) => ({
            product_id: product.id,
            qty,
          })),
        }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'Failed')
      }

      const { clientSecret: secret } = await res.json()
      setClientSecret(secret)
    } catch (err) {
      setServerError(err.message === 'Insufficient stock' ? err.message : t.orderError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="main">
      <Link to="/" className="back-link">{t.back}</Link>
      <h1 className="checkout-title">{clientSecret ? t.paymentTitle : t.title}</h1>

      <div className="checkout-layout">

        {clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, locale: lang === 'pl' ? 'pl' : 'en' }}
          >
            <PaymentForm t={t} onBack={() => setClientSecret(null)} />
          </Elements>
        ) : (
          <form className="checkout-form" onSubmit={handleFormSubmit} noValidate>

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

            {serverError && <p className="checkout-server-error">{serverError}</p>}

            <button type="submit" className="btn btn--primary btn--large checkout-submit" disabled={submitting}>
              {submitting ? t.processing : t.next}
            </button>
          </form>
        )}

        <OrderSummary items={items} total={total} lang={lang} t={t} />
      </div>
    </main>
  )
}
