import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero">
        <h1>
          Build. Ship. <span className="highlight">Win.</span>
        </h1>
        <p>
          Weekly coding challenges for young builders. Submit your project,
          climb the leaderboard, and level up your skills.
        </p>
        <div className="hero-actions">
          <Link href="/challenge" className="btn btn-primary">
            🏆 See This Week&apos;s Challenge
          </Link>
          <Link href="/submit" className="btn btn-secondary">
            🚀 Submit a Project
          </Link>
        </div>
      </section>

      <section className="section">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <FeatureCard emoji="🎯" title="Weekly Challenges" body="New challenges every week — from simple games to web apps." />
          <FeatureCard emoji="🌐" title="Real Projects" body="Submit a live URL and show the world what you built." />
          <FeatureCard emoji="📊" title="Leaderboard" body="Rise through the ranks. Top builders get recognised." />
        </div>
      </section>

      <section className="section">
        <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: ".75rem" }}>👇</div>
          <h2 style={{ marginBottom: ".5rem" }}>Ready to start?</h2>
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
            Check out the current challenge and start building!
          </p>
          <Link href="/challenge" className="btn btn-primary">
            View Challenge
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  body,
}: {
  emoji: string;
  title: string;
  body: string;
}) {
  return (
    <div className="card">
      <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>{emoji}</div>
      <h3 style={{ marginBottom: ".4rem" }}>{title}</h3>
      <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>{body}</p>
    </div>
  );
}
