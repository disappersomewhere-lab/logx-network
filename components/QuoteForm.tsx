'use client';

import {FormEvent, useState} from 'react';

type QuoteFormProps = {
  labels: {
    name: string;
    email: string;
    company: string;
    product: string;
    message: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
  };
  /** Pre-fills the product field when arriving from a product page. */
  defaultProduct?: string;
};

export default function QuoteForm({labels, defaultProduct = ''}: QuoteFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('sending');

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      setStatus(response.ok ? 'success' : 'error');
      if (response.ok) form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="quote-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          <span>{labels.name}</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          <span>{labels.email}</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          <span>{labels.company}</span>
          <input name="company" autoComplete="organization" />
        </label>
        <label>
          <span>{labels.product}</span>
          <input name="product" defaultValue={defaultProduct} />
        </label>
      </div>

      <label>
        <span>{labels.message}</span>
        <textarea name="message" required rows={6} />
      </label>

      <input
        className="honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <button className="button button-primary" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? labels.sending : labels.submit}
      </button>

      {status === 'success' && (
        <p className="form-success" role="status">
          {labels.success}
        </p>
      )}
      {status === 'error' && (
        <p className="form-error" role="alert">
          {labels.error}
        </p>
      )}
    </form>
  );
}
