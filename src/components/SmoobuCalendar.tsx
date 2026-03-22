"use client";

import { useEffect, useRef } from "react";

export function SmoobuCalendar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    const script = document.createElement("script");
    script.src = "https://login.smoobu.com/js/Apartment/CalendarWidget.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // スクリプトは残す（ページ内で再利用）
    };
  }, []);

  return (
    <div ref={containerRef} id="smoobuApartment3065921en" className="calendarWidget w-full">
      <div
        className="calendarContent"
        data-load-calendar-url="https://login.smoobu.com/en/cockpit/widget/single-calendar/3065921"
        data-verification="a9c9ec40cb34733b15bab3d48bf1f4dd5c722a640be3fc093ea25ef317da1792"
        data-baseUrl="https://login.smoobu.com"
        data-disable-css="false"
      />
    </div>
  );
}
