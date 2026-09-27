import { requestFormConfig } from "@/config/form";

/**
 * Turns FormData into a urlencoded body. Repeated keys (the category
 * checkboxes) are joined into one comma-separated value so every
 * provider receives a single, readable field.
 */
export function encodeFormData(formData: FormData): string {
  const merged = new Map<string, string[]>();
  formData.forEach((value, key) => {
    if (typeof value !== "string") return;
    const list = merged.get(key) ?? [];
    list.push(value);
    merged.set(key, list);
  });
  const params = new URLSearchParams();
  merged.forEach((values, key) => params.append(key, values.join(", ")));
  return params.toString();
}

export async function submitRequest(
  formData: FormData,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  const { provider, endpoint, name } = requestFormConfig;
  if (provider === "netlify" && !formData.has("form-name")) {
    formData.set("form-name", name);
  }
  const res = await fetcher(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json, text/html",
    },
    body: encodeFormData(formData),
  });
  if (!res.ok) {
    throw new Error(`Request form submission failed: ${res.status}`);
  }
}
