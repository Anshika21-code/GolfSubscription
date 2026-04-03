import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Charities() {
  const [charities, setCharities] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('charities').select('*').order('is_featured', { ascending: false })
      .then(({ data }) => { setCharities(data || []); setLoading(false) })
  }, [])

  const filtered = charities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="loader">Loading charities...</div>

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>❤️ Charities</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Every subscription supports one of these amazing causes.
      </p>

      <input
        type="text" placeholder="🔍 Search charities..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ maxWidth: '400px', marginBottom: '2rem' }}
      />

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No charities found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(c => (
            <Link key={c.id} to={`/charities/${c.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', height: '100%', transition: 'border 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                {c.is_featured && (
                  <div style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    ⭐ FEATURED
                  </div>
                )}
                {c.image_url && (
                  <img src={c.image_url} alt={c.name}
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                )}
                <h3 style={{ marginBottom: '0.5rem' }}>{c.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {c.description?.slice(0, 120)}...
                </p>
                {c.upcoming_events && (
                  <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--teal)' }}>
                    📅 {c.upcoming_events}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}