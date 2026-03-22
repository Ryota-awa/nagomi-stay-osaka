"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Train, ChevronRight, Users, Home, Wifi, UtensilsCrossed, WashingMachine, AirVent, Tv, Bath } from "lucide-react";
import { PROPERTY } from "@/lib/constants";
import { HeroSlider } from "@/components/HeroSlider";
import { useLang } from "@/lib/language-context";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi size={22} />,
  kitchen: <UtensilsCrossed size={22} />,
  "washing-machine": <WashingMachine size={22} />,
  "air-vent": <AirVent size={22} />,
  tv: <Tv size={22} />,
  bath: <Bath size={22} />,
  "hair-dryer": <Bath size={22} />,
  utensils: <UtensilsCrossed size={22} />,
  shirt: <Home size={22} />,
  parking: <Home size={22} />,
};

export default function HomePage() {
  const { t } = useLang();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[600px] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70 z-10" />
        <HeroSlider />

        <div className="relative z-20 max-w-6xl mx-auto px-4 pb-16 w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 text-white"
            style={{ background: "var(--md-primary)" }}>
            ★ {t.hero.badge}
          </div>

          <h1 className="text-white text-4xl md:text-6xl font-light mb-3 drop-shadow-lg tracking-tight">
            {t.hero.title}
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-6 font-light">{t.hero.subtitle}</p>

          {/* Spec chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { icon: <Train size={13} />, label: t.hero.specs.station },
              { icon: <Home size={13} />, label: t.hero.specs.area },
              { icon: <Users size={13} />, label: t.hero.specs.guests },
            ].map((s) => (
              <span key={s.label}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-white/90 border border-white/30 backdrop-blur-sm">
                {s.icon}{s.label}
              </span>
            ))}
          </div>

          <Link href="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-medium text-base shadow-lg transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--md-primary)" }}>
            {t.hero.cta} <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────── */}
      <section style={{ background: "var(--md-primary-container)" }}>
        <div className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: t.stats.area, value: `${PROPERTY.specs.area}㎡` },
            { label: t.stats.maxGuests, value: `${PROPERTY.specs.maxGuests}` },
            { label: t.stats.bedrooms, value: `${PROPERTY.specs.bedrooms}` },
            { label: t.stats.rating, value: `${PROPERTY.rating.score}/${PROPERTY.rating.maxScore}` },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-medium" style={{ color: "var(--md-primary)" }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--md-on-primary-container)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--md-primary)" }}>
            {t.about.label}
          </p>
          <h2 className="text-3xl font-light mb-5" style={{ color: "var(--md-on-surface)" }}>
            {t.about.title}
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: "var(--md-on-surface-variant)" }}>
            {t.about.description}
          </p>

          <p className="text-sm font-medium mb-3" style={{ color: "var(--md-on-surface)" }}>{t.about.nearby}</p>
          <ul className="space-y-2">
            {PROPERTY.nearbyAttractions.map((a) => (
              <li key={a.name} className="flex items-center gap-3 text-sm" style={{ color: "var(--md-on-surface-variant)" }}>
                <ChevronRight size={14} style={{ color: "var(--md-primary)" }} className="shrink-0" />
                <span className="font-medium" style={{ color: "var(--md-on-surface)" }}>{a.name}</span>
                <span className="opacity-60">— {a.distance}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { n: 2, cls: "col-span-2 row-span-2", aspect: "aspect-[4/3]" },
            { n: 3, cls: "col-span-1", aspect: "aspect-square" },
            { n: 7, cls: "col-span-1", aspect: "aspect-square" },
            { n: 4, cls: "col-span-1", aspect: "aspect-square" },
            { n: 5, cls: "col-span-1", aspect: "aspect-square" },
            { n: 8, cls: "col-span-1", aspect: "aspect-square" },
          ].map(({ n, cls, aspect }) => (
            <div key={n} className={`relative ${cls} ${aspect} rounded-2xl overflow-hidden`}
              style={{ boxShadow: "var(--md-shadow-1)" }}>
              <Image
                src={`/images/room-${n}.jpg`}
                alt={`The Nagomi Stay Osaka photo ${n}`}
                fill className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 33vw, 20vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Amenities ─────────────────────────────────────── */}
      <section id="amenities" style={{ background: "var(--md-surface-variant)" }} className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-center" style={{ color: "var(--md-primary)" }}>
            {t.amenities.label}
          </p>
          <h2 className="text-3xl font-light mb-12 text-center" style={{ color: "var(--md-on-surface)" }}>
            {t.amenities.title}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {PROPERTY.amenities.map((amenity) => (
              <div key={amenity.label}
                className="bg-white rounded-3xl p-5 flex flex-col items-center gap-3 transition-shadow hover:shadow-md"
                style={{ boxShadow: "var(--md-shadow-1)" }}>
                <span style={{ color: "var(--md-primary)" }}>
                  {amenityIcons[amenity.icon] ?? <Home size={22} />}
                </span>
                <span className="text-xs text-center font-medium" style={{ color: "var(--md-on-surface)" }}>
                  {amenity.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Access ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--md-primary)" }}>
            {t.access.label}
          </p>
          <h2 className="text-3xl font-light mb-6" style={{ color: "var(--md-on-surface)" }}>{t.access.title}</h2>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--md-primary-container)" }}>
                <MapPin size={18} style={{ color: "var(--md-primary)" }} />
              </span>
              <div>
                <div className="font-medium text-sm mb-0.5" style={{ color: "var(--md-on-surface)" }}>{t.access.address}</div>
                <div className="text-sm" style={{ color: "var(--md-on-surface-variant)" }}>{PROPERTY.address.full}</div>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--md-primary-container)" }}>
                <Train size={18} style={{ color: "var(--md-primary)" }} />
              </span>
              <div>
                <div className="font-medium text-sm mb-0.5" style={{ color: "var(--md-on-surface)" }}>{t.access.station}</div>
                <div className="text-sm" style={{ color: "var(--md-on-surface-variant)" }}>{t.access.stationDetail}</div>
              </div>
            </li>
          </ul>
          <Link href="/access"
            className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium transition-colors"
            style={{ color: "var(--md-primary)" }}>
            {t.access.more} <ChevronRight size={15} />
          </Link>
        </div>

        <div className="rounded-3xl overflow-hidden h-72" style={{ boxShadow: "var(--md-shadow-3)" }}>
          <iframe
            title="The Nagomi Stay Osaka map"
            src={`https://www.google.com/maps?q=${PROPERTY.location.lat},${PROPERTY.location.lng}&z=15&output=embed`}
            className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen
          />
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-24 text-center" style={{ background: "var(--md-primary)" }}>
        <h2 className="text-white text-4xl font-light mb-4">{t.cta.title}</h2>
        <p className="text-white/75 text-base mb-10 max-w-md mx-auto">{t.cta.subtitle}</p>
        <Link href="/booking"
          className="inline-block bg-white font-medium text-base px-10 py-4 rounded-full transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
          style={{ color: "var(--md-primary)" }}>
          {t.cta.button}
        </Link>
      </section>
    </>
  );
}
