import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        minHeight: '90vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '2rem', background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f1a 70%)'
      }}>
        <div style={{
          background: 'rgba(232,184,75,0.1)', border: '1px solid var(--accent)',
          borderRadius: '20px', padding: '0.4rem 1rem', fontSize: '0.85rem',
          color: 'var(--accent)', marginBottom: '1.5rem'
        }}>
          Golf • Charity • Monthly Draws
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', lineHeight: 1.2, marginBottom: '1.5rem' }}>
          Play Golf.<br />
          <span style={{ color: 'var(--accent)' }}>Win Prizes.</span><br />
          Change Lives.
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '550px', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Subscribe to track your golf performance, enter monthly prize draws, 
          and support the charity of your choice — all in one platform.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/signup"><button className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>Get Started →</button></Link>
          <Link to="/charities"><button className="btn-secondary" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>View Charities</button></Link>
        </div>
      </div>

      {/* Features */}
      <div className="page">
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>
          How It <span style={{ color: 'var(--accent)' }}>Works</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: '🏌️', title: 'Track Scores', desc: 'Enter your last 5 golf scores in Stableford format. Your scores become your draw numbers.' },
            { icon: '🎰', title: 'Monthly Draws', desc: 'Every month, numbers are drawn. Match 3, 4, or 5 to win prizes from the prize pool.' },
            { icon: '❤️', title: 'Support Charity', desc: '10% of every subscription goes to your chosen charity. You can increase this anytime.' },
            { icon: '🏆', title: 'Win & Give', desc: 'Winners verify their scores and get paid. Jackpots roll over if unclaimed.' },
          ].map(f => (
            <div key={f.title} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Prize Pool */}
        <div className="card" style={{ marginTop: '4rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '2rem' }}>Prize Pool <span style={{ color: 'var(--accent)' }}>Distribution</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { match: '5-Number Match', pool: '40%', tag: '🏆 Jackpot', color: 'var(--accent)' },
              { match: '4-Number Match', pool: '35%', tag: '🥈 Major Prize', color: 'var(--teal)' },
              { match: '3-Number Match', pool: '25%', tag: '🥉 Prize', color: '#9a9ab0' },
            ].map(p => (
              <div key={p.match} style={{ padding: '1.5rem', background: 'var(--bg3)', borderRadius: '12px', border: `1px solid ${p.color}` }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: p.color }}>{p.pool}</div>
                <div style={{ fontWeight: '600', margin: '0.5rem 0' }}>{p.match}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}