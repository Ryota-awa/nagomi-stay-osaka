import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { createBooking } from "@/lib/smoobu";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripeClient().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata!;

    try {
      const [lastName, firstName] = (meta.guestName ?? "").split(" ");
      await createBooking({
        arrivalDate: meta.arrivalDate,
        departureDate: meta.departureDate,
        firstName: firstName ?? "",
        lastName: lastName ?? meta.guestName,
        email: meta.guestEmail,
        adults: Number(meta.adults),
        children: Number(meta.children ?? 0),
        totalAmount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? "jpy",
        note: `Stripe Payment: ${session.payment_intent}`,
      });
      console.log(`Smoobu booking created for ${meta.guestName}`);
    } catch (err) {
      console.error("Failed to create Smoobu booking:", err);
      // Stripeの決済は完了しているため500を返さない（再試行ループ防止）
      return NextResponse.json({ received: true, smoobuError: true });
    }
  }

  return NextResponse.json({ received: true });
}
