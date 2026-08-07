export type Placement = 'first' | 'second' | 'third'
export type RankTier =
  | 'wood'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'mithril'
  | 'diamond'
  | 'max'

export interface ChestSegment {
  id: string
  division: string
  segmentIndex: number
  pips: number
  tickets: number
}

export interface PipInputs {
  /** Index into CHEST_SEGMENTS for the chest the player is currently on */
  startingSegmentIndex: number
  placement: Placement
  rank: RankTier
  commitment: boolean
  commander: boolean
  publicCommander: boolean
}

export interface PipResults {
  pipsPerTick: number
  remainingPips: number
  remainingTickets: number
  finishedPips: number
  earnedTickets: number
  totalPips: number
  totalTickets: number
  pipPercent: number
  ticketPercent: number
  ticksRemaining: number
  hoursRemaining: number
  minutesRemaining: number
}

export const TOTAL_PIPS = 1450
export const TOTAL_TICKETS = 365
export const TICK_MINUTES = 5

export const CHEST_SEGMENTS: ChestSegment[] = [
  { id: 'wood-0', division: 'Wood', segmentIndex: 0, pips: 25, tickets: 3 },
  { id: 'wood-1', division: 'Wood', segmentIndex: 1, pips: 25, tickets: 3 },
  { id: 'wood-2', division: 'Wood', segmentIndex: 2, pips: 25, tickets: 3 },
  { id: 'wood-3', division: 'Wood', segmentIndex: 3, pips: 25, tickets: 8 },
  { id: 'bronze-0', division: 'Bronze', segmentIndex: 0, pips: 30, tickets: 5 },
  { id: 'bronze-1', division: 'Bronze', segmentIndex: 1, pips: 30, tickets: 5 },
  { id: 'bronze-2', division: 'Bronze', segmentIndex: 2, pips: 30, tickets: 5 },
  { id: 'bronze-3', division: 'Bronze', segmentIndex: 3, pips: 30, tickets: 10 },
  { id: 'silver-0', division: 'Silver', segmentIndex: 0, pips: 35, tickets: 7 },
  { id: 'silver-1', division: 'Silver', segmentIndex: 1, pips: 35, tickets: 7 },
  { id: 'silver-2', division: 'Silver', segmentIndex: 2, pips: 35, tickets: 7 },
  { id: 'silver-3', division: 'Silver', segmentIndex: 3, pips: 35, tickets: 7 },
  { id: 'silver-4', division: 'Silver', segmentIndex: 4, pips: 35, tickets: 12 },
  { id: 'gold-0', division: 'Gold', segmentIndex: 0, pips: 40, tickets: 9 },
  { id: 'gold-1', division: 'Gold', segmentIndex: 1, pips: 40, tickets: 9 },
  { id: 'gold-2', division: 'Gold', segmentIndex: 2, pips: 40, tickets: 9 },
  { id: 'gold-3', division: 'Gold', segmentIndex: 3, pips: 40, tickets: 9 },
  { id: 'gold-4', division: 'Gold', segmentIndex: 4, pips: 40, tickets: 14 },
  { id: 'platinum-0', division: 'Platinum', segmentIndex: 0, pips: 45, tickets: 11 },
  { id: 'platinum-1', division: 'Platinum', segmentIndex: 1, pips: 45, tickets: 11 },
  { id: 'platinum-2', division: 'Platinum', segmentIndex: 2, pips: 45, tickets: 11 },
  { id: 'platinum-3', division: 'Platinum', segmentIndex: 3, pips: 45, tickets: 11 },
  { id: 'platinum-4', division: 'Platinum', segmentIndex: 4, pips: 45, tickets: 16 },
  { id: 'mithril-0', division: 'Mithril', segmentIndex: 0, pips: 50, tickets: 13 },
  { id: 'mithril-1', division: 'Mithril', segmentIndex: 1, pips: 50, tickets: 13 },
  { id: 'mithril-2', division: 'Mithril', segmentIndex: 2, pips: 50, tickets: 13 },
  { id: 'mithril-3', division: 'Mithril', segmentIndex: 3, pips: 50, tickets: 13 },
  { id: 'mithril-4', division: 'Mithril', segmentIndex: 4, pips: 50, tickets: 13 },
  { id: 'mithril-5', division: 'Mithril', segmentIndex: 5, pips: 50, tickets: 18 },
  { id: 'diamond-0', division: 'Diamond', segmentIndex: 0, pips: 55, tickets: 14 },
  { id: 'diamond-1', division: 'Diamond', segmentIndex: 1, pips: 55, tickets: 14 },
  { id: 'diamond-2', division: 'Diamond', segmentIndex: 2, pips: 55, tickets: 14 },
  { id: 'diamond-3', division: 'Diamond', segmentIndex: 3, pips: 55, tickets: 14 },
  { id: 'diamond-4', division: 'Diamond', segmentIndex: 4, pips: 55, tickets: 14 },
  { id: 'diamond-5', division: 'Diamond', segmentIndex: 5, pips: 55, tickets: 20 },
]

export const DIVISIONS = [
  'Wood',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Mithril',
  'Diamond',
] as const

export const RANK_OPTIONS: { id: RankTier; label: string; min: number; max: number; pips: number }[] =
  [
    { id: 'wood', label: 'Rank 1–149 (Wood)', min: 1, max: 149, pips: 1 },
    { id: 'bronze', label: 'Rank 150–619 (Bronze)', min: 150, max: 619, pips: 2 },
    { id: 'silver', label: 'Rank 620–1394 (Silver)', min: 620, max: 1394, pips: 3 },
    { id: 'gold', label: 'Rank 1395–2544 (Gold)', min: 1395, max: 2544, pips: 4 },
    { id: 'platinum', label: 'Rank 2545–4094 (Platinum)', min: 2545, max: 4094, pips: 5 },
    { id: 'mithril', label: 'Rank 4095–6444 (Mithril)', min: 4095, max: 6444, pips: 6 },
    { id: 'diamond', label: 'Rank 6445–9999 (Diamond)', min: 6445, max: 9999, pips: 7 },
    { id: 'max', label: 'Rank 10000 (Max)', min: 10000, max: 10000, pips: 8 },
  ]

export const PLACEMENT_PIPS: Record<Placement, number> = {
  first: 6,
  second: 5,
  third: 4,
}

export function rankTierFromWvWRank(rank: number): RankTier {
  if (rank >= 10000) return 'max'
  if (rank >= 6445) return 'diamond'
  if (rank >= 4095) return 'mithril'
  if (rank >= 2545) return 'platinum'
  if (rank >= 1395) return 'gold'
  if (rank >= 620) return 'silver'
  if (rank >= 150) return 'bronze'
  return 'wood'
}

export function calcPipsPerTick(input: Omit<PipInputs, 'startingSegmentIndex'>): number {
  let ppt = PLACEMENT_PIPS[input.placement]
  ppt += RANK_OPTIONS.find((r) => r.id === input.rank)?.pips ?? 1
  if (input.commitment) ppt += 1
  if (input.commander) ppt += 1
  if (input.publicCommander) ppt += 3
  return ppt
}

export function calcRemaining(startingSegmentIndex: number): {
  remainingPips: number
  remainingTickets: number
} {
  const remaining = CHEST_SEGMENTS.slice(Math.max(0, startingSegmentIndex))
  return {
    remainingPips: remaining.reduce((sum, s) => sum + s.pips, 0),
    remainingTickets: remaining.reduce((sum, s) => sum + s.tickets, 0),
  }
}

export function calcResults(input: PipInputs): PipResults {
  const pipsPerTick = calcPipsPerTick(input)
  const { remainingPips, remainingTickets } = calcRemaining(input.startingSegmentIndex)
  const finishedPips = TOTAL_PIPS - remainingPips
  const earnedTickets = TOTAL_TICKETS - remainingTickets
  const ticksRemaining = remainingPips === 0 ? 0 : Math.ceil(remainingPips / pipsPerTick)
  const totalMinutes = ticksRemaining * TICK_MINUTES

  return {
    pipsPerTick,
    remainingPips,
    remainingTickets,
    finishedPips,
    earnedTickets,
    totalPips: TOTAL_PIPS,
    totalTickets: TOTAL_TICKETS,
    pipPercent: Math.round((finishedPips / TOTAL_PIPS) * 100),
    ticketPercent: Math.round((earnedTickets / TOTAL_TICKETS) * 100),
    ticksRemaining,
    hoursRemaining: Math.floor(totalMinutes / 60),
    minutesRemaining: totalMinutes % 60,
  }
}

export function segmentsByDivision(): Map<string, ChestSegment[]> {
  const map = new Map<string, ChestSegment[]>()
  for (const seg of CHEST_SEGMENTS) {
    const list = map.get(seg.division) ?? []
    list.push(seg)
    map.set(seg.division, list)
  }
  return map
}
