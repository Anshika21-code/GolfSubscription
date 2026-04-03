import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg2)', borderTop: '1px solid var(--border)',
      padding: '3rem 2rem 2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.75rem' }}>⛳ GolfCharity</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>
              Golf performance tracking meets charitable giving. Subscribe, play, win, and give back.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: '700', marginBottom: '0.75rem' }}>Platform</div>
            {[
              { label: 'How It Works', to: '/' },
              { label: 'Charities', to: '/charities' },
              { label: 'Winners', to: '/winners' },
              { label: 'Draw Results', to: '/draw' },
            ].map(l => (
              <Link key={l.label} to={l.to} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.5rem' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: '700', marginBottom: '0.75rem' }}>Account</div>
            {[
              { label: 'Sign Up', to: '/signup' },
              { label: 'Login', to: '/login' },
              { label: 'Dashboard', to: '/dashboard' },
              { label: 'My Scores', to: '/scores' },
            ].map(l => (
              <Link key={l.label} to={l.to} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.5rem' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: '700', marginBottom: '0.75rem' }}>Prize Pool</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 2 }}>
              <div>🏆 5 Match — <span style={{ color: 'var(--accent)' }}>40% Jackpot</span></div>
              <div>🥈 4 Match — <span style={{ color: 'var(--teal)' }}>35% Prize</span></div>
              <div>🥉 3 Match — <span style={{ color: '#9a9ab0' }}>25% Prize</span></div>
              <div style={{ marginTop: '0.5rem' }}> 10%+ to Charity</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © 2026 GolfCharity. All rights reserved.
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Built for golfers who give back
          </div>
        </div>
      </div>
    </footer>
  )
}