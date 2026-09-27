import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceRail from "@/components/ui/ServiceRail";
import { REQUEST_PATH, requestHref } from "@/config/site";
import { services, type Service } from "@/data/services";

export default function Services() {
  return (
    <section
      id="service"
      aria-labelledby="service-title"
      className="bg-ink text-ivory"
    >
      <div className="mx-auto max-w-[1440px] py-32 md:py-44 lg:py-56">
        <div className="flex flex-col gap-12 px-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <SectionHeading
            index="03"
            title="SERVICE"
            id="service-title"
            lead={
              <>
                「探してほしい。」
                <br />
                その依頼を、RELYへ。
              </>
            }
          />
          <Link
            href={REQUEST_PATH}
            className="label hidden items-center gap-5 text-ivory/80 transition-colors duration-500 hover:text-ivory lg:inline-flex"
            data-reveal="fade"
          >
            REQUEST A SERVICE
            <span className="arrow" aria-hidden="true" />
          </Link>
        </div>

        <ServiceRail count={services.length}>
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </ServiceRail>

        <div className="mt-14 px-6 sm:px-8 lg:hidden">
          <Link href={REQUEST_PATH} className="btn btn-light w-full sm:w-auto">
            REQUEST A SERVICE
            <span className="arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { id, number, name, scope, lead, keywords, checkpoints, note, image } = service;
  return (
    <li
      className="service-card group relative flex w-[80vw] max-w-[22rem] shrink-0 snap-start flex-col overflow-hidden border border-white/10 bg-ink md:w-auto md:max-w-none md:border-0 md:border-b md:border-r lg:min-h-[36rem]"
      data-reveal
      style={{ "--reveal-delay": `${(index % 3) * 0.12}s` } as React.CSSProperties}
    >
      {image ? (
        <div
          className="service-media relative aspect-square overflow-hidden bg-ink-soft sm:aspect-[4/3]"
          style={{ "--reveal-delay": `${0.1 + index * 0.14}s` } as React.CSSProperties}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 80vw"
            className="object-cover"
          />
          {/* shade + title set on the photo (phones / tablets / touch) */}
          <div aria-hidden="true" className="service-shade absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/10" />
          <div aria-hidden="true" className="service-cover absolute inset-0 flex flex-col justify-between p-7 sm:p-9">
            <span className="label self-end text-ivory/70">{scope}</span>
            <div>
              <span className="display block text-[1.5rem] text-silver">{number}</span>
              <span className="display mt-3 block text-[2.375rem] leading-none tracking-[0.1em] text-ivory">{name}</span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative z-10 flex flex-1 flex-col p-7 sm:p-9 lg:p-11">
        <div className={`flex items-baseline justify-between ${image ? "service-head" : ""}`}>
          <span className="display text-[1.75rem] text-silver lg:text-[2rem]" aria-hidden="true">
            {number}
          </span>
          <span className="label text-mist">{scope}</span>
        </div>

        <h3
          className={`display mt-8 text-[2.375rem] tracking-[0.1em] lg:mt-12 lg:text-[3rem] ${image ? "service-head" : ""}`}
        >
          {name}
        </h3>
        <span aria-hidden="true" className={`title-rule ${image ? "service-head" : ""}`} />
        <p className="mt-5 text-[0.9375rem] tracking-[0.08em] text-ivory/90">{lead}</p>

        {keywords.length > 0 ? (
          <p className="mt-6 text-[0.8125rem] leading-[2.1] tracking-[0.08em] text-mist">
            {keywords.join(" / ")}
          </p>
        ) : null}

        {checkpoints ? (
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="label text-mist">{checkpoints.label}</p>
            <p className="mt-2 text-[0.8125rem] tracking-[0.08em] text-ivory/80">
              {checkpoints.items.join("・")}
            </p>
          </div>
        ) : null}

        {note ? (
          <p className="mt-6 text-[0.8125rem] leading-[2.1] tracking-[0.06em] text-ivory/75">{note}</p>
        ) : null}

        <Link
          href={requestHref(id)}
          className="label mt-auto inline-flex items-center gap-5 self-start pt-10 text-ivory/85 transition-colors duration-500 hover:text-ivory"
        >
          <span className="sr-only">{name}：</span>
          このテーマで依頼する
          <span className="arrow" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}
