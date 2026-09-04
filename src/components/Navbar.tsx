"use client";

import Link from "next/link";
import { BarChart3, Crosshair, Plus, Vote } from "lucide-react";
import { usePathname } from "next/navigation";
import { getUserState, USER_STATE_EVENT } from "@/lib/storage";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/app/create/actions";

const links = [{ href: "/vote", label: "Vote Arena", icon: Vote }, { href: "/create", label: "Test My Thumbnail", icon: Plus, note: "$5" }, { href: "/dashboard", label: "Results Dashboard", icon: BarChart3 }];

export default function Navbar() {
  const pathname = usePathname();
  const [credits, setCredits] = useState(0);
  useEffect(() => {
    const syncCredits = () => { setCredits(getUserState().userCredits); void getDashboardData().then((data) => setCredits(data.profile.credits)).catch(() => undefined); };
    syncCredits();
    window.addEventListener(USER_STATE_EVENT, syncCredits);
    window.addEventListener("storage", syncCredits);
    return () => { window.removeEventListener(USER_STATE_EVENT, syncCredits); window.removeEventListener("storage", syncCredits); };
  }, []);
  return <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
    <Link href="/" className="flex items-center gap-2.5" aria-label="Blind CTR home"><span className="grid size-8 place-items-center rounded-lg bg-yellow-400 text-zinc-950"><Crosshair size={19} strokeWidth={2.5} /></span><span className="text-sm font-black tracking-[0.12em] text-white">BLIND <span className="text-yellow-400">CTR</span></span></Link>
    <nav className="flex items-center gap-1" aria-label="Main navigation">{links.map(({ href, label, icon: Icon, note }) => <Link key={href} href={href} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${pathname === href ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`}><Icon size={16} /><span className="hidden sm:inline">{label}</span>{note && <span className="text-xs text-yellow-400">{note}</span>}</Link>)}<Link href="/create?credit=true" className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1.5 text-xs font-bold text-yellow-300 transition hover:border-yellow-400/60 hover:bg-yellow-400/20">⚡ {credits} {credits === 1 ? "Credit" : "Credits"}</Link></nav>
  </div></header>;
}