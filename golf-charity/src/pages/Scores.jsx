import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function Scores() {
  const { user } = useAuth()
  const [scores, setScores] = useState([])
  const [score, setScore] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (user) fetchScores() }, [user])

  const fetchScores = async () => {
    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })
      .limit(5)
    setScores(data || [])
  }

  const handleAddScore = async (e) => {
    e.preventDefault()
    if (!score || !date) return toast.error('Fill all fields')
    const s = parseInt(score)
    if (s < 1 || s > 45) return toast.error('Score must be between 1 and 45')
    setLoading(true)

    // Rolling logic: if already 5 scores, delete oldest
    if (scores.length >= 5) {
      const oldest = scores[scores.length - 1]
      await supabase.from('scores').delete().eq('id', oldest.id)
    }

    const { error } = await supabase.from('scores').insert({
      user_id: user.id,
      score: s,
      played_at: date
    })

    if (error) toast.error(error.message)
    else { toast.success('Score added!'); fetchScores() }
    setScore('')
    setDate('')
    setLoading(false)
  }

  const handleDelete = async (id) => {
    await supabase.from('scores').delete().eq('id', id)
    toast.success('Score removed')
    fetchScores()
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>🏌️ My Scores</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Enter your last 5 Stableford scores. These become your draw numbers.
      </p>

      {/* Add Score Form */}
      <div className="card" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Add New Score</h3>
        <form onSubmit={handleAddScore}>
          <div className="form-group">
            <label>Stableford Score (1–45)</label>
            <input
              type="number" min="1" max="45"
              value={score} onChange={e => setScore(e.target.value)}
              placeholder="e.g. 32" required
            />
          </div>
          <div className="form-group">
            <label>Date Played</label>
            <input
              type="date" value={date}
              onChange={e => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]} required
            />
          </div>
          <button className="btn-primary" type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Adding...' : '+ Add Score'}
          </button>
        </form>
      </div>

      {/* Scores List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Your Scores <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({scores.length}/5)</span></h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Most recent first</span>
        </div>

        {scores.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
            No scores yet. Add your first score above!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {scores.map((s, i) => (
              <div key={s.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1rem', background: 'var(--bg3)', borderRadius: '8px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: i === 0 ? 'var(--accent)' : 'var(--border)',
                    color: i === 0 ? '#0f0f1a' : 'var(--text)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '0.85rem'
                  }}>{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--accent)' }}>{s.score}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(s.played_at).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(s.id)}
                  style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {scores.length === 5 && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(232,184,75,0.1)', borderRadius: '8px', border: '1px solid var(--accent)', fontSize: '0.85rem', color: 'var(--accent)' }}>
            ⚠️ You have 5 scores. Adding a new one will remove the oldest.
          </div>
        )}
      </div>

      {/* Draw Numbers Preview */}
      {scores.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>🎰 Your Draw Numbers</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            These are your current numbers for the monthly draw
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {scores.map(s => (
              <div key={s.id} style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'var(--bg3)', border: '2px solid var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '800', fontSize: '1.1rem', color: 'var(--accent)'
              }}>{s.score}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}