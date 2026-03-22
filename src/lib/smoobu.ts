const SMOOBU_API_BASE = "https://login.smoobu.com/api";
const API_KEY = process.env.SMOOBU_API_KEY!;
const APARTMENT_ID = process.env.SMOOBU_APARTMENT_ID!;

export interface Availability {
  date: string;
  available: boolean;
  price?: number;
  minNights?: number;
}

export interface BookingPayload {
  arrivalDate: string;
  departureDate: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  adults: number;
  children?: number;
  totalAmount: number;
  currency: string;
  note?: string;
}

export async function getAvailability(
  from: string,
  to: string
): Promise<Availability[]> {
  const res = await fetch(
    `${SMOOBU_API_BASE}/reservations?apartmentId=${APARTMENT_ID}&arrivalDate=${from}&departureDate=${to}&pageSize=100`,
    {
      headers: {
        "Api-Key": API_KEY,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // 5分キャッシュ
    }
  );

  if (!res.ok) throw new Error(`Smoobu availability error: ${res.status}`);
  return res.json();
}

export async function getRates(
  from: string,
  to: string
): Promise<{ date: string; price: number }[]> {
  const res = await fetch(
    `${SMOOBU_API_BASE}/apartments/${APARTMENT_ID}/rates?start_date=${from}&end_date=${to}`,
    {
      headers: {
        "Api-Key": API_KEY,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error(`Smoobu rates error: ${res.status}`);
  return res.json();
}

export async function createBooking(payload: BookingPayload) {
  const res = await fetch(`${SMOOBU_API_BASE}/reservations`, {
    method: "POST",
    headers: {
      "Api-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apartmentId: Number(APARTMENT_ID),
      arrivalDate: payload.arrivalDate,
      departureDate: payload.departureDate,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      adults: payload.adults,
      children: payload.children ?? 0,
      price: payload.totalAmount,
      currency: payload.currency,
      note: payload.note,
      channelId: -1, // Direct booking channel
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Smoobu booking error: ${JSON.stringify(error)}`);
  }
  return res.json();
}
