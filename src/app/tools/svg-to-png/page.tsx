'use client'

import { useState } from 'react'
import Link from 'next/link'
import ToolGuide from '@/components/ToolGuide'

export default function SvgToPng() {
  const [svgFile, setSvgFile] = useState<File | null>(null)
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [scale, setScale] = useState<number>(2)
  const [isExporting, setIsExporting] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSvgFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      setSvgContent(event.target?.result as string)
    }
    reader.readAsText(file)
  }

  const handleDownloadPng = () => {
    if (!svgContent || !svgFile) return
    setIsExporting(true)

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()

    img.onload = () => {
      const width = (img.naturalWidth || 512) * scale
      const height = (img.naturalHeight || 512) * scale

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setIsExporting(false)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) {
          setIsExporting(false)
          return
        }

        const baseName = svgFile.name.replace(/\.svg$/i, '')
        const pngUrl = URL.createObjectURL(pngBlob)
        const link = document.createElement('a')
        link.href = pngUrl
        link.download = `${baseName}@${scale}x.png`
        link.click()

        URL.revokeObjectURL(pngUrl)
        URL.revokeObjectURL(url)
        setIsExporting(false)
      }, 'image/png')
    }

    img.src = url
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 sm:p-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-yellow-400 transition-colors"
        >
          &larr; Back to all tools
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-yellow-400">SVG to PNG Exporter</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Convert vector SVG files to high-resolution transparent PNGs directly in your browser.
          </p>
        </div>

        {/* Upload Box */}
        <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center bg-zinc-900/50">
          <input
            type="file"
            accept=".svg,image/svg+xml"
            onChange={handleFileSelect}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 cursor-pointer"
          />
          {svgFile && (
            <p className="mt-3 text-xs text-zinc-400">
              Selected: <span className="text-white font-medium">{svgFile.name}</span>
            </p>
          )}
        </div>

        {/* Scale Options & Export */}
        {svgFile && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Export Resolution Scale
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '1x (Standard)', val: 1 },
                  { label: '2x (High-DPI)', val: 2 },
                  { label: '4x (Ultra HD)', val: 4 },
                  { label: '8x (Print)', val: 8 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setScale(item.val)}
                    className={`py-2 px-1 text-center rounded-lg font-medium text-xs sm:text-sm border transition-all ${
                      scale === item.val
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-800 text-black font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {isExporting ? 'Generating PNG...' : `Export ${scale}x PNG`}
            </button>
          </div>
        )}
      </div>

      {/* Guide, FAQs, and Ad Placement */}
      <ToolGuide slug="svg-to-png" />
    </main>
  )
}