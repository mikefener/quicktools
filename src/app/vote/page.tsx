"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, FastForward, Keyboard, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Campaign, getCampaigns, mockCampaigns, recordVote } from "@/lib/data";
import { addUserCredit, getUserState, recordUserVote, USER_STATE_EVENT } from "@/lib/storage";

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%2327272a'/%3E%3Cpath d='M0 360L180 220l130 90 140-170 350 220v90H0z' fill='%233f3f46'/%3E%3Ccircle cx='620' cy='130' r='52' fill='%23facc15'/%3E%3C/svg%3E";

export default function VotePage() {
  const router = useRouter();
  const [tests, setTests] = useState<Campaign[]>(mockCampaigns);
  const [votedTestIds, setVotedTestIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votesCast, setVotesCast] = useState(0);
  const [flash, setFlash] = useState<"A" | "B" | null>(null);
  const [completed, setCompleted] = useState(false);
  const availableTests = tests.filter((test) => !votedTestIds.includes(String(test.id)));
  const currentTest = availableTests.length > 0 ? availableTests[currentIndex % availableTests.length] : undefined;

  useEffect(() => {
    const sync = () => { setTests(getCampaigns()); setVotedTestIds(getUserState().votedTestIds); };
    const timer = window.setTimeout(sync, 0);
    window.addEventListener(USER_STATE_EVENT, sync);
    return () => { window.clearTimeout(timer); window.removeEventListener(USER_STATE_EVENT, sync); };
  }, []);

  const finishFlash = useCallback((finishBatch = false) => { window.setTimeout(() => { setFlash(null); if (finishBatch) setCompleted(true); }, 240); }, []);
  const vote = useCallback((option: "A" | "B") => {
    if (!currentTest || flash || completed || votesCast >= 10 || votedTestIds.includes(String(currentTest.id))) return;
    const nextVotes = votesCast + 1;
    recordVote(currentTest.id, option);
    const nextState = recordUserVote(currentTest.id);
    setVotedTestIds(nextState.votedTestIds);
    setTests(getCampaigns());
    setVotesCast(nextVotes);
    setFlash(option);
    if (nextVotes === 10) addUserCredit();
    finishFlash(nextVotes === 10);
  }, [completed, currentTest, finishFlash, flash, votedTestIds, votesCast]);
  const skip = useCallback(() => { if (!currentTest || flash || completed || votesCast >= 10) return; setFlash("A"); setCurrentIndex((value) => value + 1); finishFlash(); }, [completed, currentTest, finishFlash, flash, votesCast]);
  useEffect(() => { if (completed || votesCast >= 10) return; const onKeyDown = (event: KeyboardEvent) => { if (event.key === "ArrowLeft") vote("A"); if (event.key === "ArrowRight") vote("B"); }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, [completed, vote, votesCast]);
  function voteMore() { setVotedTestIds(getUserState().votedTestIds); setCurrentIndex(0); setVotesCast(0); setFlash(null); setCompleted(false); }
  function handleImageError(event: React.SyntheticEvent<HTMLImageElement>) { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_IMAGE; }

  if (completed) return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-950 px-5 py-12"><div className="w-full max-w-xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl sm:p-12"><div className="mx-auto inline-flex border border-yellow-400/30 bg-yellow-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-yellow-300">Batch Completed (10/10)</div><div className="mx-auto mt-8 grid size-16 place-items-center rounded-full bg-yellow-400 text-zinc-950"><RotateCcw size={27} /></div><h1 className="mt-7 text-3xl font-black tracking-tight text-white sm:text-4xl">You earned 1 Free Test Credit!</h1><p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-400">Your 10 votes have been submitted to the creator pool.</p><button onClick={() => router.push("/create?credit=true")} className="mt-8 w-full bg-yellow-400 px-5 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-yellow-300">Claim Credit &amp; Test My Thumbnail</button><button onClick={() => router.push("/dashboard")} className="mt-3 w-full border border-zinc-700 px-5 py-3.5 text-sm font-bold text-white transition hover:border-zinc-500 hover:bg-zinc-800">View Results Dashboard</button><button onClick={voteMore} className="mt-6 text-sm font-bold text-yellow-400 transition hover:text-yellow-300">Vote on 10 More</button></div></div>;
  if (!currentTest || (votesCast === 0 && availableTests.length < 10)) return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-950 px-5"><div className="border border-zinc-800 bg-zinc-900 p-8 text-center"><div className="inline-flex border border-yellow-400/30 bg-yellow-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-yellow-300">All Caught Up!</div><p className="mt-5 max-w-sm text-sm leading-6 text-zinc-400">You have voted on all active community tests. Check back later for new submissions.</p></div></div>;
  return <div className="min-h-[calc(100vh-4rem)] bg-zinc-950"><div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/95 px-5 py-4 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><div className="min-w-0 flex-1"><div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[0.14em] text-zinc-500"><span>Votes cast: {votesCast} / 10</span><span className="hidden sm:inline">to earn 1 free test credit</span></div><div className="h-1.5 bg-zinc-800"><div className="h-full bg-yellow-400 transition-all duration-300" style={{ width: `${votesCast * 10}%` }} /></div></div><button onClick={skip} className="inline-flex shrink-0 items-center gap-2 border border-zinc-700 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:border-zinc-500 hover:text-white"><FastForward size={14} /> Skip</button></div></div><main className="mx-auto flex max-w-6xl flex-col justify-center px-5 py-10 lg:min-h-[calc(100vh-9.5rem)] lg:px-8"><div className="mb-8 text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">Blind voting arena</p><h1 className="mt-3 text-2xl font-black text-white sm:text-4xl">Which thumbnail gets your click?</h1><p className="mt-2 text-sm text-zinc-500">{currentTest.title}</p></div><div className="grid gap-4 md:grid-cols-2"><button disabled={Boolean(flash)} onClick={() => vote("A")} className={`group text-left transition duration-200 ${flash === "A" ? "scale-[.98] ring-2 ring-yellow-400" : flash ? "opacity-40" : "hover:-translate-y-1"}`}><div className="aspect-video overflow-hidden border border-zinc-800 bg-zinc-900"><img src={currentTest.imageA} onError={handleImageError} alt="Option A thumbnail" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" /></div><div className="flex items-center justify-between border-x border-b border-zinc-800 bg-zinc-900 px-4 py-3"><span className="font-bold text-white">Option A</span><ArrowLeft size={17} className="text-zinc-500" /></div></button><button disabled={Boolean(flash)} onClick={() => vote("B")} className={`group text-left transition duration-200 ${flash === "B" ? "scale-[.98] ring-2 ring-yellow-400" : flash ? "opacity-40" : "hover:-translate-y-1"}`}><div className="aspect-video overflow-hidden border border-zinc-800 bg-zinc-900"><img src={currentTest.imageB} onError={handleImageError} alt="Option B thumbnail" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" /></div><div className="flex items-center justify-between border-x border-b border-zinc-800 bg-zinc-900 px-4 py-3"><span className="font-bold text-white">Option B</span><ArrowRight size={17} className="text-zinc-500" /></div></button></div><div className="mt-8 flex justify-center gap-2 text-xs text-zinc-600"><Keyboard size={14} /> Left arrow for A · Right arrow for B</div></main></div>;
}
