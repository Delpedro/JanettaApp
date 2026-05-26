import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminChangePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => { if (res.status === 401) navigate('/admin/login') })
      .catch(() => navigate('/admin/login'))
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Hasło musi mieć co najmniej 8 znaków. / Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Hasła nie pasują. / Passwords do not match.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPassword: password }),
      })
      if (res.status === 401) { navigate('/admin/login'); return }
      if (!res.ok) throw new Error()
      navigate('/admin/products')
    } catch {
      setError('Coś poszło nie tak. Spróbuj ponownie. / Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="setup-page">
      <div className="setup-card">
        <h1 className="setup-title">Zmień hasło / Change password</h1>
        <p className="setup-sub">Ustaw nowe hasło przed kontynuowaniem.<br />Set a new password before continuing.</p>

        <form className="setup-form" onSubmit={handleSubmit}>
          <div className="setup-field">
            <label className="setup-label">Nowe hasło / New password</label>
            <input
              type="password"
              className="setup-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="setup-field">
            <label className="setup-label">Powtórz hasło / Confirm password</label>
            <input
              type="password"
              className="setup-input"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>

          {error && <p className="setup-server-error">{error}</p>}

          <button type="submit" className="setup-btn" disabled={submitting}>
            {submitting ? 'Zapisywanie… / Saving…' : 'Zapisz / Save'}
          </button>
        </form>
      </div>
    </div>
  )
}
