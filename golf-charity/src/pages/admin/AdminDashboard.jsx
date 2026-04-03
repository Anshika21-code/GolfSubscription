import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Link } from 'react-router-dom'
import { calculatePrizePool } from '../../utils/prizePool'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, activeSubscriptions: 0, charities: 0, pendingWinners: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    const [users, subs, charities, winners] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('subscription_status', 'active'),
      supabase.from('charities').select('id', { count: 'exact' }),
      supabase.from('winner_submissions').select('id', { count: 'exact' }).eq('status', 'pending'),
    ])
    const pool = calculatePrizePool(subs.count || 0)
    setStats({
      users: users.count || 0,
      activeSubscriptions: subs.count || 0,
      charities: charities.count || 0,
      pendingWinners: winners.count || 0,
      prizePool: pool.total,
      jackpot: pool.fiveMatch
    })
    setLoading(false)
  }

  if (loading) return <div className="loader">Loading...</div>

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>⚙️ Admin Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Platform overview and controls</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Users', value: stats.users, color: 'var(--text)' },
          { label: 'Active Subscribers', value: stats.activeSubscriptions, color: 'var(--teal)' },
          { label: 'Total Charities', value: stats.charities, color: 'var(--accent)' },
          { label: 'Pending Verifications', value: stats.pendingWinners, color: stats.pendingWinners > 0 ? 'var(--danger)' : 'var(--text)' },
          { label: 'Est. Prize Pool', value: `£${stats.prizePool}`, color: 'var(--accent)' },
          { label: 'Est. Jackpot', value: `£${stats.jackpot}`, color: 'var(--accent)' },
        ].map(s => (
          <div key={s.label} className="card">
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{s.label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 style={{ marginBottom: '1rem' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { label: '👥 Manage Users', to: '/admin/users' },
          { label: '🎰 Run Draw', to: '/admin/draw' },
          { label: '❤️ Manage Charities', to: '/admin/charities' },
          { label: '🏆 Verify Winners', to: '/admin/winners' },
        ].map(a => (
          <Link key={a.label} to={a.to} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>{a.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}