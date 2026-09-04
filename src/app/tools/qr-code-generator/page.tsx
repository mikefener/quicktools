'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import ToolGuide from '@/components/ToolGuide'

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://quicktoolsweb.com')
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [size, setSize] = useState<number>(300)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !text.trim()) return

    QRCode.toCanvas(
      canvasRef.current,
      text,
      {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorCorrectionLevel,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      },
      (err) => {
        if (err) console.error(err)
      }
    )
  }, [text, errorCorrectionLevel, size])

  const handleDownloadPng = () => {
    if (!canvasRef.current || !text.trim()) return
    const url = canvasRef.current.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = 'qrcode.png'
    link.click()
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
          <h1 className="text-2xl font-bold text-yellow-400">QR Code Generator</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Generate crisp QR codes instantly. 100% processed in your browser with zero data tracked.
          </p>
        </div>

        {/* Input & Controls */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              URL or Text Content
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or URL..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Output Resolution
              </label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-yellow-500 cursor-pointer"
              >
                <option value={200}>200 &times; 200 px</option>
                <option value={300}>300 &times; 300 px</option>
                <option value={500}>500 &times; 500 px (HD)</option>
                <option value={1000}>1000 &times; 1000 px (Print)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Error Correction
              </label>
              <select
                value={errorCorrectionLevel}
                onChange={(e) => setErrorCorrectionLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-yellow-500 cursor-pointer"
              >
                <option value="L">Low (7%)</option>
                <option value="M">Medium (15%)</option>
                <option value="Q">Quartile (25%)</option>
                <option value="H">High (30%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center gap-6">
          <div className="p-4 bg-white rounded-xl shadow-lg">
            <canvas ref={canvasRef} className="max-w-full h-auto" />
          </div>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={!text.trim()}
            className="w-full max-w-sm py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-800 text-black font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Download QR Code (PNG)
          </button>
        </div>
      </div>

      {/* Guide, FAQs, and Ad Placement */}
      <ToolGuide slug="qr-code-generator" />
    </main>
  )
}