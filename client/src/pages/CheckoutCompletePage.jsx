import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { useCart } from '../context/CartContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const T = {
  pl: {
    confirmed:   'Zamówienie złożone!',
    confirmSub:  (email) => `Potwierdzenie wyślemy na ${email}`,
    failed:      'Płatność nieudana',
    failedSub:   'Spróbuj ponownie lub użyj innej metody płatności.',
    processing:  'Przetwarzanie płatności...',
    backShop:    'Wróć do sklepu',
    tryAgain:    'Spróbuj ponownie',
  },
  en: {
    confirmed:   'Order confirmed!',
    confirmSub:  (email) => `A confirmation will be sent to ${email}`,
    failed:      'Payment failed',
    failedSub:   'Please try again or use a different payment method.',
    processing:  'Processing payment...',
    backShop:    'Back to shop',
    tryAgain:    'Try again',
  },
}

export default function CheckoutCompletePage({ lang }) {
  const t = T[lang] ?? T.pl
  const [searchParams] = useSearchParams()
  const { clearCart } = useCart()
  const [status, setStatus] = useState('loading')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const clientSecret = searchParams.get('payment_intent_client_secret')
    if (!clientSecret) {
      setStatus('failed')
      return
    }

    stripePromise.then(stripe => {
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (paymentIntent.status === 'succeeded') {
          setEmail(paymentIntent.receipt_email || '')
          clearCart()
          setStatus('succeeded')
        } else {
          setStatus('failed')
        }
      })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'loading') {
    return (
      <main className="main">
        <div className="checkout-confirm">
          <p>{t.processing}</p>
        </div>
      </main>
    )
  }

  if (status === 'succeeded') {
    return (
      <main className="main">
        <div className="checkout-confirm">
          <div className="checkout-confirm__icon">✓</div>
          <h1 className="checkout-confirm__title">{t.confirmed}</h1>
          {email && <p className="checkout-confirm__sub">{t.confirmSub(email)}</p>}
          <Link to="/" className="btn btn--primary checkout-confirm__btn">{t.backShop}</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="main">
      <div className="checkout-confirm">
        <div className="checkout-confirm__icon" style={{ color: 'var(--color-error, #c0392b)' }}>✕</div>
        <h1 className="checkout-confirm__title">{t.failed}</h1>
        <p className="checkout-confirm__sub">{t.failedSub}</p>
        <Link to="/checkout" className="btn btn--primary checkout-confirm__btn">{t.tryAgain}</Link>
      </div>
    </main>
  )
}
