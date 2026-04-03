import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminCharities() {
  const [charities, setCharities] = useState([])
  const [form, setForm] = useState({ name: '', description: '', image_url: '', upcoming_events: '', is_featured: false })
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchCharities() }, [])

  const fetchCharities = async () => {
    const { data } = await supabase.from('charities').select('*').order('created_at', { ascending: false })
    setCharities(data || [])
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name) return toast.error('Name is required')
    setLoading(true)
    const { error } = await supabase.from('charities').insert(form)
    if (error) toast.error(error.message)
    else {
      toast.success('Charity added!')
      setForm({ name: '', description: '', image_url: '', upcoming_events: '', is_featured: false })
      setShowForm(false)
      fetchCharities()
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this charity?')) return
    await supabase.from('charities').delete().eq('id', id)
    toast.success('Deleted')
    fetchCharities()
  }

  const toggleFeatured = async (id, current) => {
    await supabase.from('charities').update({ is_featured: !current }).eq('id', id)
    fetchCharities()
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>❤️ Charity Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>{charities.length} charities listed</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Charity'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ maxWidth: '550px', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>Add New Charity</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Charity Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Cancer Research UK" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="What does this charity do?" rows={3}
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.75rem', borderRadius: '8px', width: '100%', resize: 'vertical' }} />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Upcoming Events</label>
              <input value={form.upcoming_events} onChange={e => setForm({ ...form, upcoming_events: e.target.value })} placeholder="e.g. Charity Golf Day - June 2026" />
            </div>
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
              <input type="checkbox" id="featured" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} style={{ width: 'auto' }} />
              <label htmlFor="featured" style={{ margin: 0 }}>Featured on homepage</label>
            </div>
            <button className="btn-primary" type="submit" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Adding...' : 'Add Charity'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {charities.map(c => (
          <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {c.image_url && <img src={c.image_url} alt={c.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />}
              <div>
                <div style={{ fontWeight: '700' }}>{c.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.description?.slice(0, 80)}...</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {c.is_featured && <span style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>⭐ Featured</span>}
              <button onClick={() => toggleFeatured(c.id, c.is_featured)}
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                {c.is_featured ? 'Unfeature' : 'Feature'}
              </button>
              <button onClick={() => handleDelete(c.id)}
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px', cursor: 'pointer', background: 'rgba(232,91,75,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}