'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PDFDocument } from 'pdf-lib'
import ToolGuide from '@/components/ToolGuide'

export default function PdfSplitter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [pageRange, setPageRange] = useState<string>('1')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setErrorMsg('')
    setPdfFile(file)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
      const count = pdf.getPageCount()

      if (count === 0) throw new Error('PDF has no readable pages.')

      setTotalPages(count)
      setPageRange(count > 1 ? `1-${Math.min(count, 3)}` : '1')
    } catch {
      setErrorMsg('Failed to read PDF file.')
    }
  }

  const parsePages = (rangeStr: string, total: number): number[] => {
    const pages = new Set<number>()
    const parts = rangeStr.split(',').map((p) => p.trim())

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n, 10))
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(total, end); i++) {
            pages.add(i - 1)
          }
        }
      } else {
        const pageNum = parseInt(part, 10)
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= total) {
          pages.add(pageNum - 1)
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b)
  }

  const handleExtractAndDownload = async () => {
    if (!pdfFile || totalPages === 0) return
    setIsProcessing(true)
    setErrorMsg('')

    try {
      const selectedIndices = parsePages(pageRange, totalPages)
      if (selectedIndices.length === 0) {
        throw new Error(`Enter valid numbers between 1 and ${totalPages}.`)
      }

      const arrayBuffer = await pdfFile.arrayBuffer()
      const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
      const newPdf = await PDFDocument.create()

      const copiedPages = await newPdf.copyPages(sourcePdf, selectedIndices)
      copiedPages.forEach((page) => newPdf.addPage(page))

      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const baseName = pdfFile.name.replace(/\.pdf$/i, '')
      const link = document.createElement('a')
      link.href = url
      link.download = `${baseName}-extracted.pdf`
      link.click()

      URL.revokeObjectURL(url)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error extracting pages.')
    } finally {
      setIsProcessing(false)
    }
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
          <h1 className="text-2xl font-bold text-yellow-400">PDF Splitter & Extractor</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Extract specific pages or page ranges into a separate PDF. 100% private in your browser.
          </p>
        </div>

        {/* Upload Box */}
        <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center bg-zinc-900/50">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 cursor-pointer"
          />
          {pdfFile && totalPages > 0 && (
            <p className="mt-3 text-xs text-zinc-400">
              Selected: <span className="text-white font-medium">{pdfFile.name}</span> ({totalPages} {totalPages === 1 ? 'page' : 'pages'})
            </p>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        {/* Configuration */}
        {pdfFile && totalPages > 0 && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Pages to Extract (e.g. 1-3 or 1, 3, 5)
              </label>
              <input
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder={`1-${totalPages}`}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Document has {totalPages} pages. Enter a range (1-{totalPages}) or comma-separated numbers.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExtractAndDownload}
              disabled={isProcessing || !pageRange.trim()}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-800 text-black font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {isProcessing ? 'Extracting Pages...' : 'Extract & Download PDF'}
            </button>
          </div>
        )}
      </div>

      {/* Guide, FAQs, and Ad Placement */}
      <ToolGuide slug="pdf-splitter" />
    </main>
  )
}