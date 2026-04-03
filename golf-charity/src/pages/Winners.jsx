import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function Winners() {
  const { user } = useAuth()
  const [winners, setWinners] = useState([])
  const [mySubmission, setMySubmission] = useState(null)
  const [proofUrl, setProofUrl] = useState('')
  const [draws, setDraws] = useState([])
  const [selectedDraw, setSelectedDraw] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchWinners()
    fetchDraws()
    if (user) fetchMySubmission()
  }, [user])

  const fetchWinners = async () => {
    const { data } = await supabase
      .from('winner_submissions')
      .select('*, profiles(email), draws(month)')
      .eq('status', 'approved')
    setWinners(data || [])
  }

  const fetchDraws = async () => {
    const { data } = await supabase.from('draws').select('*').eq('status', 'published')
    setDraws(data || [])
  }

  const fetchMySubmission = async () => {
    const { data } = await supabase
      .from('winner_submissions')
      .select('*, draws(month)')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single()
    setMySubmission(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDraw || !proofUrl) return toast.error('Fill all fields')
    setLoading(true)
    const { error } = await supabase.from('winner_submissions').insert({
      user_id: user.id,
      draw_id: selectedDraw,
      proof_url: proofUrl,
      status: 'pending',
      payout_status: 'pending'
    })
    if (error) toast.error(error.message)
    else { toast.success('Submission sent! Admin will review.'); fetchMySubmission() }
    setLoading(false)
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>🏆 Winners</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Verified winners and prize payouts.
      </p>

      {/* Submit proof */}
      {user && !mySubmission && (
        <div className="card" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>Submit Winner Proof</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Draw</label>
              <select value={selectedDraw} onChange={e => setSelectedDraw(e.target.value)} required>
                <option value="">Choose a draw...</option>
                {draws.map(d => <option key={d.id} value={d.id}>{d.month}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Screenshot URL (from golf platform)</label>
              <input type="url" value={proofUrl} onChange={e => setProofUrl(e.target.value)}
                placeholder="https://..." required />
            </div>
            <button className="btn-primary" type="submit" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Proof'}
            </button>
          </form>
        </div>
      )}

      {/* My submission status */}
      {mySubmission && (
        <div className="card" style={{ maxWidth: '500px', marginBottom: '2rem', border: '1px solid var(--accent)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Your Submission — {mySubmission.draws?.month}</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '1rem', background: 'var(--bg3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verification</div>
              <div style={{ fontWeight: '700', color: mySubmission.status === 'approved' ? 'var(--teal)' : mySubmission.status === 'rejected' ? 'var(--danger)' : 'var(--accent)', textTransform: 'capitalize' }}>
                {mySubmission.status}
              </div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '1rem', background: 'var(--bg3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Payout</div>
              <div style={{ fontWeight: '700', color: mySubmission.payout_status === 'paid' ? 'var(--teal)' : 'var(--accent)', textTransform: 'capitalize' }}>
                {mySubmission.payout_status}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Winners list */}
      <h2 style={{ marginBottom: '1rem' }}>Verified Winners</h2>
      {winners.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No verified winners yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {winners.map(w => (
            <div key={w.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: '700' }}>{w.profiles?.email}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{w.draws?.month}</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--teal)', fontWeight: '600' }}>✓ Verified</span>
                <span style={{ color: w.payout_status === 'paid' ? 'var(--teal)' : 'var(--accent)', textTransform: 'capitalize' }}>
                  {w.payout_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}