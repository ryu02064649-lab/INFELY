export type RequestErrors = Partial<Record<"name" | "email" | "category", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Client-side checks for the request form. Only name, email and category are required. */
export function validateRequest(data: FormData): RequestErrors {
  const errors: RequestErrors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  if (!name) errors.name = "お名前をご入力ください。";
  if (!email) errors.email = "メールアドレスをご入力ください。";
  else if (!EMAIL_RE.test(email)) errors.email = "メールアドレスの形式をご確認ください。";
  if (data.getAll("category").length === 0)
    errors.category = "カテゴリーをひとつ以上お選びください。迷う場合は OTHER をお選びください。";
  return errors;
}
