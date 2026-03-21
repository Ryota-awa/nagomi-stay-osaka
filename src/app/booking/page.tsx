"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { Users, ArrowLeft, CheckCircle2, XCircle, CreditCard, Info, CalendarDays } from "lucide-react";
import { PROPERTY } from "@/lib/constants";
import { useLang } from "@/lib/language-context";

type Step = "dates" | "available" | "unavailable" | "details";

interface GuestForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  note: string;
}

interface AvailabilityResult {
  available: boolean;
  totalPrice: number;
  pricePerNight: number;
  nights: number;
  unavailableDates?: string[];
}

function toDateString(d: Date) {
  return d.toISOString().split("T")[0];
}

function formatDate(dateStr: string, lang: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

export default function BookingPage() {
  const { lang, t } = useLang();
  const b = t.booking;

  const [step, setStep] = useState<Step>("dates");
  const [range, setRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guest, setGuest] = useState<GuestForm>({ firstName: "", lastName: "", email: "", phone: "", note: "" });
  const [avail, setAvail] = useState<AvailabilityResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkIn = range?.from ? toDateString(range.from) : "";
  const checkOut = range?.to ? toDateString(range.to) : "";
  const nights = range?.from && range?.to
    ? Math.max(0, Math.floor((range.to.getTime() - range.from.getTime()) / 86400000))
    : 0;
  const totalGuests = adults + children;
  const totalAmount = avail?.totalPrice ?? 0;
  const pricePerNight = avail?.pricePerNight ?? 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleCheckAvailability = async () => {
    setError("");
    if (!checkIn || !checkOut) { setError(b.errors.dates); return; }
    if (nights < 1) { setError(b.errors.nights); return; }
    if (totalGuests > PROPERTY.specs.maxGuests) { setError(b.errors.guests); return; }

    setChecking(true);
    setAvail(null);
    try {
      const res = await fetch("/api/smoobu/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkIn, checkOut }),
      });
      const data: AvailabilityResult = await res.json();
      setAvail(data);
      setStep(data.available ? "available" : "unavailable");
    } catch {
      setError(b.errors.generic);
    } finally {
      setChecking(false);
    }
  };

  const handlePayment = async () => {
    setError("");
    if (!guest.firstName || !guest.lastName || !guest.email) { setError(b.errors.contact); return; }
    if (!avail) { setError(b.errors.generic); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          arrivalDate: checkIn,
          departureDate: checkOut,
          nights: avail.nights,
          pricePerNight: avail.pricePerNight,
          totalAmount: avail.totalPrice,
          currency: "jpy",
          guestName: `${guest.lastName} ${guest.firstName}`,
          guestEmail: guest.email,
          adults,
          children,
          phone: guest.phone,
          note: guest.note,
        }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setError(b.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--md-surface)" }}>
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-light mb-1" style={{ color: "var(--md-on-surface)" }}>{b.title}</h1>
          <p className="text-sm" style={{ color: "var(--md-on-surface-variant)" }}>{b.subtitle}</p>
        </div>

        {/* Direct booking badge */}
        <div className="flex items-start gap-2 p-4 rounded-2xl mb-5 text-sm"
          style={{ background: "var(--md-primary-container)", color: "var(--md-on-primary-container)" }}>
          <Info size={16} className="shrink-0 mt-0.5" />
          <span>{b.directBooking}</span>
        </div>

        {/* ── STEP 1: Date & Guest selection ── */}
        {(step === "dates" || step === "available" || step === "unavailable") && (
          <div className="bg-white rounded-3xl overflow-hidden mb-4" style={{ boxShadow: "var(--md-shadow-2)" }}>
            {/* Section header */}
            <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b" style={{ borderColor: "var(--md-outline-variant)" }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white shrink-0"
                style={{ background: "var(--md-primary)" }}>1</span>
              <div>
                <div className="text-xs font-medium" style={{ color: "var(--md-primary)" }}>{b.step1.label}</div>
                <div className="font-medium text-sm" style={{ color: "var(--md-on-surface)" }}>{b.step1.title}</div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              {/* Selected dates display */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: b.step1.checkIn, value: checkIn },
                  { label: b.step1.checkOut, value: checkOut },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl px-4 py-3 border text-sm"
                    style={{ borderColor: value ? "var(--md-primary)" : "var(--md-outline-variant)", background: value ? "var(--md-primary-container)" : "transparent" }}>
                    <div className="text-xs mb-0.5" style={{ color: "var(--md-on-surface-variant)" }}>
                      <CalendarDays size={10} className="inline mr-1" />{label}
                    </div>
                    <div className="font-medium text-sm" style={{ color: value ? "var(--md-primary)" : "var(--md-outline)" }}>
                      {value ? formatDate(value, lang) : (lang === "ja" ? "タップして選択" : "Tap to select")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Nights summary */}
              {nights > 0 && (
                <div className="text-center text-sm font-medium" style={{ color: "var(--md-primary)" }}>
                  {nights} {lang === "ja" ? "泊" : nights === 1 ? "night" : "nights"}
                </div>
              )}

              {/* Inline calendar */}
              <div className="flex justify-center overflow-x-auto -mx-4 sm:mx-0">
                <div className="rdp-booking-wrapper">
                  <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={(r) => {
                      setRange(r);
                      setStep("dates");
                      setAvail(null);
                    }}
                    disabled={{ before: today }}
                    numberOfMonths={1}
                    showOutsideDays={false}
                    className="rdp-booking"
                  />
                </div>
              </div>

              {/* Guest count */}
              <div>
                <div className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: "var(--md-on-surface-variant)" }}>
                  <Users size={11} />{b.step1.adults} / {b.step1.children}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { key: "adults" as const, label: b.step1.adults, val: adults, set: setAdults, min: 1 },
                    { key: "children" as const, label: b.step1.children, val: children, set: setChildren, min: 0 },
                  ]).map(({ label, val, set, min }) => (
                    <div key={label} className="flex items-center justify-between border rounded-xl px-4 py-3"
                      style={{ borderColor: "var(--md-outline-variant)" }}>
                      <div className="text-xs" style={{ color: "var(--md-on-surface-variant)" }}>{label}</div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => set(Math.max(min, val - 1))}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium hover:bg-[var(--md-surface-variant)] transition-colors"
                          style={{ color: "var(--md-primary)" }}>−</button>
                        <span className="w-4 text-center font-medium text-sm" style={{ color: "var(--md-on-surface)" }}>{val}</span>
                        <button onClick={() => set(Math.min(6, val + 1))}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium hover:bg-[var(--md-surface-variant)] transition-colors"
                          style={{ color: "var(--md-primary)" }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-1.5" style={{ color: "var(--md-on-surface-variant)" }}>{b.step1.maxNote}</p>
              </div>

              {error && (
                <p className="text-sm p-3 rounded-xl" style={{ background: "#FDECEA", color: "#B71C1C" }}>{error}</p>
              )}

              {/* Check availability button */}
              {step === "dates" && (
                <button onClick={handleCheckAvailability} disabled={checking || !checkIn || !checkOut || nights < 1}
                  className="w-full py-4 rounded-2xl text-white font-medium text-sm transition-all hover:opacity-90 active:scale-[.98] disabled:opacity-40"
                  style={{ background: "var(--md-primary)" }}>
                  {checking ? b.step1.checking : b.step1.cta}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Available result ── */}
        {step === "available" && (
          <div className="bg-white rounded-3xl overflow-hidden mb-4" style={{ boxShadow: "var(--md-shadow-2)" }}>
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <CheckCircle2 size={24} className="text-green-600 shrink-0" />
                <div>
                  <div className="font-medium" style={{ color: "var(--md-on-surface)" }}>{b.available.title}</div>
                  <div className="text-sm" style={{ color: "var(--md-on-surface-variant)" }}>
                    {formatDate(checkIn, lang)} → {formatDate(checkOut, lang)} · {nights}{b.available.nights}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--md-primary-container)" }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm mb-1" style={{ color: "var(--md-on-primary-container)" }}>
                      ¥{pricePerNight.toLocaleString()} × {avail?.nights ?? nights}{b.available.nights}
                    </div>
                    <div className="text-2xl font-medium" style={{ color: "var(--md-primary)" }}>
                      ¥{totalAmount.toLocaleString()}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--md-on-primary-container)" }}>
                      {b.available.taxes}
                    </div>
                  </div>
                  <div className="text-right text-xs" style={{ color: "var(--md-on-primary-container)" }}>
                    <div>{lang === "ja" ? `大人 ${adults}名` : `${adults} adult${adults > 1 ? "s" : ""}`}</div>
                    {children > 0 && <div>{lang === "ja" ? `子供 ${children}名` : `${children} child${children > 1 ? "ren" : ""}`}</div>}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setStep("dates"); setAvail(null); }}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-full text-sm border transition-colors hover:bg-[var(--md-surface-variant)]"
                  style={{ borderColor: "var(--md-outline-variant)", color: "var(--md-on-surface-variant)" }}>
                  <ArrowLeft size={15} />{b.available.change}
                </button>
                <button onClick={() => setStep("details")}
                  className="flex-1 py-3 rounded-2xl text-white font-medium text-sm transition-all hover:opacity-90 active:scale-[.98]"
                  style={{ background: "var(--md-primary)" }}>
                  {b.step2.title} →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Unavailable result ── */}
        {step === "unavailable" && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 mb-4" style={{ boxShadow: "var(--md-shadow-2)" }}>
            <div className="flex items-center gap-3 mb-4">
              <XCircle size={24} className="text-red-500 shrink-0" />
              <div>
                <div className="font-medium" style={{ color: "var(--md-on-surface)" }}>{b.unavailable.title}</div>
                <div className="text-sm" style={{ color: "var(--md-on-surface-variant)" }}>{b.unavailable.subtitle}</div>
              </div>
            </div>
            <button onClick={() => { setStep("dates"); setRange(undefined); setAvail(null); }}
              className="w-full py-3 rounded-2xl text-white font-medium text-sm"
              style={{ background: "var(--md-primary)" }}>
              {b.unavailable.change}
            </button>
          </div>
        )}

        {/* ── STEP 2: Guest details ── */}
        {step === "details" && (
          <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "var(--md-shadow-2)" }}>
            <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b" style={{ borderColor: "var(--md-outline-variant)" }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white shrink-0"
                style={{ background: "var(--md-primary)" }}>2</span>
              <div>
                <div className="text-xs font-medium" style={{ color: "var(--md-primary)" }}>{b.step2.label}</div>
                <div className="font-medium text-sm" style={{ color: "var(--md-on-surface)" }}>{b.step2.title}</div>
              </div>
              <button onClick={() => setStep("available")} className="ml-auto p-2 rounded-full hover:bg-[var(--md-surface-variant)]">
                <ArrowLeft size={16} style={{ color: "var(--md-on-surface-variant)" }} />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {/* Booking summary */}
              <div className="rounded-2xl p-4 text-sm" style={{ background: "var(--md-surface-variant)" }}>
                <div className="font-medium mb-2" style={{ color: "var(--md-on-surface)" }}>{b.step2.summary}</div>
                <div className="grid grid-cols-2 gap-y-1 text-xs" style={{ color: "var(--md-on-surface-variant)" }}>
                  <span>{b.step2.checkIn}:</span><span className="font-medium text-right" style={{ color: "var(--md-on-surface)" }}>{formatDate(checkIn, lang)}</span>
                  <span>{b.step2.checkOut}:</span><span className="font-medium text-right" style={{ color: "var(--md-on-surface)" }}>{formatDate(checkOut, lang)}</span>
                  <span>{b.step2.guests}:</span><span className="font-medium text-right" style={{ color: "var(--md-on-surface)" }}>
                    {b.step2.adultsLabel} {adults}{children > 0 ? ` / ${b.step2.childrenLabel} ${children}` : ""}
                  </span>
                  <span className="font-medium" style={{ color: "var(--md-on-surface)" }}>{b.step2.total}:</span>
                  <span className="font-bold text-right text-base" style={{ color: "var(--md-primary)" }}>¥{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: "lastName" as const, label: b.step2.lastName, ph: b.step2.lastNamePlaceholder },
                  { key: "firstName" as const, label: b.step2.firstName, ph: b.step2.firstNamePlaceholder },
                ].map(({ key, label, ph }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--md-on-surface-variant)" }}>{label}</label>
                    <input type="text" required placeholder={ph} value={guest[key]}
                      onChange={(e) => setGuest({ ...guest, [key]: e.target.value })}
                      className="w-full rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 border"
                      style={{ borderColor: "var(--md-outline-variant)" }}
                    />
                  </div>
                ))}
              </div>

              {/* Email & Phone */}
              {[
                { key: "email" as const, label: b.step2.email, type: "email", ph: "your@email.com", required: true },
                { key: "phone" as const, label: b.step2.phone, type: "tel", ph: "+81 90-0000-0000", required: false },
              ].map(({ key, label, type, ph }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--md-on-surface-variant)" }}>{label}</label>
                  <input type={type} placeholder={ph} value={guest[key]}
                    onChange={(e) => setGuest({ ...guest, [key]: e.target.value })}
                    className="w-full rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 border"
                    style={{ borderColor: "var(--md-outline-variant)" }}
                  />
                </div>
              ))}

              {/* Note */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--md-on-surface-variant)" }}>{b.step2.note}</label>
                <textarea rows={3} placeholder={b.step2.notePlaceholder} value={guest.note}
                  onChange={(e) => setGuest({ ...guest, note: e.target.value })}
                  className="w-full rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 border resize-none"
                  style={{ borderColor: "var(--md-outline-variant)" }}
                />
              </div>

              {error && (
                <p className="text-sm p-3 rounded-xl" style={{ background: "#FDECEA", color: "#B71C1C" }}>{error}</p>
              )}

              <button onClick={handlePayment} disabled={loading}
                className="w-full py-4 rounded-2xl text-white font-medium text-sm transition-all hover:opacity-90 active:scale-[.98] disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "var(--md-primary)" }}>
                <CreditCard size={17} />
                {loading ? b.step2.processing : `${b.step2.cta} — ¥${totalAmount.toLocaleString()}`}
              </button>

              <p className="text-center text-xs" style={{ color: "var(--md-on-surface-variant)" }}>
                {b.step2.secureNote}
              </p>
              <div className="text-xs text-center" style={{ color: "var(--md-on-surface-variant)" }}>
                {b.step2.checkInTime} · {b.step2.checkOutTime}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
