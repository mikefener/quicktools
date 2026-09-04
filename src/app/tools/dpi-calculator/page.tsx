'use client'

import { useState, useId } from 'react'
import Link from 'next/link'
import ToolGuide from '@/components/ToolGuide'

interface PresetSize {
  name: string
  widthInches: number
  heightInches: number
  type: string
}

const PRESETS: PresetSize[] = [
  { name: '4 × 6 in (Standard Photo)', widthInches: 4, heightInches: 6, type: 'Photo' },
  { name: '5 × 7 in (Photo Print)', widthInches: 5, heightInches: 7, type: 'Photo' },
  { name: '8 × 10 in (Art Print)', widthInches: 8, heightInches: 10, type: 'Art' },
  { name: '11 × 14 in (Small Poster)', widthInches: 11, heightInches: 14, type: 'Poster' },
  { name: '18 × 24 in (Medium Poster)', widthInches: 18, heightInches: 24, type: 'Poster' },
  { name: '24 × 36 in (Large Poster)', widthInches: 24, heightInches: 36, type: 'Poster' },
  { name: 'A4 (210 × 297 mm)', widthInches: 8.27, heightInches: 11.69, type: 'ISO Paper' },
  { name: 'A3 (297 × 420 mm)', widthInches: 11.69, heightInches: 16.54, type: 'ISO Paper' },
]

export default function DpiCalculator() {
  const fileInputId = useId()
  const [mode, setMode] = useState<'pixels-to-print' | 'print-to-pixels'>('pixels-to-print')
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches')

  // Mode 1 State: Pixels -> Print Size
  const [pixelsWidth, setPixelsWidth] = useState<number>(3000)
  const [pixelsHeight, setPixelsHeight] = useState<number>(2000)
  const [targetDpi, setTargetDpi] = useState<number>(300)

  // Mode 2 State: Print Size -> Pixels
  const [printWidth, setPrintWidth] = useState<number>(10)
  const [printHeight, setPrintHeight] = useState<number>(8)
  const [desiredDpi, setDesiredDpi] = useState<number>(300)

  // Image Detection state
  const [detectedFilename, setDetectedFilename] = useState<string | null>(null)

  // Calculations for Mode 1
  const calculatedWidthInches = pixelsWidth > 0 && targetDpi > 0 ? pixelsWidth / targetDpi : 0
  const calculatedHeightInches = pixelsHeight > 0 && targetDpi > 0 ? pixelsHeight / targetDpi : 0
  const calculatedWidthCm = calculatedWidthInches * 2.54
  const calculatedHeightCm = calculatedHeightInches * 2.54

  // Calculations for Mode 2
  const calcPrintInchesW = unit === 'cm' ? printWidth / 2.54 : printWidth
  const calcPrintInchesH = unit === 'cm' ? printHeight / 2.54 : printHeight
  const requiredPixelsW = Math.round(calcPrintInchesW * desiredDpi)
  const requiredPixelsH = Math.round(calcPrintInchesH * desiredDpi)
  const totalMegapixels = ((requiredPixelsW * requiredPixelsH) / 1000000).toFixed(1)

  // Client-side image dimension inspector
  const handleImageInspect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setDetectedFilename(file.name)
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      setPixelsWidth(img.naturalWidth)
      setPixelsHeight(img.naturalHeight)
      setMode('pixels-to-print')
      URL.revokeObjectURL(objectUrl)
    }
    img.src = objectUrl
  }

  const applyPreset = (preset: PresetSize) => {
    setMode('print-to-pixels')
    if (unit === 'inches') {
      setPrintWidth(preset.widthInches)
      setPrintHeight(preset.heightInches)
    } else {
      setPrintWidth(parseFloat((preset.widthInches * 2.54).toFixed(2)))
      setPrintHeight(parseFloat((preset.heightInches * 2.54).toFixed(2)))
    }
  }

  // Visual print quality evaluator
  const getQualityBadge = (dpi: number) => {
    if (dpi >= 300) {
      return {
        label: 'Photo Lab Quality (Crisp & Sharp)',
        color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
      }
    }
    if (dpi >= 150) {
      return {
        label: 'Decent Viewing Quality (Books, Posters)',
        color: 'text-amber-400 bg-amber-950/60 border-amber-800',
      }
    }
    return {
      label: 'Low Resolution (Screen only / Visible Pixels)',
      color: 'text-rose-400 bg-rose-950/60 border-rose-800',
    }
  }

  const qualityInfo = getQualityBadge(mode === 'pixels-to-print' ? targetDpi : desiredDpi)

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-yellow-400 transition-colors"
        >
          &larr; Back to all tools
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">
            DPI, PPI & Print Size Calculator
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Convert digital pixels to physical print dimensions or calculate exact pixel requirements for high-resolution 300 DPI printing.
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('pixels-to-print')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'pixels-to-print'
                ? 'bg-yellow-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Pixels &rarr; Print Size
          </button>
          <button
            type="button"
            onClick={() => setMode('print-to-pixels')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'print-to-pixels'
                ? 'bg-yellow-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Print Size &rarr; Required Pixels
          </button>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-6">
            {mode === 'pixels-to-print' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={pixelsWidth || ''}
                      onChange={(e) => setPixelsWidth(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={pixelsHeight || ''}
                      onChange={(e) => setPixelsHeight(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Target Print DPI
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[300, 150, 72].map((dpiVal) => (
                      <button
                        key={dpiVal}
                        type="button"
                        onClick={() => setTargetDpi(dpiVal)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          targetDpi === dpiVal
                            ? 'bg-yellow-500 text-black border-yellow-500'
                            : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {dpiVal} DPI {dpiVal === 300 && '(Sharp)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dropzone to auto-detect dimensions */}
                <div className="border border-dashed border-zinc-800 rounded-lg p-4 text-center hover:border-zinc-700 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageInspect}
                    className="hidden"
                    id={fileInputId}
                  />
                  <label
                    htmlFor={fileInputId}
                    className="cursor-pointer flex flex-col items-center justify-center gap-1 text-xs text-zinc-400 hover:text-yellow-400"
                  >
                    <span className="font-semibold">Auto-detect from an image file</span>
                    <span className="text-zinc-500 text-[11px]">
                      {detectedFilename ? `Selected: ${detectedFilename}` : 'Click to inspect local image (never uploaded)'}
                    </span>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Measurement Unit
                  </span>
                  <div className="inline-flex rounded-lg bg-zinc-950 border border-zinc-800 p-1">
                    <button
                      type="button"
                      onClick={() => setUnit('inches')}
                      className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                        unit === 'inches' ? 'bg-zinc-800 text-yellow-400' : 'text-zinc-400'
                      }`}
                    >
                      Inches
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('cm')}
                      className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                        unit === 'cm' ? 'bg-zinc-800 text-yellow-400' : 'text-zinc-400'
                      }`}
                    >
                      Centimeters
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Width ({unit === 'inches' ? 'in' : 'cm'})
                    </label>
                    <input
                      type="number"
                      step="any"
                      min={0.1}
                      value={printWidth || ''}
                      onChange={(e) => setPrintWidth(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Height ({unit === 'inches' ? 'in' : 'cm'})
                    </label>
                    <input
                      type="number"
                      step="any"
                      min={0.1}
                      value={printHeight || ''}
                      onChange={(e) => setPrintHeight(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Print DPI Target
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[300, 150, 72].map((dpiVal) => (
                      <button
                        key={dpiVal}
                        type="button"
                        onClick={() => setDesiredDpi(dpiVal)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          desiredDpi === dpiVal
                            ? 'bg-yellow-500 text-black border-yellow-500'
                            : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {dpiVal} DPI {dpiVal === 300 && '(HQ)'}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Standard Presets Section */}
            <div>
              <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Standard Print Presets
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="p-2 text-left bg-zinc-950/60 border border-zinc-800/80 rounded-lg hover:border-yellow-500/50 hover:bg-zinc-900 transition-all cursor-pointer"
                  >
                    <div className="text-xs font-medium text-zinc-200 truncate">{preset.name}</div>
                    <div className="text-[10px] text-zinc-500">{preset.type}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Display */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Calculated Dimensions
              </span>

              {mode === 'pixels-to-print' ? (
                <div className="space-y-3">
                  <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
                    <div className="text-xs text-zinc-500 mb-1">Print Size (Inches)</div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {calculatedWidthInches.toFixed(2)} &times; {calculatedHeightInches.toFixed(2)} in
                    </div>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
                    <div className="text-xs text-zinc-500 mb-1">Print Size (Centimeters)</div>
                    <div className="text-2xl font-bold text-white">
                      {calculatedWidthCm.toFixed(2)} &times; {calculatedHeightCm.toFixed(2)} cm
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
                    <div className="text-xs text-zinc-500 mb-1">Required Canvas Resolution</div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {requiredPixelsW} &times; {requiredPixelsH} px
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">~{totalMegapixels} Megapixels</div>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
                    <div className="text-xs text-zinc-500 mb-1">Aspect Ratio</div>
                    <div className="text-lg font-semibold text-white">
                      {(printWidth / (printHeight || 1)).toFixed(2)} : 1
                    </div>
                  </div>
                </div>
              )}

              {/* Quality Assessment Box */}
              <div className={`border rounded-lg p-3 text-xs font-medium ${qualityInfo.color}`}>
                {qualityInfo.label}
              </div>
            </div>

            {/* Cross-Link Call to Action */}
            <div className="pt-4 border-t border-zinc-800">
              <Link
                href="/tools/image-resizer"
                className="block w-full py-2.5 px-4 text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors"
              >
                Need to resize an image to these dimensions? &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Guide, FAQs, and Ad Placement */}
      <ToolGuide slug="dpi-calculator" />
    </main>
  )
}