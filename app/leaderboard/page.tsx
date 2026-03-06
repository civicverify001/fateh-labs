"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/types";

export default function LeaderboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setProjects(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const rankLabel = (i: number) => {
    if (i === 0) return <span className="rank-1">🥇 1</span>;
    if (i === 1) return <span className="rank-2">🥈 2</span>;
    if (i === 2) return <span className="rank-3">🥉 3</span>;
    return <span style={{ color: "var(--muted)" }}>{i + 1}</span>;
  };

  return (
    <div className="container section">
      <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: ".5rem" }}>
        Leaderboard 📊
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        Top projects from this week&apos;s challenge.
      </p>

      {loading && <div className="spinner" />}

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {!loading && !error && projects.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🏜️</div>
          <p>No projects yet — be the first to submit!</p>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="leaderboard">
            <thead>
              <tr>
                <th style={{ width: 60 }}>#</th>
                <th>Builder</th>
                <th>Project</th>
                <th>Link</th>
                <th style={{ textAlign: "right" }}>Votes</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p.id}>
                  <td>{rankLabel(i)}</td>
                  <td style={{ fontWeight: 600 }}>{p.kid_name}</td>
                  <td>{p.title}</td>
                  <td>
                    
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: ".85rem" }}
                    >
                      Visit &rarr;
                    </a>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className="votes-pill">⭐ {p.votes}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
