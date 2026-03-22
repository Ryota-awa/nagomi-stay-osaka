"use client";

import { MapPin, Train, Car, Clock } from "lucide-react";
import { PROPERTY } from "@/lib/constants";
import { useLang } from "@/lib/language-context";

export function AccessContent() {
  const { t } = useLang();
  const a = t.accessPage;

  const routes = [
    { icon: Train, title: a.byTrain, steps: a.byTrainSteps },
    { icon: Train, title: a.fromNamba, steps: a.fromNambaSteps },
    { icon: Car, title: a.byCar, steps: a.byCarSteps },
  ];

  const checkInInfo = [
    { icon: Clock, label: a.checkInTime },
    { icon: Clock, label: a.checkOutTime },
    { icon: Clock, label: a.cancellation },
    { icon: Clock, label: a.smoking },
    { icon: Clock, label: a.pets },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: "var(--md-surface)" }}>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-light mb-2" style={{ color: "var(--md-on-surface)" }}>{a.title}</h1>
        <p className="text-sm mb-10" style={{ color: "var(--md-on-surface-variant)" }}>{a.subtitle}</p>

        {/* Map */}
        <div className="rounded-3xl overflow-hidden mb-10 h-80" style={{ boxShadow: "var(--md-shadow-3)" }}>
          <iframe
            title="The Nagomi Stay Osaka map"
            src={`https://www.google.com/maps?q=${PROPERTY.location.lat},${PROPERTY.location.lng}&z=16&output=embed`}
            className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen
          />
        </div>

        {/* Address */}
        <div className="flex items-start gap-4 p-5 rounded-2xl mb-8"
          style={{ background: "var(--md-primary-container)" }}>
          <MapPin size={20} style={{ color: "var(--md-primary)" }} className="mt-0.5 shrink-0" />
          <div>
            <div className="font-medium text-sm mb-0.5" style={{ color: "var(--md-on-primary-container)" }}>住所 / Address</div>
            <div style={{ color: "var(--md-on-primary-container)" }}>{PROPERTY.address.full}</div>
          </div>
        </div>

        {/* Routes */}
        <div className="space-y-3 mb-12">
          {routes.map((route) => (
            <div key={route.title} className="bg-white rounded-2xl p-6" style={{ boxShadow: "var(--md-shadow-1)" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "var(--md-primary-container)" }}>
                  <route.icon size={16} style={{ color: "var(--md-primary)" }} />
                </span>
                <h2 className="font-medium" style={{ color: "var(--md-on-surface)" }}>{route.title}</h2>
              </div>
              <ol className="space-y-2 pl-1">
                {route.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--md-on-surface-variant)" }}>
                    <span className="font-bold shrink-0 mt-0.5" style={{ color: "var(--md-primary)" }}>{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Check-in info */}
        <h2 className="text-2xl font-light mb-4" style={{ color: "var(--md-on-surface)" }}>{a.checkInInfo}</h2>
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "var(--md-shadow-1)" }}>
          {checkInInfo.map((item, i) => (
            <div key={i} className={`flex items-center gap-4 px-6 py-4 text-sm ${i < checkInInfo.length - 1 ? "border-b" : ""}`}
              style={{ borderColor: "var(--md-outline-variant)" }}>
              <item.icon size={15} style={{ color: "var(--md-primary)" }} className="shrink-0" />
              <span style={{ color: "var(--md-on-surface)" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
