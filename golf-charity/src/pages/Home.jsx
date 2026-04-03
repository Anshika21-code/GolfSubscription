export default function Home() {
  return (
    <div style={{ fontFamily: "'Georgia', serif", overflow: 'hidden' }}>

      {/* HERO */}
      <div style={{
        minHeight: '100vh', position: 'relative',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', padding: '2rem',
        background: 'linear-gradient(135deg, #0a0a12 0%, #0f0f1a 40%, #1a1a0a 100%)',
        overflow: 'hidden'
      }}>
        {/* Animated orbs */}
        <div style={{
          position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,184,75,0.08) 0%, transparent 70%)',
          top: '-100px', right: '-100px', animation: 'pulse 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78,204,163,0.06) 0%, transparent 70%)',
          bottom: '-50px', left: '-50px', animation: 'pulse 8s ease-in-out infinite reverse'
        }} />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(#e8b84b 1px, transparent 1px), linear-gradient(90deg, #e8b84b 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');
          @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
          @keyframes shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
          .hero-tag { animation: fadeUp 0.6s ease forwards; }
          .hero-h1 { animation: fadeUp 0.6s 0.15s ease forwards; opacity:0; font-family:'Playfair Display',serif; }
          .hero-sub { animation: fadeUp 0.6s 0.3s ease forwards; opacity:0; font-family:'DM Sans',sans-serif; }
          .hero-btns { animation: fadeUp 0.6s 0.45s ease forwards; opacity:0; }
          .stat-card:hover { transform: translateY(-4px); border-color: var(--accent) !important; }
          .stat-card { transition: all 0.3s ease; }
          .feature-card:hover { transform: translateY(-6px); border-color: rgba(232,184,75,0.5) !important; }
          .feature-card { transition: all 0.3s ease; }
          .glow-btn:hover { box-shadow: 0 0 30px rgba(232,184,75,0.4); transform: translateY(-2px); }
          .glow-btn { transition: all 0.3s ease; }
        `}</style>

        {/* Badge */}
        <div className="hero-tag" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(232,184,75,0.08)', border: '1px solid rgba(232,184,75,0.3)',
          borderRadius: '100px', padding: '0.5rem 1.25rem', marginBottom: '2rem',
          fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'var(--accent)', fontFamily: "'DM Sans', sans-serif"
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          Golf · Charity · Monthly Draws
        </div>

        {/* Headline */}
        <h1 className="hero-h1" style={{
          fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: '900', lineHeight: 1.05,
          marginBottom: '1.5rem', maxWidth: '900px'
        }}>
          Play Golf.<br />
          <span style={{
            background: 'linear-gradient(90deg, #e8b84b, #f0c96a, #e8b84b)',
            backgroundSize: '200%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'shimmer 3s linear infinite'
          }}>Win Prizes.</span><br />
          Change Lives.
        </h1>

        <p className="hero-sub" style={{
          fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '560px',
          lineHeight: 1.8, marginBottom: '3rem', fontWeight: '300'
        }}>
          A subscription platform where your golf scores become lottery numbers —
          and every ticket supports a charity you believe in.
        </p>

        <div className="hero-btns" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/signup">
            <button className="glow-btn" style={{
              background: 'var(--accent)', color: '#0a0a12', fontWeight: '700',
              padding: '1rem 2.5rem', fontSize: '1rem', borderRadius: '100px',
              fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.02em'
            }}>Start Playing →</button>
          </a>
          <a href="/charities">
            <button style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--text)', padding: '1rem 2.5rem', fontSize: '1rem',
              borderRadius: '100px', fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.3s', cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(232,184,75,0.5)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}>
              View Charities
            </button>
          </a>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: '1px', marginTop: '5rem',
          background: 'rgba(255,255,255,0.05)', borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
          flexWrap: 'wrap'
        }}>
          {[
            { val: '£9.99', label: 'Per Month' },
            { val: '40%', label: 'Jackpot Pool' },
            { val: '10%', label: 'To Charity' },
            { val: 'Monthly', label: 'Prize Draws' },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{
              padding: '1.5rem 2.5rem', textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent)', fontFamily: "'Playfair Display', serif" }}>{s.val}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: '6rem 2rem', background: '#0d0d1a', position: 'relative' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ color: 'var(--accent)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'DM Sans', sans-serif" }}>The Process</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Playfair Display', serif", fontWeight: '700' }}>
              How It Works
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { num: '01', icon: '🏌️', title: 'Subscribe', desc: 'Choose monthly or yearly. Your subscription funds the prize pool and your chosen charity.' },
              { num: '02', icon: '📊', title: 'Track Scores', desc: 'Enter your last 5 Stableford golf scores. These become your unique draw numbers.' },
              { num: '03', icon: '🎰', title: 'Monthly Draw', desc: 'Every month, 5 numbers are drawn. Match 3, 4, or 5 to claim prizes from the pool.' },
              { num: '04', icon: '❤️', title: 'Give Back', desc: 'Win or lose, 10%+ of your subscription goes to the charity you selected at signup.' },
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{
                padding: '2rem', borderRadius: '16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: '1rem', right: '1.25rem',
                  fontSize: '3.5rem', fontWeight: '900', opacity: '0.04',
                  fontFamily: "'Playfair Display', serif", color: 'var(--accent)'
                }}>{f.num}</div>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRIZE POOL */}
      <div style={{ padding: '6rem 2rem', background: '#0a0a12' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: 'var(--accent)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'DM Sans', sans-serif" }}>Prize Structure</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Playfair Display', serif", fontWeight: '700', marginBottom: '3rem' }}>
            How Prizes Are Split
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { match: '5 Numbers', pct: '40%', label: 'Jackpot', desc: 'Rolls over if unclaimed', color: '#e8b84b', glow: 'rgba(232,184,75,0.15)' },
              { match: '4 Numbers', pct: '35%', label: 'Major Prize', desc: 'Split among winners', color: '#4ecca3', glow: 'rgba(78,204,163,0.1)' },
              { match: '3 Numbers', pct: '25%', label: 'Prize', desc: 'Split among winners', color: '#9a9ab0', glow: 'rgba(154,154,176,0.08)' },
            ].map((p, i) => (
              <div key={i} style={{
                padding: '2.5rem 1.5rem', borderRadius: '16px',
                background: p.glow,
                border: `1px solid ${p.color}30`,
                position: 'relative'
              }}>
                {i === 0 && <div style={{
                  position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--accent)', color: '#0a0a12', fontSize: '0.65rem',
                  fontWeight: '800', letterSpacing: '0.1em', padding: '0.2rem 0.75rem',
                  borderRadius: '0 0 8px 8px', fontFamily: "'DM Sans', sans-serif"
                }}>JACKPOT</div>}
                <div style={{ fontSize: '3rem', fontWeight: '900', color: p.color, fontFamily: "'Playfair Display', serif" }}>{p.pct}</div>
                <div style={{ fontWeight: '700', margin: '0.5rem 0', fontFamily: "'DM Sans', sans-serif" }}>{p.match}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        padding: '6rem 2rem', textAlign: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a0f 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', width: '800px', height: '800px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,184,75,0.05) 0%, transparent 60%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
        }} />
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: "'Playfair Display', serif", fontWeight: '900', marginBottom: '1rem' }}>
            Ready to <span style={{ color: 'var(--accent)' }}>Play?</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>
            Join golfers who are winning prizes and supporting charities they care about.
          </p>
          <a href="/signup">
            <button className="glow-btn" style={{
              background: 'var(--accent)', color: '#0a0a12', fontWeight: '700',
              padding: '1.1rem 3rem', fontSize: '1.05rem', borderRadius: '100px',
              fontFamily: "'DM Sans', sans-serif"
            }}>Get Started Free →</button>
          </a>
        </div>
      </div>

    </div>
  )
}