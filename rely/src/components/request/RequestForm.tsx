"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestFormConfig } from "@/config/form";
import { serviceCategories } from "@/data/services";
import { submitRequest } from "@/lib/submit-request";
import { validateRequest, type RequestErrors } from "@/lib/validate-request";

type Status = "idle" | "submitting" | "error";

export default function RequestForm() {
  const router = useRouter();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [errors, setErrors] = useState<RequestErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  // Pre-select a category when arriving from a service card (?category=dining).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("category");
    const match = serviceCategories.find((c) => c.id === param);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads a browser-only value once on mount
    if (match) setSelected([match.label]);
  }, []);

  const toggle = (label: string) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label],
    );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const found = validateRequest(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus("submitting");
    try {
      await submitRequest(data);
      router.push(requestFormConfig.successPath);
    } catch {
      setStatus("error");
    }
  };

  const id = (name: string) => `${uid}-${name}`;
  const errorList = Object.values(errors);

  return (
    <form
      ref={formRef}
      name={requestFormConfig.name}
      method="POST"
      action={requestFormConfig.successPath}
      data-netlify="true"
      netlify-honeypot={requestFormConfig.honeypotField}
      onSubmit={onSubmit}
      noValidate
      className="form-stagger space-y-14"
    >
      <input type="hidden" name="form-name" value={requestFormConfig.name} />
      <p className="hidden" aria-hidden="true">
        <label>
          入力しないでください
          <input name={requestFormConfig.honeypotField} tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div
        ref={summaryRef}
        tabIndex={-1}
        role="alert"
        aria-live="assertive"
        className={errorList.length ? "border-l border-[#8a3b2e] pl-5 text-[0.875rem] leading-[2] text-[#8a3b2e] outline-none" : "sr-only"}
      >
        {errorList.length ? (
          <>
            <p className="font-normal">入力内容をご確認ください。</p>
            <ul>
              {errorList.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      <div className="grid gap-14 sm:grid-cols-2 sm:gap-10">
        <Field id={id("name")} label="お名前" en="NAME" required error={errors.name}>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id("name")}-error` : undefined}
            className="field"
          />
        </Field>
        <Field id={id("email")} label="メールアドレス" en="EMAIL" required error={errors.email}>
          <input
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id("email")}-error` : undefined}
            className="field"
          />
        </Field>
      </div>

      <fieldset aria-describedby={`${id("category")}-hint${errors.category ? ` ${id("category")}-error` : ""}`}>
        <legend className="flex items-baseline gap-4">
          <span className="label text-stone">CATEGORY</span>
          <span className="text-[0.9375rem] tracking-[0.08em]">
            依頼カテゴリー<RequiredMark />
          </span>
        </legend>
        <p id={`${id("category")}-hint`} className="mt-2 text-[0.8125rem] tracking-[0.06em] text-stone">
          複数選択できます。決まっていない場合は OTHER をお選びください。
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {serviceCategories.map((c) => {
            const checked = selected.includes(c.label);
            return (
              <label
                key={c.id}
                className={`relative flex min-h-14 cursor-pointer items-center justify-center border px-3 text-center transition-colors duration-500 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ink ${
                  checked
                    ? "border-ink bg-ink text-ivory"
                    : "border-ivory-line text-ink hover:border-ink/60"
                }`}
              >
                <input
                  type="checkbox"
                  name="category"
                  value={c.label}
                  checked={checked}
                  onChange={() => toggle(c.label)}
                  className="sr-only"
                />
                <span className="label text-[0.75rem]">{c.label}</span>
              </label>
            );
          })}
        </div>
        {errors.category ? (
          <p id={`${id("category")}-error`} className="mt-3 text-[0.8125rem] text-[#8a3b2e]">
            {errors.category}
          </p>
        ) : null}
      </fieldset>

      <Field
        id={id("conditions")}
        label="希望条件"
        en="CONDITIONS"
        hint="人数、エリア、雰囲気、相手との関係など。分かる範囲で構いません。"
      >
        <textarea id={id("conditions")} name="conditions" rows={4} className="field" aria-describedby={`${id("conditions")}-hint`} />
      </Field>

      <div className="grid gap-14 sm:grid-cols-2 sm:gap-10">
        <Field id={id("budget")} label="予算" en="BUDGET" hint="例：1人 10,000円程度">
          <input id={id("budget")} name="budget" type="text" className="field" aria-describedby={`${id("budget")}-hint`} />
        </Field>
        <Field id={id("date")} label="希望日時" en="DATE" hint="例：来月の週末、夜">
          <input id={id("date")} name="date" type="text" className="field" aria-describedby={`${id("date")}-hint`} />
        </Field>
      </div>

      <Field
        id={id("message")}
        label="その他の要望・自由記入"
        en="MESSAGE"
        hint="「何を探しているか分からない」という段階でも、そのままお書きください。"
      >
        <textarea id={id("message")} name="message" rows={6} className="field" aria-describedby={`${id("message")}-hint`} />
      </Field>

      <div>
        <label htmlFor={id("consent")} className="flex cursor-pointer items-start gap-4">
          <input
            id={id("consent")}
            name="consent"
            type="checkbox"
            value="yes"
            required
            aria-required="true"
            aria-invalid={!!errors.consent}
            aria-describedby={`${id("consent")}-note${errors.consent ? ` ${id("consent")}-error` : ""}`}
            className="mt-[0.35em] size-4 shrink-0 accent-ink"
          />
          <span className="text-[0.875rem] leading-[2] tracking-[0.04em]">
            <Link href="/privacy/" className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink" target="_blank">
              プライバシーポリシー
            </Link>
            に同意します（レストランの予約を代行する際に、予約先へ必要な範囲でお名前などを伝えることを含みます）。
            <RequiredMark />
            <span className="sr-only">（必須）</span>
          </span>
        </label>
        {errors.consent ? (
          <p id={`${id("consent")}-error`} className="mt-3 text-[0.8125rem] text-[#8a3b2e]">
            {errors.consent}
          </p>
        ) : null}
        <p id={`${id("consent")}-note`} className="mt-5 text-[0.8125rem] leading-[2] tracking-[0.04em] text-stone">
          このフォームは、ご相談・お見積もりの受付です。送信後、内容を確認してお見積もりをメールでお送りします。お見積もりにご同意いただいた時点で、正式なご依頼となります（
          <Link href="/legal/" className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink" target="_blank">
            特定商取引法に基づく表記
          </Link>
          ）。
        </p>
      </div>

      <div className="flex flex-col gap-6 border-t border-ivory-line pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.8125rem] leading-[2] tracking-[0.06em] text-stone">
          <RequiredMark /> は必須項目です。
        </p>
        <button
          type="submit"
          className="btn btn-dark w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-[16rem]"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "SENDING" : "REQUEST"}
          <span className="arrow" aria-hidden="true" />
        </button>
      </div>

      <p role="status" aria-live="polite" className={status === "error" ? "text-[0.875rem] leading-[2] text-[#8a3b2e]" : "sr-only"}>
        {status === "error"
          ? "送信できませんでした。通信環境をご確認のうえ、時間をおいて再度お試しください。"
          : status === "submitting"
            ? "送信しています。"
            : ""}
      </p>
    </form>
  );
}

function RequiredMark() {
  return (
    <span className="ml-1 text-stone" aria-hidden="true">
      *
    </span>
  );
}

function Field({
  id,
  label,
  en,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  en: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline gap-4">
        <span className="label text-stone">{en}</span>
        <span className="text-[0.9375rem] tracking-[0.08em]">
          {label}
          {required ? <RequiredMark /> : null}
          {required ? <span className="sr-only">（必須）</span> : null}
        </span>
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="mt-3 text-[0.8125rem] tracking-[0.06em] text-stone">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-3 text-[0.8125rem] text-[#8a3b2e]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
