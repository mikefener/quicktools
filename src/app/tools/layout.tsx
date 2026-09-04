import PromoFrame from '@/components/PromoFrame'

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-full">
      {children}
      <div className="max-w-2xl mx-auto w-full px-6 pb-12 -mt-4">
        <PromoFrame />
      </div>
    </div>
  )
}