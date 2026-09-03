"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  login,
  register,
  requestPasswordReset,
  updatePassword,
  type AuthResult,
} from "@/app/auth/actions";

/** Auth forms in the site's design system. `intent=premium` in the URL
 *  carries a purchase through signup/login straight into checkout. */

const inputCls =
  "w-full rounded-md border border-input bg-background px-4 py-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40";
const btnCls =
  "inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60";

function PasswordField({ id, label }: { id: string; label: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-brand-accent-text text-xs font-semibold hover:underline"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <input
        id={id}
        name="password"
        type={show ? "text" : "password"}
        required
        minLength={8}
        autoComplete={
          id === "new-password" ? "new-password" : "current-password"
        }
        className={`mt-2 ${inputCls}`}
      />
    </div>
  );
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const intent = params.get("intent") === "premium" ? "premium" : "account";
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("intent", intent);
    setError("");
    setMessage("");
    startTransition(async () => {
      const action = mode === "signup" ? register : login;
      let result: AuthResult | undefined;
      try {
        result = await action(formData);
      } catch {
        // Successful auth redirects by throwing — nothing to handle here.
        return;
      }
      if (!result) return;
      if (result.exists) {
        router.push(`/login?intent=${intent}&exists=1`);
        return;
      }
      if (result.error) setError(result.error);
      if (result.message) setMessage(result.message);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="auth-email" className="text-sm font-semibold">
          Email address
        </label>
        <input
          id="auth-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={`mt-2 ${inputCls}`}
        />
      </div>
      <PasswordField
        id={mode === "signup" ? "new-password" : "current-password"}
        label={
          mode === "signup" ? "Choose a password (8+ characters)" : "Password"
        }
      />
      <button type="submit" disabled={pending} className={btnCls}>
        {pending
          ? "One moment…"
          : mode === "signup"
            ? intent === "premium"
              ? "Create account & continue to payment"
              : "Create my account"
            : intent === "premium"
              ? "Log in & continue to payment"
              : "Log in"}
      </button>
      <p
        aria-live="polite"
        className={error ? "text-sm text-red-600" : "sr-only"}
      >
        {error}
      </p>
      <p
        aria-live="polite"
        className={message ? "text-brand-accent-text text-sm" : "sr-only"}
      >
        {message}
      </p>
      {mode === "login" ? (
        <p className="text-muted-foreground text-sm">
          <Link
            href="/forgot-password"
            className="text-brand-accent-text font-semibold hover:underline"
          >
            Forgot your password?
          </Link>
        </p>
      ) : null}
    </form>
  );
}

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError("");
    startTransition(async () => {
      const result = await requestPasswordReset(formData);
      if (result.error) setError(result.error);
      if (result.message) setMessage(result.message);
    });
  }

  if (message)
    return <p className="text-muted-foreground leading-relaxed">{message}</p>;
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="fp-email" className="text-sm font-semibold">
          Email address
        </label>
        <input
          id="fp-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={`mt-2 ${inputCls}`}
        />
      </div>
      <button type="submit" disabled={pending} className={btnCls}>
        {pending ? "One moment…" : "Send reset link"}
      </button>
      <p
        aria-live="polite"
        className={error ? "text-sm text-red-600" : "sr-only"}
      >
        {error}
      </p>
    </form>
  );
}

export function ResetPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError("");
    startTransition(async () => {
      let result: AuthResult | undefined;
      try {
        result = await updatePassword(formData);
      } catch {
        return; // success redirects
      }
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <PasswordField id="new-password" label="New password (8+ characters)" />
      <button type="submit" disabled={pending} className={btnCls}>
        {pending ? "One moment…" : "Set new password"}
      </button>
      <p
        aria-live="polite"
        className={error ? "text-sm text-red-600" : "sr-only"}
      >
        {error}
      </p>
    </form>
  );
}
