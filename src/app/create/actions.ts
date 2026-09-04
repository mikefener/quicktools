"use server";

import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const CLIENT_COOKIE = "blind-ctr-client-token";

type LaunchInput = { title: string; optionAUrl: string; optionBUrl: string; targetVotes: number; isFreeTier: boolean };

async function getProfile() {
  const supabaseAdmin = getSupabaseAdmin();
  const cookieStore = await cookies();
  let token = cookieStore.get(CLIENT_COOKIE)?.value;
  if (!token) {
    token = crypto.randomUUID();
    cookieStore.set(CLIENT_COOKIE, token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
  }
  const { data, error } = await supabaseAdmin.from("profiles").upsert({ client_token: token }, { onConflict: "client_token" }).select("id, credits, lifetime_votes").single();
  if (error || !data) throw new Error(error?.message ?? "Unable to load profile");
  return data;
}

export async function launchFreeTest(input: LaunchInput) {
  if (!input.title.trim() || !input.optionAUrl || !input.optionBUrl) throw new Error("Title and both thumbnail URLs are required.");
  const supabaseAdmin = getSupabaseAdmin();
  const profile = await getProfile();
  if (profile.credits < 1) throw new Error("No free test credits are available.");
  const { error: creditError } = await supabaseAdmin.from("profiles").update({ credits: profile.credits - 1 }).eq("id", profile.id).eq("credits", profile.credits);
  if (creditError) throw new Error(creditError.message);
  const { data, error } = await supabaseAdmin.from("tests").insert({ creator_id: profile.id, title: input.title.trim(), option_a_url: input.optionAUrl, option_b_url: input.optionBUrl, target_votes: input.targetVotes, status: "active", is_free_tier: true }).select("id").single();
  if (error || !data) { await supabaseAdmin.from("profiles").update({ credits: profile.credits }).eq("id", profile.id); throw new Error(error?.message ?? "Unable to launch test"); }
  return { testId: data.id };
}

export async function createPendingTest(input: LaunchInput) {
  if (!input.title.trim() || !input.optionAUrl || !input.optionBUrl) throw new Error("Title and both thumbnail URLs are required.");
  const supabaseAdmin = getSupabaseAdmin();
  const profile = await getProfile();
  const { data, error } = await supabaseAdmin.from("tests").insert({ creator_id: profile.id, title: input.title.trim(), option_a_url: input.optionAUrl, option_b_url: input.optionBUrl, target_votes: input.targetVotes, status: "pending_payment", is_free_tier: false }).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Unable to create test");
  return { testId: data.id };
}

export async function getDashboardData() {
  const supabaseAdmin = getSupabaseAdmin();
  const profile = await getProfile();
  const { data: tests, error } = await supabaseAdmin.from("tests").select("id, title, option_a_url, option_b_url, target_votes, votes_a, votes_b, status, is_free_tier, created_at").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { profile, tests: tests ?? [] };
}
