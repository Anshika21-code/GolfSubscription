import { useAuth } from '../hooks/useAuth.js'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { profile } = useAuth()

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>
        Welcome back 👋
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        {profile?.email}
      </p>

      {/* Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Subscription', value: profile?.subscription_status || 'inactive', color: profile?.subscription_status === 'active' ? 'var(--teal)' : 'var(--danger)' },
          { label: 'Plan', value: profile?.subscription_plan || '—', color: 'var(--accent)' },
          { label: 'Charity %', value: `${profile?.charity_percentage || 10}%`, color: 'var(--accent)' },
          { label: 'Renewal', value: profile?.subscription_renewal || '—', color: 'var(--text-muted)' },
        ].map(s => (
          <div key={s.label} className="card">
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{s.label}</div>
            <div style={{ color: s.color, fontWeight: '700', fontSize: '1.2rem', textTransform: 'capitalize' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 style={{ marginBottom: '1rem' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { label: '🏌️ Enter Scores', to: '/scores' },
          { label: '🎰 View Draws', to: '/draw' },
          { label: '❤️ Charities', to: '/charities' },
          { label: '🏆 Winners', to: '/winners' },
        ].map(a => (
          <Link key={a.label} to={a.to} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ textAlign: 'center', cursor: 'pointer', transition: 'border 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{a.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}