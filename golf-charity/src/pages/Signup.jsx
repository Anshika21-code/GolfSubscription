import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const STEPS = ['Account', 'Plan', 'Charity']

export default function Signup() {
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [plan, setPlan] = useState('monthly')
  const [charities, setCharities] = useState([])
  const [selectedCharity, setSelectedCharity] = useState(null)
  const [charityPercentage, setCharityPercentage] = useState(10)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('charities').select('*').then(({ data }) => setCharities(data || []))
  }, [])

  const handleAccountNext = (e) => {
    e.preventDefault()
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    setStep(1)
  }

  const handleSignup = async () => {
    if (!selectedCharity) return toast.error('Please select a charity')
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { toast.error(error.message); setLoading(false); return }

    const userId = data.user.id
    const renewal = new Date()
    renewal.setMonth(renewal.getMonth() + (plan === 'monthly' ? 1 : 12))

    await supabase.from('profiles').insert({
      id: userId,
      email,
      role: 'subscriber',
      subscription_status: 'active',
      subscription_plan: plan,
      subscription_renewal: renewal.toISOString().split('T')[0],
      charity_id: selectedCharity,
      charity_percentage: charityPercentage
    })

    await supabase.from('subscriptions').insert({
      user_id: userId,
      plan,
      status: 'active',
      renewal_date: renewal.toISOString().split('T')[0]
    })

    toast.success('Account created! Welcome 🎉')
    navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px' }}>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 0.25rem',
                background: i <= step ? 'var(--accent)' : 'var(--border)',
                color: i <= step ? '#0f0f1a' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', fontSize: '0.85rem'
              }}>{i + 1}</div>
              <div style={{ fontSize: '0.75rem', color: i === step ? 'var(--accent)' : 'var(--text-muted)' }}>{s}</div>
            </div>
          ))}
        </div>

        {/* Step 0: Account */}
        {step === 0 && (
          <>
            <h2 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Create Account</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Join the platform</p>
            <form onSubmit={handleAccountNext}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" />
              </div>
              <button className="btn-primary" type="submit" style={{ width: '100%' }}>Next →</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Login</Link>
            </p>
          </>
        )}

        {/* Step 1: Plan */}
        {step === 1 && (
          <>
            <h2 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Choose Your Plan</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Select a subscription plan</p>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              {['monthly', 'yearly'].map(p => (
                <div key={p} onClick={() => setPlan(p)} style={{
                  flex: 1, padding: '1.5rem', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                  border: `2px solid ${plan === p ? 'var(--accent)' : 'var(--border)'}`,
                  background: plan === p ? 'rgba(232,184,75,0.1)' : 'var(--bg3)'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent)' }}>
                    {p === 'monthly' ? '£9.99' : '£99.99'}
                  </div>
                  <div style={{ textTransform: 'capitalize', marginTop: '0.5rem' }}>{p}</div>
                  {p === 'yearly' && <div style={{ color: 'var(--teal)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Save 17%</div>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-secondary" onClick={() => setStep(0)} style={{ flex: 1 }}>← Back</button>
              <button className="btn-primary" onClick={() => setStep(2)} style={{ flex: 1 }}>Next →</button>
            </div>
          </>
        )}

        {/* Step 2: Charity */}
        {step === 2 && (
          <>
            <h2 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Choose a Charity</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>10% of your subscription goes here</p>

            {charities.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                No charities yet — admin will add them soon.
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto', marginBottom: '1rem' }}>
              {charities.map(c => (
                <div key={c.id} onClick={() => setSelectedCharity(c.id)} style={{
                  padding: '1rem', borderRadius: '8px', cursor: 'pointer',
                  border: `2px solid ${selectedCharity === c.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: selectedCharity === c.id ? 'rgba(232,184,75,0.1)' : 'var(--bg3)'
                }}>
                  <div style={{ fontWeight: '600' }}>{c.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.description}</div>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Charity Contribution: {charityPercentage}%</label>
              <input type="range" min="10" max="100" value={charityPercentage}
                onChange={e => setCharityPercentage(Number(e.target.value))}
                style={{ background: 'transparent', border: 'none', padding: 0 }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</button>
              <button className="btn-primary" onClick={handleSignup} style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Creating...' : '🎉 Create Account'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}