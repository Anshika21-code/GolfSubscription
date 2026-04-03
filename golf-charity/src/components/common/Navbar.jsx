import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out!')
    navigate('/')
  }

  return (
    <nav style={{
      background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
      padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', position: 'sticky', top: 0, zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '1.3rem' }}>⛳ GolfCharity</span>
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/charities" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Charities</Link>
        <Link to="/winners" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Winners</Link>

        {user ? (
          <>
            <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/scores" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>My Scores</Link>
            {profile?.role === 'admin' && (
              <Link to="/admin" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Admin</Link>
            )}
            <button className="btn-secondary" onClick={handleLogout} style={{ padding: '0.4rem 1rem' }}>
              Logout
            </button>
            <Link to="/draw" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Draw</Link>
          </>
        ) : (
          <>
            <Link to="/login"><button className="btn-secondary" style={{ padding: '0.4rem 1rem' }}>Login</button></Link>
            <Link to="/signup"><button className="btn-primary" style={{ padding: '0.4rem 1rem' }}>Sign Up</button></Link>
          </>
        )}
      </div>
    </nav>
  )
}