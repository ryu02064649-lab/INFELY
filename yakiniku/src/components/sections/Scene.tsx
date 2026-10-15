import { scenes } from "@/data/content";
import SectionHeading from "@/components/ui/SectionHeading";
import SceneIcon from "@/components/ui/SceneIcon";

const tilts = ["-1.5deg", "1deg", "-0.5deg", "1.5deg", "-1deg", "0.5deg"];
const bgs = ["bg-white", "bg-red-soft", "bg-white", "bg-red-soft", "bg-white", "bg-red-soft"];

export default function Scene() {
  return (
    <section id="scene" aria-labelledby="scene-title" className="relative overflow-hidden bg-yellow py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <SectionHeading en="SCENE" title={["こんな日は、", "焼肉にしよう。"]} variant="label" id="scene-title">
          <p className="text-ink/80">気の合う仲間とも、大切な人とも。いろんな「いいね」の日に。</p>
        </SectionHeading>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {scenes.map((s, i) => (
            <li
              key={s.title}
              data-reveal
              style={{ "--d": `${(i % 3) * 0.08}s` } as React.CSSProperties}
            >
              <div
                className={`flex h-full flex-col items-center rounded-[22px] border-[2.5px] border-ink p-4 text-center shadow-[0_5px_0_var(--color-ink)] transition-transform duration-300 pointer-fine:hover:rotate-0 sm:p-6 md:flex-row md:items-center md:gap-5 md:text-left ${bgs[i]}`}
                style={{ rotate: tilts[i] }}
              >
                <SceneIcon kind={s.icon} className="size-20 shrink-0 sm:size-24" />
                <div>
                  <h3 className="font-display mt-2 text-[1.05rem] sm:text-[1.25rem] md:mt-0">{s.title}</h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-brown sm:text-[0.875rem]">{s.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-[0.8125rem] font-bold text-ink/75">
          ※個室・貸切・お祝いプレートなどの対応は店舗にお問い合わせください（対応内容は準備中です）。
        </p>
      </div>
    </section>
  );
}
