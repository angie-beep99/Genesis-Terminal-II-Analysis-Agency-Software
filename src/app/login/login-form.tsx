"use client";

import { useState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-text-primary">
            Genesis Terminal
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Sign in to your account
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm text-text-muted"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-gold"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-text-muted"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-gold"
              placeholder="Your password"
            />
          </div>

          {error && (
            <p className="text-sm text-negative">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gold py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
