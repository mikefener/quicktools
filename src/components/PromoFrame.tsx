interface PromoFrameProps {
  className?: string
}

export default function PromoFrame({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full my-6 ${className}`}>
      <div className="w-full h-24 sm:h-28 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 flex flex-col items-center justify-center text-zinc-500 text-xs">
        <span className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1 font-mono">
          Display Placement Area
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400/70"></span>
          <span>Responsive Unit (728x90 / Auto)</span>
        </div>
      </div>
    </div>
  )
}