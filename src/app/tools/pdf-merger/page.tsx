'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PDFDocument } from 'pdf-lib'
import ToolGuide from '@/components/ToolGuide'

export default function PdfMerger() {
  const [pdfFiles, setPdfFiles] = useState<File[]>([])
  const [isMerging, setIsMerging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(
        (file) => file.name.toLowerCase().endsWith('.pdf') || file.type.includes('pdf')
      )
      setPdfFiles((prev) => [...prev, ...selected])
    }
  }

  const removeFile = (indexToRemove: number) => {
    setPdfFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleMergeAndDownload = async () => {
    if (pdfFiles.length < 2) return
    setIsMerging(true)

    try {
      const mergedPdf = await PDFDocument.create()

      for (const file of pdfFiles) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const mergedPdfBytes = await mergedPdf.save()
      const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'merged-document.pdf'
      link.click()

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Merge failed:', error)
      alert('Failed to merge PDFs. One of your files might be corrupted or password-protected.')
    } finally {
      setIsMerging(false)
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
          <h1 className="text-2xl font-bold text-yellow-400">PDF Merger</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Combine multiple PDF files into one. 100% private — your documents never leave your browser.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center bg-zinc-900/50">
          <input
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 cursor-pointer"
          />
          <p className="mt-2 text-xs text-zinc-500">Hold Ctrl or Shift to select multiple PDF files at once.</p>
        </div>

        {/* Selected Files List */}
        {pdfFiles.length > 0 && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Files to Merge ({pdfFiles.length})
            </h2>

            <ul className="space-y-2">
              {pdfFiles.map((file, idx) => (
                <li
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm"
                >
                  <span className="truncate max-w-[80%] text-zinc-300">
                    {idx + 1}. {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleMergeAndDownload}
              disabled={pdfFiles.length < 2 || isMerging}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {isMerging
                ? 'Merging PDFs...'
                : pdfFiles.length < 2
                ? 'Select at least 2 PDFs to Merge'
                : 'Merge & Download PDF'}
            </button>
          </div>
        )}
      </div>

      {/* Guide, FAQs, and Ad Placement */}
      <ToolGuide slug="pdf-merger" />
    </main>
  )
}