import { sns } from "@/config/site";

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** “Follow us on Instagram” card. Shows a disabled state until the URL is set. */
export default function InstagramFollow({ className = "" }: { className?: string }) {
  const url = /^https?:\/\//.test(sns.instagram) ? sns.instagram : null;
  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-[24px] border-[2.5px] border-ink bg-ivory px-5 py-6 text-center text-ink shadow-[0_6px_0_var(--color-ink)] sm:flex-row sm:text-left ${className}`}
    >
      <span className="grid size-14 shrink-0 place-items-center rounded-2xl border-[2.5px] border-ink bg-[linear-gradient(135deg,#ffc21a,#ff8a1f_40%,#d7261e_75%,#a8150f)] text-ivory">
        <InstagramIcon className="size-8" />
      </span>
      <p className="flex-1">
        <span className="font-display block text-[1.1rem]">焼きたての様子、Instagramで。</span>
        <span className="mt-1 block text-[0.8125rem] font-bold text-brown">
          おすすめメニューやお店の最新情報を発信{url ? "しています" : "する予定です"}。
        </span>
      </p>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn min-h-12 bg-red px-6 text-[0.95rem] text-ivory">
          フォローする
          <span className="sr-only">（Instagram・新しいタブで開きます）</span>
        </a>
      ) : (
        <span aria-disabled="true" className="btn min-h-12 bg-white px-6 text-[0.95rem] text-ink">
          準備中
        </span>
      )}
    </div>
  );
}
