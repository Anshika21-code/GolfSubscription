import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function Draw() {
  const { user } = useAuth()
  const [draws, setDraws] = useState([])
  const [userScores, setUserScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDraws()
    if (user) fetchUserScores()
  }, [user])

  const fetchDraws = async () => {
    const { data } = await supabase
      .from('draws')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    setDraws(data || [])
    setLoading(false)
  }

  const fetchUserScores = async () => {
    const { data } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })
      .limit(5)
    setUserScores((data || []).map(s => s.score))
  }

  const getMatchCount = (drawnNumbers) => {
    return userScores.filter(n => drawnNumbers?.includes(n)).length
  }

  const getMatchColor = (count) => {
    if (count >= 5) return 'var(--accent)'
    if (count >= 4) return 'var(--teal)'
    if (count >= 3) return '#9a9ab0'
    return 'var(--text-muted)'
  }

  if (loading) return <div className="loader">Loading draws...</div>

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>🎰 Monthly Draws</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Published draw results. Match 3, 4, or 5 numbers to win!
      </p>

      {draws.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎰</div>
          <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>No draws yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>The first draw will be published soon!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {draws.map(draw => {
            const matches = user ? getMatchCount(draw.drawn_numbers) : 0
            return (
              <div key={draw.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem' }}>{draw.month}</h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {new Date(draw.created_at).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                  {draw.jackpot_rollover && (
                    <div style={{ background: 'rgba(232,184,75,0.1)', border: '1px solid var(--accent)', borderRadius: '20px', padding: '0.25rem 0.75rem', fontSize: '0.8rem', color: 'var(--accent)' }}>
                      🔄 Jackpot Rolled Over
                    </div>
                  )}
                </div>

                {/* Drawn Numbers */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Drawn Numbers</div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {draw.drawn_numbers?.map((n, i) => (
                      <div key={i} style={{
                        width: '52px', height: '52px', borderRadius: '50%',
                        background: user && userScores.includes(n) ? 'var(--accent)' : 'var(--bg3)',
                        border: `2px solid ${user && userScores.includes(n) ? 'var(--accent)' : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '800', color: user && userScores.includes(n) ? '#0f0f1a' : 'var(--text)'
                      }}>{n}</div>
                    ))}
                  </div>
                </div>

                {/* User match result */}
                {user && userScores.length > 0 && (
                  <div style={{
                    padding: '0.75rem 1rem', borderRadius: '8px',
                    background: matches >= 3 ? 'rgba(232,184,75,0.1)' : 'var(--bg3)',
                    border: `1px solid ${getMatchColor(matches)}`
                  }}>
                    <span style={{ color: getMatchColor(matches), fontWeight: '700' }}>
                      {matches >= 5 ? '🏆 JACKPOT! You matched all 5!' :
                       matches >= 4 ? '🥈 You matched 4 numbers!' :
                       matches >= 3 ? '🥉 You matched 3 numbers!' :
                       `You matched ${matches} number${matches !== 1 ? 's' : ''}`}
                    </span>
                  </div>
                )}

                {/* Prize breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
                  {[
                    { label: '5 Match', share: '40%', tag: 'Jackpot' },
                    { label: '4 Match', share: '35%', tag: 'Major' },
                    { label: '3 Match', share: '25%', tag: 'Prize' },
                  ].map(p => (
                    <div key={p.label} style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg3)', borderRadius: '8px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--accent)' }}>{p.share}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.label} • {p.tag}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}