'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import ToolGuide from '@/components/ToolGuide'
import { ALL_CITIES, COMMON_TIMEZONES, type CityZone } from './cities'

const SLIDER_TICKS = [
  { hr: 0, label: '12 AM' },
  { hr: 3, label: '3 AM' },
  { hr: 6, label: '6 AM' },
  { hr: 9, label: '9 AM' },
  { hr: 12, label: '12 PM' },
  { hr: 15, label: '3 PM' },
  { hr: 18, label: '6 PM' },
  { hr: 21, label: '9 PM' },
  { hr: 23, label: '11 PM' },
]

export default function TimezonePlanner() {
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>(['flr', 'nyc', 'lon'])
  const [customCities, setCustomCities] = useState<CityZone[]>([])
  const [selectedHour, setSelectedHour] = useState<number>(() => new Date().getHours())
  const [copied, setCopied] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [userTz, setUserTz] = useState<string>('UTC')

  // Custom city modal/form state
  const [isAddingCustom, setIsAddingCustom] = useState<boolean>(false)
  const [customName, setCustomName] = useState<string>('')
  const [customCountry, setCustomCountry] = useState<string>('')
  const [customZone, setCustomZone] = useState<string>('Europe/Rome')

  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (detected) {
        setUserTz(detected)
        setCustomZone(detected)
      }
    } catch {
      setUserTz('UTC')
    }

    // Load custom cities
    try {
      const savedCustom = localStorage.getItem('quicktools_tz_custom_cities')
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom)
        if (Array.isArray(parsed)) setCustomCities(parsed)
      }
    } catch {
      // Ignore
    }

    // Load selected cities
    try {
      const saved = localStorage.getItem('quicktools_tz_cities')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedCityIds(parsed)
        }
      }
    } catch {
      // Fallback
    }
  }, [])

  // Combined pool of standard + user-created custom cities
  const fullCityCatalog = useMemo(() => {
    return [...customCities, ...ALL_CITIES]
  }, [customCities])

  const updateCities = (newCityIds: string[]) => {
    setSelectedCityIds(newCityIds)
    try {
      localStorage.setItem('quicktools_tz_cities', JSON.stringify(newCityIds))
    } catch {
      // Ignore
    }
  }

  const addCity = (id: string) => {
    if (!selectedCityIds.includes(id)) {
      updateCities([...selectedCityIds, id])
    }
  }

  const removeCity = (id: string) => {
    if (selectedCityIds.length <= 1) return
    updateCities(selectedCityIds.filter((item) => item !== id))
  }

  const handleCreateCustomCity = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customName.trim()) return

    const newId = `custom_${Date.now()}`
    const newEntry: CityZone = {
      id: newId,
      name: customName.trim(),
      country: customCountry.trim() || 'Custom Location',
      zone: customZone,
    }

    const updatedCustom = [newEntry, ...customCities]
    setCustomCities(updatedCustom)
    try {
      localStorage.setItem('quicktools_tz_custom_cities', JSON.stringify(updatedCustom))
    } catch {
      // Ignore
    }

    addCity(newId)
    setCustomName('')
    setCustomCountry('')
    setIsAddingCustom(false)
    setSearchQuery('')
  }

  const activeCities = useMemo(() => {
    return selectedCityIds
      .map((id) => fullCityCatalog.find((c) => c.id === id))
      .filter((c): c is CityZone => Boolean(c))
  }, [selectedCityIds, fullCityCatalog])

  const getReferenceDateForHour = (hour: number) => {
    const d = new Date()
    d.setMinutes(0)
    d.setSeconds(0)
    d.setMilliseconds(0)
    d.setHours(hour)
    return d
  }

  const formatTimeForZone = (date: Date, timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date)
    } catch {
      return '--:--'
    }
  }

  const getHourInZone = (date: Date, timeZone: string) => {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: 'numeric',
        hourCycle: 'h23',
      }).formatToParts(date)
      const hourPart = parts.find((p) => p.type === 'hour')
      return hourPart ? parseInt(hourPart.value, 10) : 0
    } catch {
      return 0
    }
  }

  const handleCopySnippet = () => {
    const refDate = getReferenceDateForHour(selectedHour)
    const lines = activeCities.map((c) => {
      const timeStr = formatTimeForZone(refDate, c.zone)
      return `• ${c.name} (${c.country}): ${timeStr}`
    })

    const textToCopy = `Proposed Meeting Window:\n${lines.join('\n')}\n\nCoordinated via QuickTools Timezone Planner`
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const stepHour = (delta: number) => {
    setSelectedHour((prev) => {
      const next = prev + delta
      if (next < 0) return 23
      if (next > 23) return 0
      return next
    })
  }

  const resetToNow = () => {
    setSelectedHour(new Date().getHours())
  }

  const filteredSearch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    return fullCityCatalog
      .filter(
        (c) =>
          !selectedCityIds.includes(c.id) &&
          (c.name.toLowerCase().includes(q) ||
            c.country.toLowerCase().includes(q) ||
            c.zone.toLowerCase().includes(q))
      )
      .slice(0, 40) // Responsive limit for smooth rendering
  }, [searchQuery, selectedCityIds, fullCityCatalog])

  const hoursRange = Array.from({ length: 24 }, (_, i) => i)

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-yellow-400 transition-colors"
        >
          &larr; Back to all tools
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">
              Visual Time Zone & Overlap Planner
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Compare global and regional working hours side-by-side. 100% calculated client-side in your browser.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopySnippet}
            className="self-start sm:self-auto px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs rounded-lg transition-all shadow cursor-pointer whitespace-nowrap"
          >
            {copied ? '✓ Copied to Clipboard!' : 'Copy Meeting Times for Slack/Email'}
          </button>
        </div>

        {/* Master Time Scrubber */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Selected Cursor (Your Device Time: {userTz.replace('_', ' ')})
              </span>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-2xl font-bold text-yellow-400">
                  {formatTimeForZone(getReferenceDateForHour(selectedHour), userTz)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => stepHour(-1)}
                    className="px-2 py-1 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded cursor-pointer"
                    title="Subtract 1 hour"
                  >
                    -1h
                  </button>
                  <button
                    type="button"
                    onClick={() => stepHour(1)}
                    className="px-2 py-1 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded cursor-pointer"
                    title="Add 1 hour"
                  >
                    +1h
                  </button>
                  <button
                    type="button"
                    onClick={resetToNow}
                    className="px-2.5 py-1 text-xs bg-zinc-800 hover:bg-yellow-500 hover:text-black text-zinc-300 rounded font-medium transition-colors cursor-pointer"
                  >
                    Current Hour
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500"></span>
                Work Hours (9am – 5pm)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700"></span>
                Off-Hours
              </span>
            </div>
          </div>

          {/* Slider & Mathematically Aligned Ticks */}
          <div className="relative pt-2 pb-6">
            <input
              type="range"
              min={0}
              max={23}
              step={1}
              value={selectedHour}
              onChange={(e) => setSelectedHour(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
            />

            <div className="relative w-full h-4 mt-2">
              {SLIDER_TICKS.map((tick) => {
                const percent = (tick.hr / 23) * 100
                const isCurrent = Math.abs(selectedHour - tick.hr) <= 1

                return (
                  <button
                    key={tick.hr}
                    type="button"
                    onClick={() => setSelectedHour(tick.hr)}
                    style={{ left: `${percent}%` }}
                    className={`absolute -translate-x-1/2 text-[10px] font-mono whitespace-nowrap transition-colors cursor-pointer ${
                      selectedHour === tick.hr
                        ? 'text-yellow-400 font-bold'
                        : isCurrent
                        ? 'text-zinc-300'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tick.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Visual Multi-Zone Matrix */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6 space-y-3 overflow-x-auto">
          <div className="min-w-[720px] space-y-2.5">
            <div className="flex items-center justify-between pb-1 px-1 border-b border-zinc-800/80 text-[11px] text-zinc-400">
              <span className="font-semibold uppercase tracking-wider text-zinc-400">
                City / Region
              </span>
              <span className="font-mono text-zinc-400">
                24-Hour Timeline ({userTz.replace('_', ' ')})
              </span>
            </div>

            {activeCities.map((city) => {
              const refDate = getReferenceDateForHour(selectedHour)
              const formattedCurrent = formatTimeForZone(refDate, city.zone)
              const currentZoneHour = getHourInZone(refDate, city.zone)
              const isWorkHourNow = currentZoneHour >= 9 && currentZoneHour < 17

              return (
                <div
                  key={city.id}
                  className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-3.5 space-y-2 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{city.name}</span>
                      <span className="text-xs text-zinc-500">({city.country})</span>
                      <span className="text-[10px] font-mono text-zinc-600 hidden sm:inline">
                        [{city.zone}]
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          isWorkHourNow
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                        }`}
                      >
                        {formattedCurrent}
                      </span>
                      {activeCities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCity(city.id)}
                          className="text-zinc-500 hover:text-rose-400 text-xs px-1 cursor-pointer"
                          title="Remove city"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 24-Hour Heatmap Track */}
                  <div className="grid grid-cols-24 gap-0.5 h-6 rounded bg-zinc-900/60 p-0.5">
                    {hoursRange.map((hr) => {
                      const hourDate = getReferenceDateForHour(hr)
                      const localHr = getHourInZone(hourDate, city.zone)
                      const isWorking = localHr >= 9 && localHr < 17
                      const isSelected = hr === selectedHour

                      return (
                        <button
                          key={hr}
                          type="button"
                          onClick={() => setSelectedHour(hr)}
                          title={`${city.name}: ${formatTimeForZone(hourDate, city.zone)} (Click to select)`}
                          className={`h-full rounded-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-yellow-400/20 ring-2 ring-yellow-400 z-10'
                              : isWorking
                              ? 'bg-emerald-500/40 hover:bg-emerald-500/60'
                              : 'bg-zinc-900 hover:bg-zinc-800'
                          }`}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Search & Add City Section */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Search Cities or Add Custom Location
            </label>
            <span className="text-[11px] text-zinc-500">
              {fullCityCatalog.length} locations available
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by city or country (e.g., Florence, Catania, Rome, Italy, Tokyo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
            />
            <button
              type="button"
              onClick={() => {
                setCustomName(searchQuery)
                setIsAddingCustom(!isAddingCustom)
              }}
              className="px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-yellow-400 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              {isAddingCustom ? 'Cancel' : '+ Custom City'}
            </button>
          </div>

          {/* Inline Custom City Creator */}
          {isAddingCustom && (
            <form
              onSubmit={handleCreateCustomCity}
              className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3 mt-2"
            >
              <div className="text-xs font-semibold text-yellow-400">
                Add Any Town or Custom Location
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Town / City name (e.g. Sorrento)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500"
                />
                <input
                  type="text"
                  placeholder="Region / Country (e.g. Italy)"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500"
                />
                <select
                  value={customZone}
                  onChange={(e) => setCustomZone(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500 cursor-pointer"
                >
                  {COMMON_TIMEZONES.map((tz) => (
                    <option key={tz.zone} value={tz.zone}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-xs rounded-md cursor-pointer transition-colors"
                >
                  Save & Add to Timeline
                </button>
              </div>
            </form>
          )}

          {/* Search Dropdown Results */}
          {searchQuery.trim() !== '' && (
            <div className="max-h-60 overflow-y-auto border border-zinc-800 rounded-lg bg-zinc-950 divide-y divide-zinc-800/60 shadow-xl">
              {filteredSearch.length === 0 ? (
                <div className="p-4 text-center space-y-2">
                  <p className="text-xs text-zinc-500">
                    No predefined city found for &quot;{searchQuery}&quot;
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomName(searchQuery)
                      setIsAddingCustom(true)
                    }}
                    className="text-xs text-yellow-400 hover:underline font-medium cursor-pointer"
                  >
                    + Add &quot;{searchQuery}&quot; as a custom city
                  </button>
                </div>
              ) : (
                filteredSearch.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      addCity(city.id)
                      setSearchQuery('')
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-yellow-400 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>
                      <strong className="text-white font-medium">{city.name}</strong>{' '}
                      <span className="text-zinc-500">({city.country})</span>
                    </span>
                    <span className="text-yellow-400 text-xs font-semibold">+ Add</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <ToolGuide slug="timezone-planner" />
    </main>
  )
}