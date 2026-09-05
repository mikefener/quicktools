'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ToolGuide from '@/components/ToolGuide'

const SAMPLE_JSON = {
  appName: 'QuickTools Web',
  version: '2.4.0',
  clientSideOnly: true,
  features: ['Image Converter', 'PDF Splitter', 'DPI Calculator', 'Timezone Planner'],
  security: {
    serverUploads: false,
    localStorageEncryption: true,
    telemetry: 'minimal-anonymous',
  },
  metrics: {
    dailyActiveUsers: 14250,
    uptimePercent: 99.98,
  },
}

export default function JsonFormatter() {
  const [inputJson, setInputJson] = useState<string>('')
  const [indentSize, setIndentSize] = useState<number | 'tab'>(2)
  const [copied, setCopied] = useState<boolean>(false)

  // Parse and validate in real-time
  const parseResult = useMemo(() => {
    if (!inputJson.trim()) {
      return { isValid: null, parsed: null, error: null, line: null, col: null }
    }

    try {
      const parsed = JSON.parse(inputJson)
      return { isValid: true, parsed, error: null, line: null, col: null }
    } catch (err: unknown) {
      let message = 'Invalid JSON syntax'
      let line: number | null = null
      let col: number | null = null

      if (err instanceof Error) {
        message = err.message
        // Extract line/column information from standard engine error strings
        const match = err.message.match(/at position (\d+)/i)
        if (match) {
          const pos = parseInt(match[1], 10)
          const linesUpToError = inputJson.slice(0, pos).split('\n')
          line = linesUpToError.length
          col = linesUpToError[linesUpToError.length - 1].length + 1
        }
      }

      return { isValid: false, parsed: null, error: message, line, col }
    }
  }, [inputJson])

  // Formatting actions
  const formatJson = (indent: number | 'tab') => {
    if (!inputJson.trim()) return
    try {
      const obj = JSON.parse(inputJson)
      const space = indent === 'tab' ? '\t' : indent
      setInputJson(JSON.stringify(obj, null, space))
      setIndentSize(indent)
    } catch {
      // Keep existing invalid string for user inspection
    }
  }

  const minifyJson = () => {
    if (!inputJson.trim()) return
    try {
      const obj = JSON.parse(inputJson)
      setInputJson(JSON.stringify(obj))
    } catch {
      // Cannot minify invalid JSON
    }
  }

  // Enhanced repair engine: handles comments, stray punctuation, unquoted keys, single quotes, and trailing commas
  const autoFixJson = () => {
    if (!inputJson.trim()) return
    let fixed = inputJson

    // 1. Remove single-line comments (// ...) and multi-line comments (/* ... */)
    fixed = fixed.replace(/\/\/.*$/gm, '')
    fixed = fixed.replace(/\/\*[\s\S]*?\*\//g, '')

    // 2. Strip stray trailing dots/ellipses after booleans, null, or numbers (e.g., true.. -> true, 15.. -> 15)
    fixed = fixed.replace(
      /((?:[:\[,]\s*)(?:true|false|null|-?\d+(?:\.\d+)?))\s*\.+(\s*(?:[,}\]\n\r]|$))/gi,
      '$1$2'
    )

    // 3. Fix unquoted keys ({ key: "val" } -> { "key": "val" })
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$-]*)\s*:/g, '$1"$2":')

    // 4. Convert single-quoted keys and values to double quotes
    fixed = fixed.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"')

    // 5. Remove trailing commas before closing braces and brackets
    fixed = fixed.replace(/,+(?=\s*[}\]])/g, '')

    try {
      const obj = JSON.parse(fixed)
      const space = indentSize === 'tab' ? '\t' : indentSize
      setInputJson(JSON.stringify(obj, null, space))
    } catch {
      setInputJson(fixed)
    }
  }

  const handleCopy = () => {
    if (!inputJson.trim()) return
    navigator.clipboard.writeText(inputJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!inputJson.trim()) return
    const blob = new Blob([inputJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quicktools-formatted.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) setInputJson(content)
    }
    reader.readAsText(file)
  }

  const loadSample = () => {
    setInputJson(JSON.stringify(SAMPLE_JSON, null, 2))
  }

  // Size metrics
  const byteCount = useMemo(() => new Blob([inputJson]).size, [inputJson])
  const lineCount = useMemo(
    () => (inputJson ? inputJson.split('\n').length : 0),
    [inputJson]
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-yellow-400 transition-colors"
        >
          &larr; Back to all tools
        </Link>

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">
              JSON Formatter & Validator
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Beautify, validate, fix, and minify JSON data client-side. Zero server logging.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={loadSample}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Load Sample
            </button>
            <label className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors cursor-pointer">
              Upload .json
              <input
                type="file"
                accept=".json,text/plain"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() => setInputJson('')}
              className="px-3 py-2 bg-zinc-800 hover:bg-rose-950/60 hover:text-rose-400 text-zinc-400 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Format / Minify Operations */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1">
              Indent:
            </span>
            <button
              type="button"
              onClick={() => formatJson(2)}
              className={`px-2.5 py-1.5 text-xs font-mono rounded-md cursor-pointer transition-colors ${
                indentSize === 2 && parseResult.isValid
                  ? 'bg-yellow-500 text-black font-semibold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              2 Spaces
            </button>
            <button
              type="button"
              onClick={() => formatJson(4)}
              className={`px-2.5 py-1.5 text-xs font-mono rounded-md cursor-pointer transition-colors ${
                indentSize === 4 && parseResult.isValid
                  ? 'bg-yellow-500 text-black font-semibold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              4 Spaces
            </button>
            <button
              type="button"
              onClick={() => formatJson('tab')}
              className={`px-2.5 py-1.5 text-xs font-mono rounded-md cursor-pointer transition-colors ${
                indentSize === 'tab' && parseResult.isValid
                  ? 'bg-yellow-500 text-black font-semibold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Tab
            </button>
            <div className="h-4 w-px bg-zinc-700 mx-1 hidden sm:block"></div>
            <button
              type="button"
              onClick={minifyJson}
              className="px-2.5 py-1.5 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md cursor-pointer transition-colors"
            >
              Minify
            </button>
            <button
              type="button"
              onClick={autoFixJson}
              className="px-2.5 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-emerald-950/60 hover:text-emerald-400 text-zinc-300 border border-transparent hover:border-emerald-800 rounded-md cursor-pointer transition-colors"
              title="Fix trailing commas, unquoted keys, single quotes, comments, and stray dots"
            >
              Auto-Fix Syntax
            </button>
          </div>

          {/* Export / Copy Operations */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!inputJson.trim()}
              className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-xs rounded-md transition-colors cursor-pointer"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!inputJson.trim()}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-200 text-xs font-medium rounded-md transition-colors cursor-pointer"
            >
              Download .json
            </button>
          </div>
        </div>

        {/* Validation Status Banner */}
        {parseResult.isValid !== null && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
              parseResult.isValid
                ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-400'
                : 'bg-rose-950/30 border-rose-800/80 text-rose-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold">
                {parseResult.isValid ? '✓ Valid JSON' : '✕ Invalid JSON:'}
              </span>
              <span>{parseResult.error || 'Syntax is clean and compliant.'}</span>
            </div>
            {parseResult.line && (
              <span className="font-mono bg-rose-900/40 px-2 py-0.5 rounded border border-rose-800">
                Line {parseResult.line}, Col {parseResult.col}
              </span>
            )}
          </div>
        )}

        {/* Editor Area */}
        <div className="relative bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-yellow-500/60 transition-colors">
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Paste your JSON payload or drop a file here to inspect, validate, or format..."
            rows={18}
            className="w-full bg-transparent p-4 font-mono text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 resize-y focus:outline-none leading-relaxed"
            spellCheck={false}
          />

          {/* Bottom Editor Metrics */}
          <div className="bg-zinc-950/80 border-t border-zinc-800/80 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <div className="flex items-center gap-4">
              <span>Lines: {lineCount}</span>
              <span>Characters: {inputJson.length}</span>
              <span>
                Size:{' '}
                {byteCount < 1024
                  ? `${byteCount} B`
                  : `${(byteCount / 1024).toFixed(2)} KB`}
              </span>
            </div>
            <span className="text-zinc-600">Pure Client-Side (0 Server Storage)</span>
          </div>
        </div>
      </div>

      {/* Structured SEO Guide, FAQs, and Ad Unit */}
      <ToolGuide slug="json-formatter" />
    </main>
  )
}