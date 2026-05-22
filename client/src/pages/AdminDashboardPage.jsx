import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboardPage() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) { navigate('/admin/login'); return }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setEmail(payload.email || '')
    } catch {
      navigate('/admin/login')
    }
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <div className="setup-page">
      <div className="setup-card">
        <div className="setup-check">✓</div>
        <h1 className="setup-title">Admin dashboard</h1>
        <p className="setup-sub">Signed in{email ? ` as ${email}` : ''}.</p>
        <button className="setup-btn" style={{ marginTop: '1.5rem' }} onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  )
}
