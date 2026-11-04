export type RequestErrors = Partial<Record<"name" | "email" | "category" | "consent", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Client-side checks for the request form. Name, email, category and consent are required. */
export function validateRequest(data: FormData): RequestErrors {
  const errors: RequestErrors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  if (!name) errors.name = "お名前をご入力ください。";
  if (!email) errors.email = "メールアドレスをご入力ください。";
  else if (!EMAIL_RE.test(email)) errors.email = "メールアドレスの形式をご確認ください。";
  if (data.getAll("category").length === 0)
    errors.category = "カテゴリーをひとつ以上お選びください。迷う場合は OTHER をお選びください。";
  if (data.get("consent") !== "yes")
    errors.consent = "プライバシーポリシーへの同意が必要です。";
  return errors;
}
