import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secretKey || !webhookSecret || !signature) return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 400 });
  const stripe = new Stripe(secretKey);
  const supabaseAdmin = getSupabaseAdmin();
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret); } catch { return NextResponse.json({ error: "Invalid signature." }, { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const testId = session.metadata?.testId;
    const targetVotes = Number(session.metadata?.targetVotes);
    if (testId && Number.isInteger(targetVotes) && targetVotes > 0) {
      const { error } = await supabaseAdmin.from("tests").update({ status: "active", target_votes: targetVotes }).eq("id", testId).eq("status", "pending_payment");
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  return NextResponse.json({ received: true });
}
