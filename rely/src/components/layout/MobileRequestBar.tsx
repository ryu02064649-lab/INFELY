import Link from "next/link";
import { REQUEST_PATH } from "@/config/site";

/** Fixed request bar for small screens. Always one tap away. */
export default function MobileRequestBar() {
  return (
    <div className="mobile-request-bar fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <Link
        href={REQUEST_PATH}
        className="flex h-[3.25rem] items-center justify-between px-6 text-ivory"
      >
        <span className="text-[0.875rem] tracking-[0.18em]">RELYに依頼する</span>
        <span className="flex items-center gap-4">
          <span className="label text-mist">REQUEST</span>
          <span className="arrow" aria-hidden="true" />
        </span>
      </Link>
    </div>
  );
}
