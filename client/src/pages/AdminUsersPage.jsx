import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

const t = {
  en: {
    title: 'Admin Users',
    email: 'Email',
    password: 'Password',
    create: 'Create',
    creating: 'Creating…',
    created: 'User created.',
    error: 'Failed to create user.',
    exists: 'Email already in use.',
    shortPassword: 'Password must be at least 8 characters.',
  },
  pl: {
    title: 'Administratorzy',
    email: 'Email',
    password: 'Hasło',
    create: 'Utwórz',
    creating: 'Tworzenie…',
    created: 'Użytkownik utworzony.',
    error: 'Nie udało się utworzyć użytkownika.',
    exists: 'Email jest już zajęty.',
    shortPassword: 'Hasło musi mieć co najmniej 8 znaków.',
  },
}

export default function AdminUsersPage() {
  const { getToken, lang } = useOutletContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const tx = t[lang]

  async function handleSubmit(e) {
    e.preventDefault()
    const token = getToken()
    if (!token) return
    setMsg('')
    setSaving(true)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.status === 401) { navigate('/admin/login'); return }
      if (res.status === 409) { setMsg(tx.exists); return }
      if (res.status === 400 && data.error?.includes('8')) { setMsg(tx.shortPassword); return }
      if (!res.ok) { setMsg(tx.error); return }
      setMsg(tx.created)
      setEmail('')
      setPassword('')
    } catch {
      setMsg(tx.error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <h2 className="admin-section-title">{tx.title}</h2>
      <form className="admin-user-form" onSubmit={handleSubmit}>
        <input
          className="admin-user-input"
          type="email"
          placeholder={tx.email}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="admin-user-input"
          type="password"
          placeholder={tx.password}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="admin-user-btn" type="submit" disabled={saving}>
          {saving ? tx.creating : tx.create}
        </button>
      </form>
      {msg && (
        <p className={`admin-status${msg === tx.created ? '' : ' admin-status--error'}`}>{msg}</p>
      )}
    </>
  )
}
