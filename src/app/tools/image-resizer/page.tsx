'use client'

import { useState } from 'react'
import Link from 'next/link'
import ToolGuide from '@/components/ToolGuide'

export default function ImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalWidth, setOriginalWidth] = useState<number>(0)
  const [originalHeight, setOriginalHeight] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true)
  const [isResizing, setIsResizing] = useState<boolean>(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      setOriginalWidth(img.naturalWidth)
      setOriginalHeight(img.naturalHeight)
      setWidth(img.naturalWidth)
      setHeight(img.naturalHeight)
      URL.revokeObjectURL(url)
    }

    img.src = url
  }

  const handleWidthChange = (val: number) => {
    setWidth(val)
    if (lockAspectRatio && originalWidth > 0) {
      const ratio = originalHeight / originalWidth
      setHeight(Math.round(val * ratio))
    }
  }

  const handleHeightChange = (val: number) => {
    setHeight(val)
    if (lockAspectRatio && originalHeight > 0) {
      const ratio = originalWidth / originalHeight
      setWidth(Math.round(val * ratio))
    }
  }

  const handleResizeAndDownload = () => {
    if (!selectedFile || width <= 0 || height <= 0) return
    setIsResizing(true)

    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setIsResizing(false)
        return
      }

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      const outputType = selectedFile.type || 'image/png'
      const ext = outputType.includes('jpeg') ? 'jpg' : outputType.replace('image/', '')
      const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name

      canvas.toBlob((blob) => {
        if (!blob) {
          setIsResizing(false)
          return
        }

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${baseName}-${width}x${height}.${ext}`
        link.click()

        URL.revokeObjectURL(url)
        setIsResizing(false)
      }, outputType, 0.92)
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
          <h1 className="text-2xl font-bold text-yellow-400">Image Resizer</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Resize image dimensions while preserving quality. 100% processed in your browser.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center bg-zinc-900/50">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 cursor-pointer"
          />
          {selectedFile && originalWidth > 0 && (
            <p className="mt-3 text-xs text-zinc-400">
              Original Size: <span className="text-white font-medium">{originalWidth} &times; {originalHeight} px</span>
            </p>
          )}
        </div>

        {/* Dimension Controls */}
        {selectedFile && originalWidth > 0 && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Width (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={width || ''}
                  onChange={(e) => handleWidthChange(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Height (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={height || ''}
                  onChange={(e) => handleHeightChange(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>

            {/* Aspect Ratio Lock */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={lockAspectRatio}
                onChange={(e) => setLockAspectRatio(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-yellow-500 focus:ring-yellow-500"
              />
              <span className="text-xs text-zinc-300">Lock Aspect Ratio</span>
            </label>

            {/* Quick Scaling Presets */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Quick Scale Presets
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '25%', factor: 0.25 },
                  { label: '50%', factor: 0.5 },
                  { label: '75%', factor: 0.75 },
                  { label: 'Original', factor: 1 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setWidth(Math.round(originalWidth * preset.factor))
                      setHeight(Math.round(originalHeight * preset.factor))
                    }}
                    className="py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleResizeAndDownload}
              disabled={isResizing || width <= 0 || height <= 0}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-800 text-black font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {isResizing ? 'Resizing...' : `Download Resized Image (${width} \u00d7 ${height})`}
            </button>
          </div>
        )}
      </div>

      {/* Guide, FAQs, and Ad Placement */}
      <ToolGuide slug="image-resizer" />
    </main>
  )
}