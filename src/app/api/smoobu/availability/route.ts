import { NextRequest, NextResponse } from "next/server";

const SMOOBU_API_BASE = "https://login.smoobu.com/api";

// Fallback price per night (JPY) when Smoobu rates are unavailable
const DEFAULT_PRICE_PER_NIGHT = 15000;

export async function POST(req: NextRequest) {
  try {
    const { checkIn, checkOut } = await req.json();

    if (!checkIn || !checkOut) {
      return NextResponse.json({ error: "checkIn and checkOut are required" }, { status: 400 });
    }

    const apiKey = process.env.SMOOBU_API_KEY;
    const apartmentId = process.env.SMOOBU_APARTMENT_ID;

    const nights = Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
    );

    if (!apiKey || !apartmentId) {
      // Dev fallback
      return NextResponse.json({
        available: true,
        totalPrice: nights * DEFAULT_PRICE_PER_NIGHT,
        pricePerNight: DEFAULT_PRICE_PER_NIGHT,
        nights,
      });
    }

    // Check availability and fetch rates in parallel
    const [reservationsRes, ratesRes] = await Promise.all([
      fetch(
        `${SMOOBU_API_BASE}/reservations?pageSize=100&from=${checkIn}&to=${checkOut}`,
        {
          headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
          cache: "no-store",
        }
      ),
      fetch(
        `${SMOOBU_API_BASE}/rates?apartments[]=${apartmentId}&start_date=${checkIn}&end_date=${checkOut}`,
        {
          headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
          cache: "no-store",
        }
      ),
    ]);

    if (!reservationsRes.ok) {
      const errText = await reservationsRes.text();
      console.error("Smoobu reservations API error:", reservationsRes.status, errText);
      throw new Error(`Smoobu reservations error: ${reservationsRes.status}`);
    }

    const data = await reservationsRes.json();
    const bookings: Array<{
      arrival: string;
      departure: string;
      apartment: { id: number };
      "is-blocked-booking": boolean;
    }> = data.bookings ?? [];

    // Filter to only this apartment
    const aptBookings = bookings.filter(
      (b) => String(b.apartment.id) === apartmentId
    );

    // Check overlap: a booking overlaps if arrival < checkOut AND departure > checkIn
    const overlapping = aptBookings.filter(
      (b) => b.arrival < checkOut && b.departure > checkIn
    );

    const available = overlapping.length === 0;

    // Calculate total price from Smoobu rates
    let totalPrice: number;
    let pricePerNight: number;

    if (ratesRes.ok) {
      const ratesData = await ratesRes.json();
      // Smoobu rates API returns: { data: { "{apartmentId}": { "YYYY-MM-DD": { price: number, available: 0|1 }, ... } } }
      const rateMap: Record<string, { price: number; available: number }> =
        ratesData.data?.[apartmentId] ?? {};

      // Sum prices for each night from checkIn up to (but not including) checkOut
      let sum = 0;
      let covered = 0;
      const cursor = new Date(checkIn);
      const end = new Date(checkOut);
      while (cursor < end) {
        const dateKey = cursor.toISOString().slice(0, 10);
        const dayRate = rateMap[dateKey]?.price;
        if (dayRate != null) {
          sum += dayRate;
          covered++;
        }
        cursor.setDate(cursor.getDate() + 1);
      }

      if (covered > 0 && nights > 0) {
        // Use actual rates; fill any missing nights with average
        const avg = Math.round(sum / covered);
        totalPrice = sum + (nights - covered) * avg;
        pricePerNight = Math.round(totalPrice / nights);
      } else {
        console.warn(`Smoobu rates returned no data (${covered}/${nights} nights). Using default.`);
        totalPrice = nights * DEFAULT_PRICE_PER_NIGHT;
        pricePerNight = DEFAULT_PRICE_PER_NIGHT;
      }
    } else {
      console.warn("Smoobu rates API failed, using default price:", ratesRes.status);
      totalPrice = nights * DEFAULT_PRICE_PER_NIGHT;
      pricePerNight = DEFAULT_PRICE_PER_NIGHT;
    }

    return NextResponse.json({
      available,
      totalPrice,
      pricePerNight,
      nights,
      unavailableDates: available ? [] : overlapping.map((b) => `${b.arrival}〜${b.departure}`),
    });
  } catch (err) {
    console.error("Availability check error:", err);
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 });
  }
}
