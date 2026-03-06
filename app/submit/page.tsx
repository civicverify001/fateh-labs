"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

interface FormState {
  kid_name: string;
  title: string;
  url: string;
}

interface FieldErrors {
  kid_name?: string;
  title?: string;
  url?: string;
}

function validateForm(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  const trimName = form.kid_name.trim();
  if (!trimName) {
    errors.kid_name = "First name is required.";
  } else if (/\s/.test(trimName)) {
    errors.kid_name = "Enter your first name only — no spaces.";
  } else if (!/^[a-zA-Z'-]+$/.test(trimName)) {
    errors.kid_name = "Name can only contain letters, hyphens, or apostrophes.";
  }

  if (!form.title.trim()) {
    errors.title = "Project title is required.";
  }

  const urlTrim = form.url.trim();
  if (!urlTrim) {
    errors.url = "Project URL is required.";
  } else {
    try {
      const parsed = new URL(urlTrim);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        errors.url = "URL must start with http:// or https://";
      }
    } catch {
      errors.url = "Please enter a valid URL (e.g. https://myapp.vercel.app).";
    }
  }

  return errors;
}

export default function SubmitPage() {
  const [form, setForm] = useState<FormState>({ kid_name: "", title: "", url: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");

    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kid_name: form.kid_name.trim(),
          title: form.title.trim(),
          url: form.url.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setSuccess(true);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="container section" style={{ maxWidth: 500 }}>
        <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ marginBottom: ".5rem" }}>Project submitted!</h2>
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
            Your project is on the leaderboard. Good luck!
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/leaderboard" className="btn btn-primary">
              📊 View Leaderboard
            </Link>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSuccess(false);
                setForm({ kid_name: "", title: "", url: "" });
              }}
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section" style={{ maxWidth: 520 }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: ".5rem" }}>
        Submit Your Project 🚀
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        Built something cool? Share it with the community!
      </p>

      {serverError && <div className="alert alert-error">⚠️ {serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="kid_name">Your First Name</label>
          <input
            id="kid_name"
            name="kid_name"
            type="text"
            placeholder="e.g. Fateh"
            value={form.kid_name}
            onChange={handleChange}
            autoComplete="given-name"
            maxLength={30}
          />
          {fieldErrors.kid_name && (
            <span className="form-error">{fieldErrors.kid_name}</span>
          )}
          <span className="form-hint">First name only — no last name needed.</span>
        </div>

        <div className="form-group">
          <label htmlFor="title">Project Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. My Awesome Quiz App"
            value={form.title}
            onChange={handleChange}
            maxLength={120}
          />
          {fieldErrors.title && (
            <span className="form-error">{fieldErrors.title}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="url">Live Project URL</label>
          <input
            id="url"
            name="url"
            type="url"
            placeholder="https://my-project.vercel.app"
            value={form.url}
            onChange={handleChange}
          />
          {fieldErrors.url && (
            <span className="form-error">{fieldErrors.url}</span>
          )}
          <span className="form-hint">Must be a live link starting with https://</span>
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: "100%" }}>
          {submitting ? "Submitting…" : "Submit Project 🚀"}
        </button>
      </form>
    </div>
  );
}
