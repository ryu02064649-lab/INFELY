import Image from "next/image";
import { site } from "@/config/site";

/**
 * First-visit opening: the emblem comes into focus on black, a light passes
 * over it, a hairline draws, the name appears, then the veil lifts.
 *
 * Pure CSS. It only shows when the head script adds `with-opening` to
 * <html> (first visit in this tab, motion allowed, JS on); otherwise it is
 * never rendered visible.
 */
export default function Opening() {
  return (
    <div aria-hidden="true" className="opening">
      <div className="opening-inner">
        <div className="opening-emblem">
          <Image src="/images/emblem.webp" alt="" width={460} height={460} priority />
          <span className="opening-glint" />
        </div>
        <span className="opening-line" />
        <span className="opening-name display">{site.name}</span>
      </div>
    </div>
  );
}
