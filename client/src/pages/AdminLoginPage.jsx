import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLoginPage() {
  const [form, setForm]             = useState({ email: '', password: '' })
  const [errors, setErrors]         = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  function validate() {
    const e = {}
    if (!form.email.trim()) e.email = 'Required'
    if (!form.password) e.password = 'Required'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
    if (serverError) setServerError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    setServerError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim().toLowerCase(), password: form.password }),
      })
      if (res.status === 401) { setServerError('Invalid email or password.'); return }
      if (!res.ok) throw new Error()
      const data = await res.json()
      localStorage.setItem('adminToken', data.token)
      navigate('/admin/dashboard')
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="setup-page">
      <div className="setup-card">
        <h1 className="setup-title">Admin login</h1>
        <p className="setup-sub">Janetta's shop — admin access only.</p>

        <form className="setup-form" onSubmit={handleSubmit} noValidate>
          <div className="setup-field">
            <label className="setup-label" htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email"
              className={`setup-input${errors.email ? ' setup-input--error' : ''}`}
              value={form.email} onChange={handleChange}
              autoComplete="email" autoFocus
            />
            {errors.email && <span className="setup-error">{errors.email}</span>}
          </div>

          <div className="setup-field">
            <label className="setup-label" htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              className={`setup-input${errors.password ? ' setup-input--error' : ''}`}
              value={form.password} onChange={handleChange}
              autoComplete="current-password"
            />
            {errors.password && <span className="setup-error">{errors.password}</span>}
          </div>

          {serverError && <p className="setup-server-error">{serverError}</p>}

          <button type="submit" className="setup-btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
