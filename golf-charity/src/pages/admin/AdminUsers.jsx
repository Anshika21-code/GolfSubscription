import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, charities(name)')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const updateSubscription = async (id, status) => {
    const { error } = await supabase.from('profiles').update({ subscription_status: status }).eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Updated!'); fetchUsers() }
  }

  const updateRole = async (id, role) => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Role updated!'); fetchUsers() }
  }

  if (loading) return <div className="loader">Loading...</div>

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>👥 User Management</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{users.length} total users</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {users.map(u => (
          <div key={u.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: '600' }}>{u.email}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Plan: {u.subscription_plan || '—'} · Charity: {u.charities?.name || '—'} · {u.charity_percentage}%
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                background: u.subscription_status === 'active' ? 'rgba(78,204,163,0.1)' : 'rgba(232,91,75,0.1)',
                color: u.subscription_status === 'active' ? 'var(--teal)' : 'var(--danger)'
              }}>{u.subscription_status}</span>
              <span style={{
                padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                background: u.role === 'admin' ? 'rgba(232,184,75,0.1)' : 'rgba(255,255,255,0.05)',
                color: u.role === 'admin' ? 'var(--accent)' : 'var(--text-muted)'
              }}>{u.role}</span>
              <select value={u.subscription_status} onChange={e => updateSubscription(u.id, e.target.value)}
                style={{ padding: '0.3rem', fontSize: '0.8rem', width: 'auto' }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select value={u.role} onChange={e => updateRole(u.id, e.target.value)}
                style={{ padding: '0.3rem', fontSize: '0.8rem', width: 'auto' }}>
                <option value="subscriber">Subscriber</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}