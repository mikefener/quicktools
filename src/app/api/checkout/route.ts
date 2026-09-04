import { NextResponse } from "next/server";
import Stripe from "stripe";

const prices = { quick: { cents: 300, targetVotes: 50 }, standard: { cents: 500, targetVotes: 100 }, pro: { cents: 1000, targetVotes: 250 } } as const;
type Tier = keyof typeof prices;

export async function POST(request: Request) {
  const body = await request.json() as { tier?: string; testId?: string; title?: string };
  if (!body.testId || !body.title || !body.tier || !(body.tier in prices)) return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  const tier = body.tier as Tier;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  const stripe = new Stripe(secretKey);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price_data: { currency: "usd", product_data: { name: `Blind CTR ${prices[tier].targetVotes}-vote test` }, unit_amount: prices[tier].cents }, quantity: 1 }],
    metadata: { testId: body.testId, targetVotes: String(prices[tier].targetVotes) },
    success_url: `${baseUrl}/dashboard?payment=success&test_id=${encodeURIComponent(body.testId)}`,
    cancel_url: `${baseUrl}/create?payment=cancelled`,
  });
  return NextResponse.json({ url: session.url });
}
