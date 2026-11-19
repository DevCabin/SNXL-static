"use client";

import { useRef, useState } from "react";
import { FORMSPREE_ENDPOINT, REQUEST_COPY } from "@/data/config";

type Status = "idle" | "sending" | "success" | "error";

const inputCls =
  "w-full border border-ink/30 bg-white px-3 py-2 text-sm placeholder:text-ink/40";

export default function RequestForm({
  productTitle = "",
  productHandle = "",
  sku = null,
  size = "",
  color = "",
  displayedPrice = "",
}: {
  productTitle?: string;
  productHandle?: string;
  sku?: string | null;
  size?: string;
  color?: string;
  displayedPrice?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const gotcha = useRef<HTMLInputElement>(null);

  const sending = status === "sending";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const nextErrors: { name?: string; email?: string } = {};
    if (!name.trim()) nextErrors.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      nextErrors.email = "Please enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    // Honeypot: bots fill this; humans never see it. Silently "succeed".
    if (gotcha.current && gotcha.current.value) {
      setStatus("success");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          size,
          color,
          product_title: productTitle,
          product_handle: productHandle,
          variant_sku: sku || "unreconciled-variant",
          displayed_price: displayedPrice,
          message: notes.trim(),
        }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="border border-lime bg-lime/20 px-4 py-3 text-sm font-bold">
        {REQUEST_COPY.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="req-name" className="text-xs font-bold uppercase tracking-widest">
            Your name *
          </label>
          <input
            id="req-name"
            className={`${inputCls} mt-1`}
            value={name}
            onChange={e => setName(e.target.value)}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "req-name-err" : undefined}
            autoComplete="name"
          />
          {errors.name && (
            <p id="req-name-err" className="mt-1 text-xs text-brandred">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="req-email" className="text-xs font-bold uppercase tracking-widest">
            Email *
          </label>
          <input
            id="req-email"
            type="email"
            className={`${inputCls} mt-1`}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "req-email-err" : undefined}
            autoComplete="email"
          />
          {errors.email && (
            <p id="req-email-err" className="mt-1 text-xs text-brandred">
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="req-notes" className="text-xs font-bold uppercase tracking-widest">
          Notes (optional)
        </label>
        <textarea
          id="req-notes"
          rows={3}
          className={`${inputCls} mt-1`}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Anything we should know?"
        />
      </div>
      <input
        ref={gotcha}
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="bg-lime px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-ink transition-colors hover:bg-lime-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Sending…" : REQUEST_COPY.button}
        </button>
        <p aria-live="polite" role="status" className="text-xs text-ink/70">
          {status === "error"
            ? "Something went wrong sending your request. Please try again."
            : ""}
        </p>
      </div>
    </form>
  );
}
