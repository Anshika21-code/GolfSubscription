import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { runDraw, algorithmicDraw } from '../../utils/drawEngine'
import toast from 'react-hot-toast'

export default function AdminDraw() {
  const [draws, setDraws] = useState([])
  const [month, setMonth] = useState('')
  const [mode, setMode] = useState('random')
  const [simResult, setSimResult] = useState(null)
  const [allScores, setAllScores] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchDraws = useCallback(async () => {
    const { data } = await supabase.from('draws').select('*').order('created_at', { ascending: false })
    setDraws(data || [])
  }, [])

  const fetchAllScores = useCallback(async () => {
    const { data } = await supabase.from('scores').select('score')
    setAllScores((data || []).map(s => s.score))
  }, [])

  useEffect(() => { fetchDraws(); fetchAllScores() }, [fetchDraws, fetchAllScores])

  const handleSimulate = () => {
    const result = mode === 'random' ? runDraw([]) : algorithmicDraw(allScores)
    setSimResult(result)
    toast.success('Simulation done! Review before publishing.')
  }

  const handlePublish = async () => {
    if (!simResult || !month) return toast.error('Simulate first and enter a month name')
    setLoading(true)
    const lastDraw = draws[0]
    const jackpotRollover = lastDraw?.jackpot_rollover || false
    const { error } = await supabase.from('draws').insert({
      month, drawn_numbers: simResult, status: 'published', jackpot_rollover: jackpotRollover
    })
    if (error) toast.error(error.message)
    else { toast.success(`Draw for ${month} published!`); setSimResult(null); setMonth(''); fetchDraws() }
    setLoading(false)
  }

  const toggleRollover = async (id, current) => {
    await supabase.from('draws').update({ jackpot_rollover: !current }).eq('id', id)
    fetchDraws()
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>🎰 Draw Management</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Configure and run monthly draws</p>

      <div className="card" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>Run New Draw</h3>
        <div className="form-group">
          <label>Month Name</label>
          <input value={month} onChange={e => setMonth(e.target.value)} placeholder="e.g. April 2026" />
        </div>
        <div className="form-group">
          <label>Draw Mode</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="random">Random (Lottery Style)</option>
            <option value="algorithmic">Algorithmic (Least Frequent Scores)</option>
          </select>
        </div>

        {simResult && (
          <div style={{ padding: '1rem', background: 'rgba(232,184,75,0.1)', borderRadius: '8px', border: '1px solid var(--accent)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Simulated Numbers:</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {simResult.map((n, i) => (
                <div key={i} style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'var(--accent)', color: '#0f0f1a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800'
                }}>{n}</div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={handleSimulate} style={{ flex: 1 }}>🔮 Simulate</button>
          <button className="btn-primary" onClick={handlePublish} disabled={loading || !simResult} style={{ flex: 1 }}>
            {loading ? 'Publishing...' : '📢 Publish'}
          </button>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Past Draws</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {draws.map(d => (
          <div key={d.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: '700' }}>{d.month}</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {d.drawn_numbers?.map((n, i) => (
                  <div key={i} style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'var(--bg3)', border: '1px solid var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)'
                  }}>{n}</div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{
                padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem',
                background: d.status === 'published' ? 'rgba(78,204,163,0.1)' : 'rgba(255,255,255,0.05)',
                color: d.status === 'published' ? 'var(--teal)' : 'var(--text-muted)'
              }}>{d.status}</span>
              <button onClick={() => toggleRollover(d.id, d.jackpot_rollover)} style={{
                padding: '0.3rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px',
                background: d.jackpot_rollover ? 'rgba(232,184,75,0.1)' : 'transparent',
                border: '1px solid var(--border)',
                color: d.jackpot_rollover ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer'
              }}>{d.jackpot_rollover ? '🔄 Rollover ON' : 'Rollover OFF'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}