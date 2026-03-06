"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Challenge } from "@/types";

export default function ChallengePage() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/challenge")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setChallenge(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><div className="spinner" /></div>;

  if (error)
    return (
      <div className="container section">
        <div className="alert alert-error">⚠️ {error}</div>
      </div>
    );

  if (!challenge)
    return (
      <div className="container section">
        <div className="empty">
          <div className="empty-icon">📭</div>
          <p>No active challenge right now. Check back soon!</p>
        </div>
      </div>
    );

  return (
    <div className="container section">
      <p style={{ color: "var(--muted)", marginBottom: ".5rem", fontSize: ".85rem" }}>
        THIS WEEK&apos;S CHALLENGE
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, letterSpacing: "-.5px" }}>
          {challenge.title}
        </h1>
        <span className={`badge badge-${challenge.difficulty}`}>{challenge.difficulty}</span>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          {challenge.description}
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link href="/submit" className="btn btn-primary">
          🚀 Submit My Project
        </Link>
        <Link href="/leaderboard" className="btn btn-secondary">
          📊 View Leaderboard
        </Link>
      </div>

      <p style={{ marginTop: "1.5rem", color: "var(--muted)", fontSize: ".82rem" }}>
        Challenge posted{" "}
        {new Date(challenge.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
}
