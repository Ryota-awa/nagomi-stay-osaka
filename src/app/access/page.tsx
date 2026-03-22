import { Metadata } from "next";
import { AccessContent } from "./AccessContent";
import { PROPERTY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Access & Location — Near Namba, Osaka",
  description:
    "The Nagomi Stay Osaka is located 5 minutes walk from Kishinosato-Tamade Station, with easy access to Namba (5 min), Dotonbori, and major Osaka attractions.",
  alternates: {
    canonical: "https://nagomi-stay-osaka.vercel.app/access",
  },
};

const accessSchema = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: PROPERTY.name,
  description:
    "Entire vacation rental 5 minutes walk from Kishinosato-Tamade Station. Easy access to Namba (5 min by metro), Dotonbori, Shinsekai, and Kuromon Market.",
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
  publicAccess: true,
  nearbyAttraction: [
    { "@type": "TouristAttraction", name: "Namba / Dotonbori", description: "5 min by Osaka Metro Yotsubashi Line" },
    { "@type": "TouristAttraction", name: "Shinsekai / Tsutenkaku", description: "10 min by metro" },
    { "@type": "TouristAttraction", name: "Kuromon Ichiba Market", description: "15 min by metro" },
    { "@type": "TouristAttraction", name: "Osaka Castle", description: "25 min by metro" },
    { "@type": "TouristAttraction", name: "Universal Studios Japan", description: "30 min by metro" },
  ],
};

export default function AccessPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(accessSchema) }}
      />
      <AccessContent />
    </>
  );
}
