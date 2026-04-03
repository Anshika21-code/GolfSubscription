import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminWinners() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('winner_submissions')
      .select('*, profiles(email), draws(month)')
      .eq('status', filter)
      .order('submitted_at', { ascending: false })
    setSubmissions(data || [])
    setLoading(false)
  }, [filter])

  useEffect(() => { fetchSubmissions() }, [fetchSubmissions])

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('winner_submissions').update({ status }).eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success(`Submission ${status}!`); fetchSubmissions() }
  }

  const updatePayout = async (id, payout_status) => {
    const { error } = await supabase.from('winner_submissions').update({ payout_status }).eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Payout updated!'); fetchSubmissions() }
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>🏆 Winner Verification</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Review and approve winner submissions</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {['pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.5rem 1.25rem', borderRadius: '20px', textTransform: 'capitalize',
            background: filter === f ? 'var(--accent)' : 'transparent',
            color: filter === f ? '#0f0f1a' : 'var(--text-muted)',
            border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
            cursor: 'pointer', fontWeight: filter === f ? '700' : '400'
          }}>{f}</button>
        ))}
      </div>

      {loading ? <div className="loader">Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {submissions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No {filter} submissions.</p>
            </div>
          ) : submissions.map(s => (
            <div key={s.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: '700' }}>{s.profiles?.email}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Draw: {s.draws?.month} · {new Date(s.submitted_at).toLocaleDateString('en-GB')}
                  </div>
                  {s.proof_url && (
                    <a href={s.proof_url} target="_blank" rel="noreferrer"
                      style={{ color: 'var(--accent)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                      📎 View Proof →
                    </a>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {filter === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(s.id, 'approved')} style={{
                        padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer',
                        background: 'rgba(78,204,163,0.1)', border: '1px solid var(--teal)',
                        color: 'var(--teal)', fontWeight: '600'
                      }}>✓ Approve</button>
                      <button onClick={() => updateStatus(s.id, 'rejected')} style={{
                        padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer',
                        background: 'rgba(232,91,75,0.1)', border: '1px solid var(--danger)',
                        color: 'var(--danger)', fontWeight: '600'
                      }}>✗ Reject</button>
                    </>
                  )}
                  {filter === 'approved' && (
                    <select value={s.payout_status} onChange={e => updatePayout(s.id, e.target.value)}
                      style={{ padding: '0.4rem', fontSize: '0.85rem', width: 'auto' }}>
                      <option value="pending">Payout Pending</option>
                      <option value="paid">Paid ✓</option>
                    </select>
                  )}
                  <span style={{
                    padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                    background: s.payout_status === 'paid' ? 'rgba(78,204,163,0.1)' : 'rgba(255,255,255,0.05)',
                    color: s.payout_status === 'paid' ? 'var(--teal)' : 'var(--text-muted)'
                  }}>{s.payout_status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}