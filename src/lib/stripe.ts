import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

export interface CheckoutPayload {
  arrivalDate: string;
  departureDate: string;
  nights: number;
  pricePerNight: number;
  totalAmount: number;
  currency: string;
  guestName: string;
  guestEmail: string;
  adults: number;
  children?: number;
}

export async function createCheckoutSession(payload: CheckoutPayload) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: payload.guestEmail,
    line_items: [
      {
        price_data: {
          currency: payload.currency,
          product_data: {
            name: "The Nagomi Stay Osaka",
            description: `${payload.arrivalDate} 〜 ${payload.departureDate}（${payload.nights}泊）/ 大人${payload.adults}名${payload.children ? `・子供${payload.children}名` : ""}`,
            images: [`${siteUrl}/images/hero-1.jpg`],
          },
          unit_amount: Math.round(payload.totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      arrivalDate: payload.arrivalDate,
      departureDate: payload.departureDate,
      guestName: payload.guestName,
      guestEmail: payload.guestEmail,
      adults: String(payload.adults),
      children: String(payload.children ?? 0),
    },
    success_url: `${siteUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/booking`,
  });

  return session;
}
