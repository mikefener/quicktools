'use client'

import { useState } from 'react'
import Link from 'next/link'
import ToolGuide from '@/components/ToolGuide'

type FormatType = 'image/webp' | 'image/jpeg' | 'image/png' | 'image/avif'

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState<FormatType>('image/webp')
  const [quality, setQuality] = useState<number>(85)
  const [isConverting, setIsConverting] = useState(false)

  const handleConvertAndDownload = () => {
    if (!selectedFile) return
    setIsConverting(true)

    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setIsConverting(false)
        return
      }

      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0)

      const extMap: Record<FormatType, string> = {
        'image/webp': 'webp',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/avif': 'avif',
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsConverting(false)
            return
          }

          const extension = extMap[targetFormat]
          const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${baseName}-converted.${extension}`
          link.click()

          URL.revokeObjectURL(url)
          setIsConverting(false)
        },
        targetFormat,
        targetFormat === 'image/png' ? undefined : quality / 100
      )
    }

    reader.readAsDataURL(selectedFile)
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
          <h1 className="text-2xl font-bold text-yellow-400">Image Format Converter</h1>
          <p className="text-zinc-400 text-sm mt-1">Convert and compress PNG, JPG, WebP, or AVIF directly in your browser.</p>
        </div>

        {/* Upload Box */}
        <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center bg-zinc-900/50">
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp, image/avif"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 cursor-pointer"
          />
          {selectedFile && (
            <p className="mt-3 text-xs text-zinc-400">
              Selected: <span className="text-white font-medium">{selectedFile.name}</span>
            </p>
          )}
        </div>

        {/* Controls */}
        {selectedFile && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Choose Output Format
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'WEBP', format: 'image/webp' },
                  { label: 'JPG', format: 'image/jpeg' },
                  { label: 'PNG', format: 'image/png' },
                  { label: 'AVIF', format: 'image/avif' },
                ].map((item) => (
                  <button
                    key={item.format}
                    type="button"
                    onClick={() => setTargetFormat(item.format as FormatType)}
                    className={`py-2 rounded-lg font-medium text-xs sm:text-sm transition-all border ${
                      targetFormat === item.format
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Quality / Compression
                </label>
                <span className="text-sm font-semibold text-yellow-400">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={targetFormat === 'image/png'}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed"
              />
              {targetFormat === 'image/png' ? (
                <p className="text-[11px] text-zinc-500 mt-1">PNG is lossless; quality slider is disabled.</p>
              ) : (
                <p className="text-[11px] text-zinc-500 mt-1">Lower values reduce file size significantly.</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleConvertAndDownload}
              disabled={isConverting}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-800 text-black font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {isConverting ? 'Converting...' : 'Convert & Download'}
            </button>
          </div>
        )}
      </div>

      {/* Guide, FAQs, and Ad Placement */}
      <ToolGuide slug="image-converter" />
    </main>
  )
}