import { useEffect, useMemo, useState } from 'react'
import { fetchAutofillFromApiKey, type ApiAutofill } from './lib/gw2Api'
import {
  PLACEMENT_PIPS,
  RANK_OPTIONS,
  calcResults,
  type Placement,
  type RankTier,
} from './lib/pips'
import { loadSettings, saveSettings } from './lib/storage'
import { RewardTrack } from './components/RewardTrack'
import './App.css'

const PLACEMENTS = [
  ['first', '1st', 6],
  ['second', '2nd', 5],
  ['third', '3rd', 4],
] as const

export default function App() {
  const initial = useMemo(() => loadSettings(), [])

  const [apiKey, setApiKey] = useState(initial.apiKey)
  const [startingSegmentIndex, setStartingSegmentIndex] = useState(initial.startingSegmentIndex)
  const [placement, setPlacement] = useState<Placement>(initial.placement)
  const [rank, setRank] = useState<RankTier>(initial.rank)
  const [commitment, setCommitment] = useState(initial.commitment)
  const [commander, setCommander] = useState(initial.commander)
  const [publicCommander, setPublicCommander] = useState(initial.publicCommander)

  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [apiInfo, setApiInfo] = useState<ApiAutofill | null>(null)
  const [showKey, setShowKey] = useState(false)

  const results = useMemo(
    () =>
      calcResults({
        startingSegmentIndex,
        placement,
        rank,
        commitment,
        commander,
        publicCommander,
      }),
    [startingSegmentIndex, placement, rank, commitment, commander, publicCommander],
  )

  useEffect(() => {
    saveSettings({
      apiKey,
      startingSegmentIndex,
      placement,
      rank,
      commitment,
      commander,
      publicCommander,
    })
  }, [apiKey, startingSegmentIndex, placement, rank, commitment, commander, publicCommander])

  async function handleApiFetch() {
    setApiLoading(true)
    setApiError(null)
    try {
      const data = await fetchAutofillFromApiKey(apiKey)
      setApiInfo(data)
      setRank(data.rankTier)
      if (data.placement) setPlacement(data.placement)
    } catch (err) {
      setApiInfo(null)
      setApiError(err instanceof Error ? err.message : 'Failed to fetch from API.')
    } finally {
      setApiLoading(false)
    }
  }

  const bonusPips =
    (commitment ? 1 : 0) + (commander ? 1 : 0) + (publicCommander ? 3 : 0)

  const breakdown = [
    { label: 'Placement', value: PLACEMENT_PIPS[placement] },
    { label: 'Rank', value: RANK_OPTIONS.find((r) => r.id === rank)?.pips ?? 0 },
    { label: 'Bonus', value: bonusPips },
  ]

  return (
    <div className="app">
      <div className="bg" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-block">
          <h1 className="brand">WvW Pip Tally</h1>
          <p className="tag">Match Rewards Calculator</p>
        </div>
      </header>

      <section className="track-block" aria-label="Reward track">
        <RewardTrack
          startingSegmentIndex={startingSegmentIndex}
          onSelect={setStartingSegmentIndex}
        />
      </section>

      <section className="api-section">
        <div className="block-head">
          <h2>API key</h2>
          <a
            className="meta api-link"
            href="https://gw2timer.com/out/?u=https://account.arena.net/applications"
            target="_blank"
            rel="noreferrer"
          >
            Get an API key
          </a>
        </div>
        <div className="api-bar">
          <label className="sr-only" htmlFor="api-key">
            Guild Wars 2 API key
          </label>
          <input
            id="api-key"
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API key here"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="ghost" onClick={() => setShowKey((v) => !v)}>
            {showKey ? 'Hide' : 'Show'}
          </button>
          <button type="button" className="primary" onClick={handleApiFetch} disabled={apiLoading}>
            {apiLoading ? '…' : 'Pull'}
          </button>
        </div>
        {(apiError || apiInfo) && (
          <div
            className={`banner ${apiError ? 'is-error' : 'is-ok'}`}
            role={apiError ? 'alert' : 'status'}
          >
            {apiError ?? (
              <>
                <strong>{apiInfo!.accountName}</strong>
                {apiInfo!.worldName ? ` · ${apiInfo!.worldName}` : ''}
                {` · rank ${apiInfo!.wvwRank}`}
                {apiInfo!.placement
                  ? ` · ${apiInfo!.placement} in current skirmish`
                  : ' · placement unavailable'}
                {apiInfo!.playerColor ? ` (${apiInfo!.playerColor}` : ''}
                {apiInfo!.skirmishScores && apiInfo!.playerColor
                  ? ` ${apiInfo!.skirmishScores[apiInfo!.playerColor]} war score)`
                  : apiInfo!.playerColor
                    ? ')'
                    : ''}
              </>
            )}
          </div>
        )}
      </section>

      <main className="shell">
        <div className="inputs">
          <section className="section">
            <div className="block-head">
              <h2>Placement</h2>
            </div>
            <div className="seg-control" role="radiogroup" aria-label="World placement">
              {PLACEMENTS.map(([id, label, pips]) => (
                <label
                  key={id}
                  className={`place-${id}${placement === id ? ' active' : ''}`}
                >
                  <input
                    type="radio"
                    name="placement"
                    checked={placement === id}
                    onChange={() => setPlacement(id)}
                  />
                  <span>{label}</span>
                  <em>+{pips}</em>
                </label>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="block-head">
              <h2>Rank</h2>
            </div>
            <div className="chip-grid" role="radiogroup" aria-label="Personal rank">
              {RANK_OPTIONS.map((opt) => (
                <label key={opt.id} className={`chip ${rank === opt.id ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="rank"
                    checked={rank === opt.id}
                    onChange={() => setRank(opt.id)}
                  />
                  <span className="chip-name">{opt.id === 'max' ? 'Max' : opt.id}</span>
                  <span className="chip-range">
                    {opt.min === opt.max ? `Lv ${opt.max}` : `Lv ${opt.min}–${opt.max}`}
                  </span>
                  <em>+{opt.pips}</em>
                </label>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="block-head">
              <h2>Bonuses</h2>
            </div>
            <div className="toggle-row">
              <label className={`toggle ${commitment ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={commitment}
                  onChange={(e) => setCommitment(e.target.checked)}
                />
                <span>Commitment</span>
                <em>+1</em>
              </label>
              <label className={`toggle ${commander ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={commander}
                  onChange={(e) => setCommander(e.target.checked)}
                />
                <span>Commander</span>
                <em>+1</em>
              </label>
              <label className={`toggle ${publicCommander ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={publicCommander}
                  onChange={(e) => setPublicCommander(e.target.checked)}
                />
                <span>Public cmd</span>
                <em>+3</em>
              </label>
            </div>
          </section>
        </div>

        <aside className="results" aria-labelledby="results-heading">
          <div className="results-sticky">
            <div className="block-head">
              <h2 id="results-heading">Results</h2>
            </div>

            <div className="kpi-grid">
              <div className="kpi accent">
                <span>Time left</span>
                <strong>
                  {results.hoursRemaining}
                  <small>h</small>
                  {results.minutesRemaining}
                  <small>m</small>
                </strong>
              </div>
              <div className="kpi">
                <span>Pips / tick</span>
                <strong>{results.pipsPerTick}</strong>
              </div>
              <div className="kpi">
                <span>Tickets left</span>
                <strong>{results.remainingTickets}</strong>
              </div>
              <div className="kpi">
                <span>Pips left</span>
                <strong>{results.remainingPips}</strong>
              </div>
            </div>

            <div className="meters">
              <div className="meter">
                <div className="meter-head">
                  <span>Pips</span>
                  <span>
                    {results.finishedPips}/{results.totalPips} · {results.pipPercent}%
                  </span>
                </div>
                <div className="bar">
                  <div className="fill" style={{ width: `${results.pipPercent}%` }} />
                </div>
              </div>
              <div className="meter">
                <div className="meter-head">
                  <span>Tickets</span>
                  <span>
                    {results.earnedTickets}/{results.totalTickets} · {results.ticketPercent}%
                  </span>
                </div>
                <div className="bar">
                  <div className="fill tickets" style={{ width: `${results.ticketPercent}%` }} />
                </div>
              </div>
            </div>

            <ul className="breakdown">
              {breakdown.map((row) => (
                <li key={row.label}>
                  <span>{row.label}</span>
                  <span className={row.value ? '' : 'zero'}>+{row.value}</span>
                </li>
              ))}
              <li className="total">
                <span>Total / tick</span>
                <span>{results.pipsPerTick}</span>
              </li>
            </ul>

            <p className="footnote">
              Assumes Tier 3+ participation every 5 minutes. Full track is 1450 pips (365 tickets)
              and resets with weekly WvW reset.
            </p>
          </div>
        </aside>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <strong>WvW Pip Tally</strong>
            <span>Not affiliated with ArenaNet</span>
          </div>
          <div className="footer-links">
            <div className="footer-chip">
              <span className="footer-label">Made by</span>
              <span className="footer-value">navi.5047</span>
            </div>
            <a
              className="footer-kofi"
              href="https://ko-fi.com/jacobwittig"
              target="_blank"
              rel="noreferrer"
            >
              Support on Ko-fi
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
