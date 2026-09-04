'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import ToolGuide from '@/components/ToolGuide'

interface CityZone {
  id: string
  name: string
  country: string
  zone: string
}

const ALL_CITIES: CityZone[] = [
  // Europe
  { id: 'lon', name: 'London', country: 'United Kingdom', zone: 'Europe/London' },
  { id: 'man', name: 'Manchester', country: 'United Kingdom', zone: 'Europe/London' },
  { id: 'dub', name: 'Dublin', country: 'Ireland', zone: 'Europe/Dublin' },
  { id: 'par', name: 'Paris', country: 'France', zone: 'Europe/Paris' },
  { id: 'lyo', name: 'Lyon', country: 'France', zone: 'Europe/Paris' },
  { id: 'ber', name: 'Berlin', country: 'Germany', zone: 'Europe/Berlin' },
  { id: 'mun', name: 'Munich', country: 'Germany', zone: 'Europe/Berlin' },
  { id: 'fra', name: 'Frankfurt', country: 'Germany', zone: 'Europe/Berlin' },
  { id: 'rom', name: 'Rome', country: 'Italy', zone: 'Europe/Rome' },
  { id: 'mil', name: 'Milan', country: 'Italy', zone: 'Europe/Rome' },
  { id: 'nap', name: 'Naples', country: 'Italy', zone: 'Europe/Rome' },
  { id: 'mad', name: 'Madrid', country: 'Spain', zone: 'Europe/Madrid' },
  { id: 'bcn', name: 'Barcelona', country: 'Spain', zone: 'Europe/Madrid' },
  { id: 'ams', name: 'Amsterdam', country: 'Netherlands', zone: 'Europe/Amsterdam' },
  { id: 'bru', name: 'Brussels', country: 'Belgium', zone: 'Europe/Brussels' },
  { id: 'lis', name: 'Lisbon', country: 'Portugal', zone: 'Europe/Lisbon' },
  { id: 'vie', name: 'Vienna', country: 'Austria', zone: 'Europe/Vienna' },
  { id: 'zur', name: 'Zurich', country: 'Switzerland', zone: 'Europe/Zurich' },
  { id: 'gva', name: 'Geneva', country: 'Switzerland', zone: 'Europe/Zurich' },
  { id: 'ath', name: 'Athens', country: 'Greece', zone: 'Europe/Athens' },
  { id: 'nic', name: 'Nicosia', country: 'Cyprus', zone: 'Asia/Nicosia' },
  { id: 'lim', name: 'Limassol', country: 'Cyprus', zone: 'Asia/Nicosia' },
  { id: 'ist', name: 'Istanbul', country: 'Turkey', zone: 'Europe/Istanbul' },
  { id: 'ank', name: 'Ankara', country: 'Turkey', zone: 'Europe/Istanbul' },
  { id: 'war', name: 'Warsaw', country: 'Poland', zone: 'Europe/Warsaw' },
  { id: 'prg', name: 'Prague', country: 'Czech Republic', zone: 'Europe/Prague' },
  { id: 'bud', name: 'Budapest', country: 'Hungary', zone: 'Europe/Budapest' },
  { id: 'buc', name: 'Bucharest', country: 'Romania', zone: 'Europe/Bucharest' },
  { id: 'sto', name: 'Stockholm', country: 'Sweden', zone: 'Europe/Stockholm' },
  { id: 'osl', name: 'Oslo', country: 'Norway', zone: 'Europe/Oslo' },
  { id: 'cph', name: 'Copenhagen', country: 'Denmark', zone: 'Europe/Copenhagen' },
  { id: 'hel', name: 'Helsinki', country: 'Finland', zone: 'Europe/Helsinki' },
  { id: 'kyi', name: 'Kyiv', country: 'Ukraine', zone: 'Europe/Kyiv' },
  { id: 'sof', name: 'Sofia', country: 'Bulgaria', zone: 'Europe/Sofia' },
  { id: 'zag', name: 'Zagreb', country: 'Croatia', zone: 'Europe/Zagreb' },
  { id: 'bel', name: 'Belgrade', country: 'Serbia', zone: 'Europe/Belgrade' },

  // North America
  { id: 'nyc', name: 'New York', country: 'United States', zone: 'America/New_York' },
  { id: 'bos', name: 'Boston', country: 'United States', zone: 'America/New_York' },
  { id: 'mia', name: 'Miami', country: 'United States', zone: 'America/New_York' },
  { id: 'atl', name: 'Atlanta', country: 'United States', zone: 'America/New_York' },
  { id: 'was', name: 'Washington D.C.', country: 'United States', zone: 'America/New_York' },
  { id: 'chi', name: 'Chicago', country: 'United States', zone: 'America/Chicago' },
  { id: 'dal', name: 'Dallas', country: 'United States', zone: 'America/Chicago' },
  { id: 'hou', name: 'Houston', country: 'United States', zone: 'America/Chicago' },
  { id: 'aus', name: 'Austin', country: 'United States', zone: 'America/Chicago' },
  { id: 'den', name: 'Denver', country: 'United States', zone: 'America/Denver' },
  { id: 'phx', name: 'Phoenix', country: 'United States', zone: 'America/Phoenix' },
  { id: 'lax', name: 'Los Angeles', country: 'United States', zone: 'America/Los_Angeles' },
  { id: 'sfo', name: 'San Francisco', country: 'United States', zone: 'America/Los_Angeles' },
  { id: 'sea', name: 'Seattle', country: 'United States', zone: 'America/Los_Angeles' },
  { id: 'las', name: 'Las Vegas', country: 'United States', zone: 'America/Los_Angeles' },
  { id: 'anc', name: 'Anchorage', country: 'United States', zone: 'America/Anchorage' },
  { id: 'hnl', name: 'Honolulu', country: 'United States', zone: 'Pacific/Honolulu' },
  { id: 'tor', name: 'Toronto', country: 'Canada', zone: 'America/Toronto' },
  { id: 'mtl', name: 'Montreal', country: 'Canada', zone: 'America/Toronto' },
  { id: 'van', name: 'Vancouver', country: 'Canada', zone: 'America/Vancouver' },
  { id: 'cgy', name: 'Calgary', country: 'Canada', zone: 'America/Edmonton' },
  { id: 'mex', name: 'Mexico City', country: 'Mexico', zone: 'America/Mexico_City' },
  { id: 'gdl', name: 'Guadalajara', country: 'Mexico', zone: 'America/Mexico_City' },

  // South America
  { id: 'sao', name: 'São Paulo', country: 'Brazil', zone: 'America/Sao_Paulo' },
  { id: 'rio', name: 'Rio de Janeiro', country: 'Brazil', zone: 'America/Sao_Paulo' },
  { id: 'bue', name: 'Buenos Aires', country: 'Argentina', zone: 'America/Argentina/Buenos_Aires' },
  { id: 'bog', name: 'Bogotá', country: 'Colombia', zone: 'America/Bogota' },
  { id: 'lim_pe', name: 'Lima', country: 'Peru', zone: 'America/Lima' },
  { id: 'scl', name: 'Santiago', country: 'Chile', zone: 'America/Santiago' },
  { id: 'uio', name: 'Quito', country: 'Ecuador', zone: 'America/Guayaquil' },
  { id: 'ccs', name: 'Caracas', country: 'Venezuela', zone: 'America/Caracas' },
  { id: 'mvd', name: 'Montevideo', country: 'Uruguay', zone: 'America/Montevideo' },

  // Middle East & Africa
  { id: 'dxb', name: 'Dubai', country: 'United Arab Emirates', zone: 'Asia/Dubai' },
  { id: 'auh', name: 'Abu Dhabi', country: 'United Arab Emirates', zone: 'Asia/Dubai' },
  { id: 'ruh', name: 'Riyadh', country: 'Saudi Arabia', zone: 'Asia/Riyadh' },
  { id: 'jed', name: 'Jeddah', country: 'Saudi Arabia', zone: 'Asia/Riyadh' },
  { id: 'doh', name: 'Doha', country: 'Qatar', zone: 'Asia/Qatar' },
  { id: 'kwi', name: 'Kuwait City', country: 'Kuwait', zone: 'Asia/Kuwait' },
  { id: 'tlv', name: 'Tel Aviv', country: 'Israel', zone: 'Asia/Jerusalem' },
  { id: 'amm', name: 'Amman', country: 'Jordan', zone: 'Asia/Amman' },
  { id: 'bey', name: 'Beirut', country: 'Lebanon', zone: 'Asia/Beirut' },
  { id: 'cai', name: 'Cairo', country: 'Egypt', zone: 'Africa/Cairo' },
  { id: 'cas', name: 'Casablanca', country: 'Morocco', zone: 'Africa/Casablanca' },
  { id: 'jnb', name: 'Johannesburg', country: 'South Africa', zone: 'Africa/Johannesburg' },
  { id: 'cpt', name: 'Cape Town', country: 'South Africa', zone: 'Africa/Johannesburg' },
  { id: 'nbo', name: 'Nairobi', country: 'Kenya', zone: 'Africa/Nairobi' },
  { id: 'los', name: 'Lagos', country: 'Nigeria', zone: 'Africa/Lagos' },
  { id: 'acc', name: 'Accra', country: 'Ghana', zone: 'Africa/Accra' },
  { id: 'add', name: 'Addis Ababa', country: 'Ethiopia', zone: 'Africa/Addis_Ababa' },

  // Asia & Oceania
  { id: 'del', name: 'New Delhi', country: 'India', zone: 'Asia/Kolkata' },
  { id: 'bom', name: 'Mumbai', country: 'India', zone: 'Asia/Kolkata' },
  { id: 'blr', name: 'Bengaluru', country: 'India', zone: 'Asia/Kolkata' },
  { id: 'hyd', name: 'Hyderabad', country: 'India', zone: 'Asia/Kolkata' },
  { id: 'sin', name: 'Singapore', country: 'Singapore', zone: 'Asia/Singapore' },
  { id: 'kul', name: 'Kuala Lumpur', country: 'Malaysia', zone: 'Asia/Kuala_Lumpur' },
  { id: 'bkk', name: 'Bangkok', country: 'Thailand', zone: 'Asia/Bangkok' },
  { id: 'jkt', name: 'Jakarta', country: 'Indonesia', zone: 'Asia/Jakarta' },
  { id: 'mnl', name: 'Manila', country: 'Philippines', zone: 'Asia/Manila' },
  { id: 'sgn', name: 'Ho Chi Minh City', country: 'Vietnam', zone: 'Asia/Ho_Chi_Minh' },
  { id: 'han', name: 'Hanoi', country: 'Vietnam', zone: 'Asia/Bangkok' },
  { id: 'tyo', name: 'Tokyo', country: 'Japan', zone: 'Asia/Tokyo' },
  { id: 'osa', name: 'Osaka', country: 'Japan', zone: 'Asia/Tokyo' },
  { id: 'sel', name: 'Seoul', country: 'South Korea', zone: 'Asia/Seoul' },
  { id: 'bjs', name: 'Beijing', country: 'China', zone: 'Asia/Shanghai' },
  { id: 'sha', name: 'Shanghai', country: 'China', zone: 'Asia/Shanghai' },
  { id: 'szx', name: 'Shenzhen', country: 'China', zone: 'Asia/Shanghai' },
  { id: 'hkg', name: 'Hong Kong', country: 'Hong Kong', zone: 'Asia/Hong_Kong' },
  { id: 'tpe', name: 'Taipei', country: 'Taiwan', zone: 'Asia/Taipei' },
  { id: 'khi', name: 'Karachi', country: 'Pakistan', zone: 'Asia/Karachi' },
  { id: 'lhr', name: 'Lahore', country: 'Pakistan', zone: 'Asia/Karachi' },
  { id: 'dac', name: 'Dhaka', country: 'Bangladesh', zone: 'Asia/Dhaka' },
  { id: 'cmb', name: 'Colombo', country: 'Sri Lanka', zone: 'Asia/Colombo' },
  { id: 'syd', name: 'Sydney', country: 'Australia', zone: 'Australia/Sydney' },
  { id: 'mel', name: 'Melbourne', country: 'Australia', zone: 'Australia/Melbourne' },
  { id: 'bne', name: 'Brisbane', country: 'Australia', zone: 'Australia/Brisbane' },
  { id: 'per', name: 'Perth', country: 'Australia', zone: 'Australia/Perth' },
  { id: 'akl', name: 'Auckland', country: 'New Zealand', zone: 'Pacific/Auckland' },
  { id: 'wlg', name: 'Wellington', country: 'New Zealand', zone: 'Pacific/Auckland' },
]

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
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>(['nyc', 'lon', 'ber'])
  const [selectedHour, setSelectedHour] = useState<number>(() => new Date().getHours())
  const [copied, setCopied] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [userTz, setUserTz] = useState<string>('UTC')

  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (detected) setUserTz(detected)
    } catch {
      setUserTz('UTC')
    }

    const saved = localStorage.getItem('quicktools_tz_cities')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedCityIds(parsed)
        }
      } catch {
        // Fallback to defaults
      }
    }
  }, [])

  const updateCities = (newCityIds: string[]) => {
    setSelectedCityIds(newCityIds)
    try {
      localStorage.setItem('quicktools_tz_cities', JSON.stringify(newCityIds))
    } catch {
      // Ignore storage errors
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

  const activeCities = useMemo(() => {
    return selectedCityIds
      .map((id) => ALL_CITIES.find((c) => c.id === id))
      .filter((c): c is CityZone => Boolean(c))
  }, [selectedCityIds])

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
      return `• ${c.name}: ${timeStr}`
    })

    const textToCopy = `Proposed Meeting Window:\n${lines.join('\n')}\n\nCoordinated with QuickTools Timezone Planner`
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
    return ALL_CITIES.filter(
      (c) =>
        !selectedCityIds.includes(c.id) &&
        (c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
    )
  }, [searchQuery, selectedCityIds])

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
              Compare global working hours side-by-side. 100% calculated client-side in your browser.
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

        {/* Add Cities Search Bar */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Add Another Region / Time Zone
            </label>
            <span className="text-[11px] text-zinc-500">
              {ALL_CITIES.length} cities available
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search cities or countries (e.g. Rome, Milan, Italy, Zurich, Tokyo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          {searchQuery.trim() !== '' && (
            <div className="max-h-56 overflow-y-auto border border-zinc-800 rounded-lg bg-zinc-950 divide-y divide-zinc-800/60 shadow-xl">
              {filteredSearch.length === 0 ? (
                <div className="p-4 text-xs text-zinc-500 text-center">
                  No matching cities found for &quot;{searchQuery}&quot;
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

      {/* Guide, FAQs, and Ad Placement */}
      <ToolGuide slug="timezone-planner" />
    </main>
  )
}