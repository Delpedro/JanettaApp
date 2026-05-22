import { useState, useEffect } from 'react'

export default function SetupPage() {
  const [status, setStatus]     = useState('loading')
  const [form, setForm]         = useState({ email: '', password: '', confirm: '' })
  const [errors, setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [done, setDone]         = useState(false)

  useEffect(() => {
    fetch('/api/auth/setup/status')
      .then(r => r.json())
      .then(data => setStatus(data.setupRequired ? 'ready' : 'done'))
      .catch(() => setStatus('error'))
  }, [])

  function validate() {
    const e = {}
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (!form.confirm) e.confirm = 'Required'
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    setServerError('')
    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim().toLowerCase(), password: form.password }),
      })
      if (res.status === 403) { setStatus('done'); return }
      if (!res.ok) throw new Error()
      setDone(true)
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') return <div className="setup-page"><p className="setup-msg">Loading…</p></div>

  if (status === 'error') return <div className="setup-page"><p className="setup-msg setup-msg--error">Could not reach the server.</p></div>

  if (status === 'done' || done) {
    return (
      <div className="setup-page">
        <div className="setup-card">
          <div className="setup-check">✓</div>
          <h1 className="setup-title">
            {done ? 'Admin account created' : 'Setup already complete'}
          </h1>
          <p className="setup-sub">
            {done
              ? 'Your admin account is ready. Save your credentials somewhere safe.'
              : 'An admin account already exists. Use the login page to sign in.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="setup-page">
      <div className="setup-card">
        <h1 className="setup-title">Admin setup</h1>
        <p className="setup-sub">Create the first admin account.</p>

        <form className="setup-form" onSubmit={handleSubmit} noValidate>
          <div className="setup-field">
            <label className="setup-label" htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email"
              className={`setup-input${errors.email ? ' setup-input--error' : ''}`}
              value={form.email} onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="setup-error">{errors.email}</span>}
          </div>

          <div className="setup-field">
            <label className="setup-label" htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              className={`setup-input${errors.password ? ' setup-input--error' : ''}`}
              value={form.password} onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password && <span className="setup-error">{errors.password}</span>}
          </div>

          <div className="setup-field">
            <label className="setup-label" htmlFor="confirm">Confirm password</label>
            <input
              id="confirm" name="confirm" type="password"
              className={`setup-input${errors.confirm ? ' setup-input--error' : ''}`}
              value={form.confirm} onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.confirm && <span className="setup-error">{errors.confirm}</span>}
          </div>

          {serverError && <p className="setup-server-error">{serverError}</p>}

          <button type="submit" className="setup-btn" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create admin account'}
          </button>
        </form>
      </div>
    </div>
  )
}
