import { PROPERTY } from "@/lib/constants";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nagomi-stay-osaka.vercel.app";

export function JsonLd() {
  // LodgingBusiness schema — Google Hotel / AI search (ChatGPT, Perplexity, etc.)
  const lodging = {
    "@context": "https://schema.org",
    "@type": ["LodgingBusiness", "VacationRental"],
    "@id": `${siteUrl}/#lodging`,
    name: PROPERTY.name,
    alternateName: [PROPERTY.taglineEn, "Nagomi Stay Osaka", "和みステイ大阪"],
    description:
      "Entire renovated Japanese house near Namba, Osaka. 45㎡, up to 6 guests, 2 bedrooms. Full kitchen, free Wi-Fi, washing machine. 5 min walk from Kishinosato-Tamade Station — 5 min metro to Namba. Location score 10/10.",
    url: siteUrl,
    image: [1, 2, 3, 4, 5].map((n) => ({
      "@type": "ImageObject",
      url: `${siteUrl}/images/${n === 1 ? "hero-1" : `room-${n + 1}`}.jpg`,
      name: `The Nagomi Stay Osaka - Photo ${n}`,
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: PROPERTY.address.street,
      addressLocality: "Osaka",
      addressRegion: "Osaka Prefecture",
      postalCode: "557-0055",
      addressCountry: "JP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: PROPERTY.location.lat,
      longitude: PROPERTY.location.lng,
    },
    hasMap: `https://www.google.com/maps?q=${PROPERTY.location.lat},${PROPERTY.location.lng}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: PROPERTY.rating.score,
      bestRating: PROPERTY.rating.maxScore,
      reviewCount: PROPERTY.rating.reviewCount,
      ratingExplanation: "Location score 10/10 on Booking.com",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Full Kitchen", value: true },
      { "@type": "LocationFeatureSpecification", name: "Washing Machine", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
      { "@type": "LocationFeatureSpecification", name: "TV", value: true },
      { "@type": "LocationFeatureSpecification", name: "Hair Dryer", value: true },
      { "@type": "LocationFeatureSpecification", name: "Towels Provided", value: true },
      { "@type": "LocationFeatureSpecification", name: "Toiletries Provided", value: true },
    ],
    numberOfRooms: PROPERTY.specs.bedrooms,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: PROPERTY.specs.maxGuests,
      unitText: "guests",
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: PROPERTY.specs.area,
      unitCode: "MTK",
    },
    petsAllowed: false,
    checkinTime: "T15:00:00",
    checkoutTime: "T11:00:00",
    priceRange: "¥¥",
    currenciesAccepted: "JPY",
    paymentAccepted: "Credit Card",
    availableLanguage: ["Japanese", "English"],
    tourBookingPage: `${siteUrl}/booking`,
    // Offer — pricing for AI Overview / Google Hotel search
    makesOffer: {
      "@type": "Offer",
      name: "Direct booking — entire property",
      description:
        "Book the entire 45㎡ Japanese house directly. No OTA fees. Up to 6 guests. Includes full kitchen, free Wi-Fi, washing machine, and all amenities.",
      url: `${siteUrl}/booking`,
      priceCurrency: "JPY",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceCurrency: "JPY",
        unitText: "night",
        description: "Price varies by date. Direct booking discount available.",
      },
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString().split("T")[0],
    },
    // Speakable for AI assistants
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".speakable"],
    },
    keywords:
      "Osaka vacation rental, entire home near Namba, Japan Airbnb alternative, Osaka 6 guests, 大阪 民泊, 一棟貸し 難波, 大阪 6人 宿泊",
    inLanguage: ["ja", "en"],
  };

  // BreadcrumbList
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Book", item: `${siteUrl}/booking` },
      { "@type": "ListItem", position: 3, name: "FAQ", item: `${siteUrl}/faq` },
      { "@type": "ListItem", position: 4, name: "Access", item: `${siteUrl}/access` },
    ],
  };

  // WebSite
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteUrl,
    name: PROPERTY.name,
    inLanguage: ["ja", "en"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lodging) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
