/**
 * 予約の受付方法。
 *
 * - `phone`  : 電話番号（例: "03-1234-5678"）。空なら電話ボタンは「準備中」表示になります。
 * - `webUrl` : 外部予約サービスのURL（例: "https://..."）。空ならWEB予約ボタンは「準備中」表示になります。
 *
 * どちらか一方だけでも動作します。サイト内の「予約する」ボタンはすべて
 * 予約セクション（/#reserve）に集まるので、ここを変えるだけで全体に反映されます。
 */
export const reservation = {
  phone: "",
  webUrl: "",
  webLabel: "WEBで予約する",
  /** 予約セクションに表示する補足 */
  notes: [
    "ご来店日時・人数をお伝えください。",
    "混雑状況によりご希望に添えない場合があります。",
  ],
} as const;

export type ReserveChannel = {
  kind: "phone" | "web";
  label: string;
  /** null when the channel is not configured yet */
  href: string | null;
  detail?: string;
};

/** Converts a phone number into a `tel:` URI (digits and leading + only). */
export function telHref(phone: string): string | null {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.length >= 6 ? `tel:${digits}` : null;
}

export function reserveChannels(cfg: {
  phone: string;
  webUrl: string;
  webLabel: string;
} = reservation): ReserveChannel[] {
  const web = /^https?:\/\//.test(cfg.webUrl) ? cfg.webUrl : null;
  return [
    { kind: "web", label: cfg.webLabel, href: web },
    {
      kind: "phone",
      label: "電話で予約する",
      href: cfg.phone ? telHref(cfg.phone) : null,
      detail: cfg.phone || undefined,
    },
  ];
}

export function hasReserveChannel(cfg: Parameters<typeof reserveChannels>[0] = reservation): boolean {
  return reserveChannels(cfg).some((c) => c.href);
}
