interface AdBannerProps {
  slotId?: string
  format?: 'horizontal' | 'rectangle'
  className?: string
}

export default function AdBanner({
  slotId = 'slot-leaderboard',
  format = 'horizontal',
  className = '',
}: AdBannerProps) {
  return (
    <aside aria-label="Sponsored Space" className={`w-full flex flex-col items-center justify-center my-6 ${className}`}>
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5 font-mono">
        Sponsor / Display Slot
      </span>

      {/* Container Box */}
      <div
        id={slotId}
        className={`w-full rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 flex items-center justify-center text-zinc-500 text-xs transition-colors ${
          format === 'horizontal'
            ? 'h-24 sm:h-28 max-w-4xl'
            : 'h-64 max-w-xs'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500/60"></span>
          <span>{format === 'horizontal' ? 'Responsive Banner Slot (728x90 / Auto)' : 'Sidebar Slot (300x250)'}</span>
        </div>
      </div>
    </aside>
  )
}