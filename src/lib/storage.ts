import type { Placement, RankTier } from './pips'

const STORAGE_KEY = 'wvw-pip-tally'

export interface StoredSettings {
  apiKey: string
  startingSegmentIndex: number
  placement: Placement
  rank: RankTier
  commitment: boolean
  commander: boolean
  publicCommander: boolean
}

const DEFAULTS: StoredSettings = {
  apiKey: '',
  startingSegmentIndex: 0,
  placement: 'third',
  rank: 'wood',
  commitment: true,
  commander: false,
  publicCommander: false,
}

export function loadSettings(): StoredSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULTS }
    const parsed = JSON.parse(raw) as Partial<StoredSettings>
    return { ...DEFAULTS, ...parsed }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveSettings(settings: StoredSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
