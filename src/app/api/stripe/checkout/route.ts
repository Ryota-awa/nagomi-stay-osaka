import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const session = await createCheckoutSession({
      arrivalDate: body.arrivalDate,
      departureDate: body.departureDate,
      nights: body.nights,
      pricePerNight: body.pricePerNight,
      totalAmount: body.totalAmount,
      currency: body.currency ?? "jpy",
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      adults: body.adults,
      children: body.children,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
