import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

const t = {
  en: {
    title: 'Admin Users',
    email: 'Email',
    password: 'Temporary password',
    create: 'Create',
    creating: 'Creating…',
    created: 'User created.',
    error: 'Failed to create user.',
    exists: 'Email already in use.',
    shortPassword: 'Password must be at least 8 characters.',
    addTitle: 'Add user',
    pending: 'Must change password on first login',
    loading: 'Loading…',
    loadError: 'Could not load users.',
    deleteConfirm: 'Delete this user?',
    deleteError: 'Failed to delete user.',
  },
  pl: {
    title: 'Administratorzy',
    email: 'Email',
    password: 'Hasło tymczasowe',
    create: 'Utwórz',
    creating: 'Tworzenie…',
    created: 'Użytkownik utworzony.',
    error: 'Nie udało się utworzyć użytkownika.',
    exists: 'Email jest już zajęty.',
    shortPassword: 'Hasło musi mieć co najmniej 8 znaków.',
    addTitle: 'Dodaj użytkownika',
    pending: 'Musi zmienić hasło przy pierwszym logowaniu',
    loading: 'Ładowanie…',
    loadError: 'Nie udało się załadować użytkowników.',
    deleteConfirm: 'Usunąć tego użytkownika?',
    deleteError: 'Nie udało się usunąć użytkownika.',
  },
}

export default function AdminUsersPage() {
  const { lang } = useOutletContext()
  const [users, setUsers] = useState([])
  const [loadError, setLoadError] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()
  const tx = t[lang]

  function loadUsers() {
    setLoadError(false)
    fetch('/api/admin/users', { credentials: 'include' })
      .then(res => {
        if (res.status === 401) { navigate('/admin/login'); return null }
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => { if (data) setUsers(data) })
      .catch(() => setLoadError(true))
  }

  useEffect(() => { loadUsers() }, [navigate])

  async function handleDelete(id) {
    if (!window.confirm(tx.deleteConfirm)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', credentials: 'include' })
      if (res.status === 401) { navigate('/admin/login'); return }
      if (!res.ok) { setMsg(tx.deleteError); return }
      loadUsers()
    } catch {
      setMsg(tx.deleteError)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg('')
    setSaving(true)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
      loadUsers()
    } catch {
      setMsg(tx.error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <h2 className="admin-section-title">{tx.title}</h2>

      {loadError && <p className="admin-status admin-status--error">{tx.loadError}</p>}

      {users.length > 0 && (
        <ul className="admin-product-list" style={{ marginBottom: '2rem' }}>
          {users.map(u => (
            <li key={u.id} className="admin-product-row">
              <div className="admin-product-info">
                <span className="admin-product-name">{u.email}</span>
                {u.forcePasswordReset && (
                  <span className="admin-product-meta" style={{ color: '#c0392b' }}>{tx.pending}</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="admin-product-meta">{u.role}</span>
                <button
                  onClick={() => handleDelete(u.id)}
                  disabled={deletingId === u.id}
                  style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '0.85rem', padding: '0.2rem 0.4rem' }}
                >
                  {deletingId === u.id ? '…' : '✕'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3 className="admin-section-title" style={{ marginTop: '1.5rem' }}>{tx.addTitle}</h3>
      <form className="admin-user-form" onSubmit={handleSubmit}>
        <input className="admin-user-input" type="email" placeholder={tx.email} value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="admin-user-input" type="password" placeholder={tx.password} value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="admin-user-btn" type="submit" disabled={saving}>
          {saving ? tx.creating : tx.create}
        </button>
      </form>
      {msg && <p className={`admin-status${msg === tx.created ? '' : ' admin-status--error'}`}>{msg}</p>}
    </>
  )
}
