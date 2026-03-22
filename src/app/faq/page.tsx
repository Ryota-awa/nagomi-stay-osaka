import { Metadata } from "next";
import { FaqContent } from "./FaqContent";
import { faqs } from "./faqData";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Answers to common questions about The Nagomi Stay Osaka: check-in times, cancellation policy, kitchen, Wi-Fi, parking, and access from Namba.",
  alternates: {
    canonical: "https://nagomi-stay-osaka.vercel.app/faq",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.en.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqContent />
    </>
  );
}
