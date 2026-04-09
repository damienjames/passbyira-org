"use client";

import { useState } from "react";

import {
  CONTACT_FORM_ENDPOINT,
  NEWSLETTER_FORM_ENDPOINT,
} from "@/lib/site";

type InquiryFormKind = "contact" | "newsletter";

type InquiryFormProps = {
  kind: InquiryFormKind;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

const FORM_CONFIG = {
  contact: {
    endpoint: CONTACT_FORM_ENDPOINT,
    submitLabel: "Send Message",
    fallbackLabel: "Email Your Message",
    successMessage: "Thanks for reaching out. Your note is on its way.",
    fallbackSuccessMessage:
      "Your email app should open with a prefilled draft. Send it when you're ready.",
    heading: "Send a Message",
    description:
      "Use the form for questions, partnership ideas, volunteer interest, or general outreach.",
    mailTo: "connect@passbyira.org",
    subject: "Website inquiry from passbyira.org",
  },
  newsletter: {
    endpoint: NEWSLETTER_FORM_ENDPOINT,
    submitLabel: "Subscribe",
    fallbackLabel: "Email to Subscribe",
    successMessage: "You're signed up. Thanks for staying connected.",
    fallbackSuccessMessage:
      "Your email app should open with a prefilled subscription request.",
    heading: "Get Updates by Email",
    description:
      "Receive program updates, event recaps, and upcoming opportunities without hunting through social feeds.",
    mailTo: "connect@passbyira.org",
    subject: "Newsletter signup from passbyira.org",
  },
} as const;

function buildMailto({
  email,
  subject,
  fields,
}: {
  email: string;
  subject: string;
  fields: Record<string, string>;
}) {
  const body = Object.entries(fields)
    .filter(([, value]) => value.trim())
    .map(([key, value]) => `${key}: ${value.trim()}`)
    .join("\n");

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function InquiryForm({ kind }: InquiryFormProps) {
  const config = FORM_CONFIG[kind];
  const hasEndpoint = Boolean(config.endpoint);
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (String(formData.get("company") || "").trim()) {
      return;
    }

    formData.set("formType", kind);
    formData.set("source", "passbyira.org");

    if (!hasEndpoint) {
      const mailtoUrl = buildMailto({
        email: config.mailTo,
        subject: config.subject,
        fields: Object.fromEntries(
          Array.from(formData.entries())
            .filter(([key]) => key !== "company")
            .map(([key, value]) => [key, String(value)])
        ),
      });

      window.location.href = mailtoUrl;
      setState("success");
      setMessage(config.fallbackSuccessMessage);
      return;
    }

    try {
      setState("submitting");
      setMessage("");

      const response = await fetch(config.endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      form.reset();
      setState("success");
      setMessage(config.successMessage);
    } catch {
      setState("error");
      setMessage("We couldn't submit the form just now. Please email us directly instead.");
    }
  }

  return (
    <section className="form-shell" aria-labelledby={`${kind}-form-heading`}>
      <div className="form-shell__header">
        <div className="section-eyebrow">{kind === "contact" ? "Direct Contact" : "Newsletter Signup"}</div>
        <h3 id={`${kind}-form-heading`} className="form-shell__title">
          {config.heading}
        </h3>
        <p className="form-shell__copy">{config.description}</p>
      </div>

      <form className="inquiry-form" onSubmit={handleSubmit}>
        <div className="sr-only" aria-hidden="true">
          <label htmlFor={`${kind}-company`}>Company</label>
          <input id={`${kind}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {kind === "contact" ? (
          <div className="inquiry-form__grid">
            <label className="field-group">
              <span className="field-group__label">Name</span>
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label className="field-group">
              <span className="field-group__label">Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label className="field-group">
              <span className="field-group__label">How can we help?</span>
              <select name="topic" defaultValue="General inquiry">
                <option>General inquiry</option>
                <option>Volunteer interest</option>
                <option>Donation question</option>
                <option>Partnership or sponsorship</option>
                <option>Press or speaking request</option>
              </select>
            </label>
            <label className="field-group">
              <span className="field-group__label">Phone number</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <label className="field-group field-group--full">
              <span className="field-group__label">Message</span>
              <textarea name="message" rows={5} required />
            </label>
          </div>
        ) : (
          <div className="inquiry-form__grid">
            <label className="field-group">
              <span className="field-group__label">First name</span>
              <input name="firstName" type="text" autoComplete="given-name" required />
            </label>
            <label className="field-group">
              <span className="field-group__label">Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
          </div>
        )}

        <div className="inquiry-form__footer">
          <button
            type="submit"
            className="btn-pbi btn-gold inquiry-form__submit"
            disabled={state === "submitting"}
          >
            {state === "submitting"
              ? "Sending..."
              : hasEndpoint
                ? config.submitLabel
                : config.fallbackLabel}
          </button>
          <p className="inquiry-form__note">
            {hasEndpoint
              ? "Your information is submitted securely through a connected form endpoint."
              : "A dedicated submission endpoint can be connected later through Formspree or Azure. For now, this opens your email app with a draft."}
          </p>
          {message ? (
            <p
              className={`inquiry-form__status inquiry-form__status--${state === "error" ? "error" : "success"}`}
              role={state === "error" ? "alert" : "status"}
            >
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
