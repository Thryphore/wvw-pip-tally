import { rankTierFromWvWRank, type Placement, type RankTier } from './pips'

const API = 'https://api.guildwars2.com/v2'
const ACCOUNT_SCHEMA = '2024-07-20T01:00:00.000Z'

export type Gw2ApiErrorCode = 'empty_key' | 'invalid_key' | 'http_error' | 'no_rank'

export class Gw2ApiError extends Error {
  readonly code: Gw2ApiErrorCode
  readonly status?: number
  readonly detail?: string

  constructor(code: Gw2ApiErrorCode, options?: { status?: number; detail?: string }) {
    super(code)
    this.name = 'Gw2ApiError'
    this.code = code
    this.status = options?.status
    this.detail = options?.detail
  }
}

export interface ApiAutofill {
  accountName: string
  wvwRank: number
  rankTier: RankTier
  teamId: number | null
  worldId: number | null
  worldName: string | null
  placement: Placement | null
  skirmishScores: { red: number; blue: number; green: number } | null
  playerColor: 'red' | 'blue' | 'green' | null
  matchId: string | null
  skirmishId: number | null
}

type TeamColor = 'red' | 'blue' | 'green'

interface AccountResponse {
  name: string
  world: number
  wvw?: {
    team_id?: number
    rank?: number
  }
  wvw_rank?: number
}

interface MatchResponse {
  id: string
  worlds?: Record<TeamColor, number>
  all_worlds?: Record<TeamColor, number[]>
  skirmishes?: Array<{
    id: number
    scores: Record<TeamColor, number>
  }>
}

async function apiGet<T>(path: string, token?: string): Promise<T> {
  const url = new URL(`${API}${path}`)
  if (token) url.searchParams.set('access_token', token)
  const res = await fetch(url.toString())
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    if (res.status === 401 || res.status === 403) {
      throw new Gw2ApiError('invalid_key')
    }
    throw new Gw2ApiError('http_error', {
      status: res.status,
      detail: body || res.statusText,
    })
  }
  return res.json() as Promise<T>
}

function colorForId(match: MatchResponse, id: number): TeamColor | null {
  for (const color of ['red', 'blue', 'green'] as TeamColor[]) {
    const all = match.all_worlds?.[color] ?? []
    const primary = match.worlds?.[color]
    if (all.includes(id) || primary === id) return color
  }
  return null
}

/**
 * Prefer current WvW team_id. Legacy account.world can sit on a different
 * linked side after world restructuring and must not override the team.
 */
function findPlayerColor(
  match: MatchResponse,
  teamId: number | null,
  worldId: number,
): TeamColor | null {
  if (teamId != null) {
    const byTeam = colorForId(match, teamId)
    if (byTeam) return byTeam
  }
  return colorForId(match, worldId)
}

function placementFromScores(
  scores: Record<TeamColor, number>,
  playerColor: TeamColor,
): Placement {
  const ordered = (['red', 'blue', 'green'] as TeamColor[])
    .map((color) => ({ color, score: scores[color] ?? 0 }))
    .sort((a, b) => b.score - a.score || a.color.localeCompare(b.color))

  const index = ordered.findIndex((s) => s.color === playerColor)
  if (index === 0) return 'first'
  if (index === 1) return 'second'
  return 'third'
}

export async function fetchAutofillFromApiKey(apiKey: string): Promise<ApiAutofill> {
  const key = apiKey.trim()
  if (!key) throw new Gw2ApiError('empty_key')

  const account = await apiGet<AccountResponse>(
    `/account?v=${encodeURIComponent(ACCOUNT_SCHEMA)}`,
    key,
  )

  const wvwRank = account.wvw?.rank ?? account.wvw_rank
  if (typeof wvwRank !== 'number') {
    throw new Gw2ApiError('no_rank')
  }

  let teamId = account.wvw?.team_id ?? null
  try {
    const accountWvw = await apiGet<{ team: number }>(`/account/wvw`, key)
    if (typeof accountWvw.team === 'number') teamId = accountWvw.team
  } catch {
    // /account/wvw needs the wvw permission; team_id on /account may still exist
  }

  const worldId = account.world
  let worldName: string | null = null
  try {
    const world = await apiGet<{ name: string }>(`/worlds/${worldId}`)
    worldName = world.name
  } catch {
    worldName = null
  }

  // Resolve match by team first (restructuring), then legacy world.
  let match: MatchResponse | null = null
  const lookupIds = [teamId, worldId].filter((n): n is number => typeof n === 'number')
  for (const id of lookupIds) {
    try {
      match = await apiGet<MatchResponse>(`/wvw/matches?world=${id}`)
      break
    } catch {
      // try next id
    }
  }

  let placement: Placement | null = null
  let skirmishScores: ApiAutofill['skirmishScores'] = null
  let playerColor: TeamColor | null = null
  let matchId: string | null = null
  let skirmishId: number | null = null

  if (match) {
    matchId = match.id
    playerColor = findPlayerColor(match, teamId, worldId)

    // Only current skirmish war score matters for pips — never weekly totals.
    const currentSkirmish = match.skirmishes?.length
      ? match.skirmishes[match.skirmishes.length - 1]
      : null

    if (currentSkirmish?.scores && playerColor) {
      skirmishId = currentSkirmish.id
      skirmishScores = {
        red: currentSkirmish.scores.red ?? 0,
        blue: currentSkirmish.scores.blue ?? 0,
        green: currentSkirmish.scores.green ?? 0,
      }
      placement = placementFromScores(currentSkirmish.scores, playerColor)
    }
  }

  return {
    accountName: account.name,
    wvwRank,
    rankTier: rankTierFromWvWRank(wvwRank),
    teamId,
    worldId,
    worldName,
    placement,
    skirmishScores,
    playerColor,
    matchId,
    skirmishId,
  }
}
