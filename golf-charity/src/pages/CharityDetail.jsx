import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CharityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [charity, setCharity] = useState(null)

  useEffect(() => {
    supabase.from('charities').select('*').eq('id', id).single()
      .then(({ data }) => setCharity(data))
  }, [id])

  if (!charity) return <div className="loader">Loading...</div>

  return (
    <div className="page" style={{ maxWidth: '800px' }}>
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem' }}>
        ← Back
      </button>

      {charity.image_url && (
        <img src={charity.image_url} alt={charity.name}
          style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '2rem' }} />
      )}

      <h1 style={{ marginBottom: '1rem' }}>{charity.name}</h1>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>{charity.description}</p>

      {charity.upcoming_events && (
        <div className="card">
          <h3 style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>📅 Upcoming Events</h3>
          <p style={{ color: 'var(--text-muted)' }}>{charity.upcoming_events}</p>
        </div>
      )}
    </div>
  )
}