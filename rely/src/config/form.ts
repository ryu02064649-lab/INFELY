/**
 * Request form delivery settings.
 *
 * Default: Netlify Forms. Netlify detects the form in the static HTML at
 * deploy time (by `data-netlify` + the hidden `form-name` field) and accepts
 * urlencoded POSTs to any static path.
 *
 * To switch providers (Formspree, a custom API, etc.), change `provider`
 * and `endpoint` here. `lib/submit-request.ts` reads only this object.
 */
export type FormProvider = "netlify" | "custom";

export const requestFormConfig: {
  name: string;
  provider: FormProvider;
  endpoint: string;
  /** Page shown after a successful submission (also used as the no-JS action). */
  successPath: string;
  honeypotField: string;
} = {
  name: "request",
  provider: "netlify",
  endpoint: "/",
  successPath: "/request/thanks/",
  honeypotField: "bot-field",
};
