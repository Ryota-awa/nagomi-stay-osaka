"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const IMAGES = [
  { src: "/images/hero-1.jpg", alt: "The Nagomi Stay Osaka — リビング" },
  { src: "/images/hero-2.jpg", alt: "The Nagomi Stay Osaka — ソファルーム" },
  { src: "/images/room-2.jpg", alt: "The Nagomi Stay Osaka — 和室ベッドルーム" },
  { src: "/images/room-3.jpg", alt: "The Nagomi Stay Osaka — 二段ベッドルーム" },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {IMAGES.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          className={`object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
          sizes="100vw"
        />
      ))}
      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`スライド ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}
