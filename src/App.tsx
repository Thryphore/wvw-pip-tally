import { useEffect, useMemo, useState } from 'react'
import { fetchAutofillFromApiKey, Gw2ApiError, type ApiAutofill } from './lib/gw2Api'
import {
  PLACEMENT_PIPS,
  RANK_OPTIONS,
  calcResults,
  type Placement,
  type RankTier,
} from './lib/pips'
import { loadSettings, saveSettings } from './lib/storage'
import { RewardTrack } from './components/RewardTrack'
import { useLocale } from './i18n/locale'
import { LOCALES, type Locale, type MessageKey } from './i18n/messages'
import './App.css'

const PLACEMENT_IDS = ['first', 'second', 'third'] as const

export default function App() {
  const { locale, setLocale, t } = useLocale()
  const initial = useMemo(() => loadSettings(), [])

  const [apiKey, setApiKey] = useState(initial.apiKey)
  const [startingSegmentIndex, setStartingSegmentIndex] = useState(initial.startingSegmentIndex)
  const [placement, setPlacement] = useState<Placement>(initial.placement)
  const [rank, setRank] = useState<RankTier>(initial.rank)
  const [commitment, setCommitment] = useState(initial.commitment)
  const [commander, setCommander] = useState(initial.commander)
  const [publicCommander, setPublicCommander] = useState(initial.publicCommander)

  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState<Gw2ApiError | 'unknown' | null>(null)
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
      locale,
    })
  }, [
    apiKey,
    startingSegmentIndex,
    placement,
    rank,
    commitment,
    commander,
    publicCommander,
    locale,
  ])

  function formatApiError(err: Gw2ApiError | 'unknown'): string {
    if (err === 'unknown') return t('api.fetchFailed')
    switch (err.code) {
      case 'empty_key':
        return t('api.error.emptyKey')
      case 'invalid_key':
        return t('api.error.invalidKey')
      case 'no_rank':
        return t('api.error.noRank')
      case 'http_error':
        return t('api.error.http', {
          status: err.status ?? '?',
          detail: err.detail || '',
        })
    }
  }

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
      setApiError(err instanceof Gw2ApiError ? err : 'unknown')
    } finally {
      setApiLoading(false)
    }
  }

  const bonusPips =
    (commitment ? 1 : 0) + (commander ? 1 : 0) + (publicCommander ? 3 : 0)

  const breakdown = [
    { key: 'placement' as const, label: t('results.breakdown.placement'), value: PLACEMENT_PIPS[placement] },
    {
      key: 'rank' as const,
      label: t('results.breakdown.rank'),
      value: RANK_OPTIONS.find((r) => r.id === rank)?.pips ?? 0,
    },
    { key: 'bonus' as const, label: t('results.breakdown.bonus'), value: bonusPips },
  ]

  const placementLabel = (id: Placement) => t(`placement.${id}` as MessageKey)

  return (
    <div className="app">
      <div className="bg" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-block">
          <div className="brand-row">
            <h1 className="brand">WvW Pip Tally</h1>
            <p className="tag">{t('tagline')}</p>
          </div>
          <p className="blurb">{t('blurb')}</p>
        </div>
        <div className="lang-switch" role="group" aria-label={t('lang.label')}>
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              className={`lang-btn${locale === code ? ' active' : ''}`}
              aria-pressed={locale === code}
              onClick={() => setLocale(code as Locale)}
            >
              {t(`lang.${code}` as MessageKey)}
            </button>
          ))}
        </div>
      </header>

      <section className="track-block" aria-label={t('rewardTrack.aria')}>
        <RewardTrack
          startingSegmentIndex={startingSegmentIndex}
          onSelect={setStartingSegmentIndex}
        />
      </section>

      <section className="api-section">
        <div className="block-head">
          <h2>{t('api.title')}</h2>
          <a
            className="meta api-link"
            href="https://gw2timer.com/out/?u=https://account.arena.net/applications"
            target="_blank"
            rel="noreferrer"
          >
            {t('api.getKey')}
          </a>
        </div>
        <div className="api-bar">
          <label className="sr-only" htmlFor="api-key">
            {t('api.label')}
          </label>
          <input
            id="api-key"
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={t('api.placeholder')}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="ghost" onClick={() => setShowKey((v) => !v)}>
            {showKey ? t('api.hide') : t('api.show')}
          </button>
          <button type="button" className="primary" onClick={handleApiFetch} disabled={apiLoading}>
            {apiLoading ? '…' : t('api.pull')}
          </button>
        </div>
        {(apiError || apiInfo) && (
          <div
            className={`banner ${apiError ? 'is-error' : 'is-ok'}`}
            role={apiError ? 'alert' : 'status'}
          >
            {apiError ? (
              formatApiError(apiError)
            ) : (
              <>
                <strong>{apiInfo!.accountName}</strong>
                {apiInfo!.worldName ? ` · ${apiInfo!.worldName}` : ''}
                {` · ${t('api.rank', { rank: apiInfo!.wvwRank })}`}
                {apiInfo!.placement
                  ? ` · ${t('api.placement', { placement: placementLabel(apiInfo!.placement) })}`
                  : ` · ${t('api.placementUnavailable')}`}
                {apiInfo!.playerColor ? ` (${apiInfo!.playerColor}` : ''}
                {apiInfo!.skirmishScores && apiInfo!.playerColor
                  ? ` ${t('api.warScore', { score: apiInfo!.skirmishScores[apiInfo!.playerColor] })})`
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
              <h2>{t('placement.title')}</h2>
            </div>
            <div className="seg-control" role="radiogroup" aria-label={t('placement.aria')}>
              {PLACEMENT_IDS.map((id) => (
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
                  <span>{placementLabel(id)}</span>
                  <em>+{PLACEMENT_PIPS[id]}</em>
                </label>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="block-head">
              <h2>{t('rank.title')}</h2>
            </div>
            <div className="chip-grid" role="radiogroup" aria-label={t('rank.aria')}>
              {RANK_OPTIONS.map((opt) => (
                <label key={opt.id} className={`chip ${rank === opt.id ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="rank"
                    checked={rank === opt.id}
                    onChange={() => setRank(opt.id)}
                  />
                  <span className="chip-name">
                    {opt.id === 'max' ? t('rank.max') : opt.id}
                  </span>
                  <span className="chip-range">
                    {opt.min === opt.max
                      ? t('rank.level', { level: opt.max })
                      : t('rank.levelRange', { min: opt.min, max: opt.max })}
                  </span>
                  <em>+{opt.pips}</em>
                </label>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="block-head">
              <h2>{t('bonuses.title')}</h2>
            </div>
            <div className="toggle-row">
              <label className={`toggle ${commitment ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={commitment}
                  onChange={(e) => setCommitment(e.target.checked)}
                />
                <span>{t('bonuses.commitment')}</span>
                <em>+1</em>
              </label>
              <label className={`toggle ${commander ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={commander}
                  onChange={(e) => setCommander(e.target.checked)}
                />
                <span>{t('bonuses.commander')}</span>
                <em>+1</em>
              </label>
              <label className={`toggle ${publicCommander ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={publicCommander}
                  onChange={(e) => setPublicCommander(e.target.checked)}
                />
                <span>{t('bonuses.publicCmd')}</span>
                <em>+3</em>
              </label>
            </div>
          </section>
        </div>

        <aside className="results" aria-labelledby="results-heading">
          <div className="results-sticky">
            <div className="block-head">
              <h2 id="results-heading">{t('results.title')}</h2>
            </div>

            <div className="kpi-grid">
              <div className="kpi accent">
                <span>{t('results.timeLeft')}</span>
                <strong>
                  {results.hoursRemaining}
                  <small>{t('results.hours')}</small>
                  {results.minutesRemaining}
                  <small>{t('results.minutes')}</small>
                </strong>
              </div>
              <div className="kpi">
                <span>{t('results.pipsPerTick')}</span>
                <strong>{results.pipsPerTick}</strong>
              </div>
              <div className="kpi">
                <span>{t('results.ticketsLeft')}</span>
                <strong>{results.remainingTickets}</strong>
              </div>
              <div className="kpi">
                <span>{t('results.pipsLeft')}</span>
                <strong>{results.remainingPips}</strong>
              </div>
            </div>

            <div className="meters">
              <div className="meter">
                <div className="meter-head">
                  <span>{t('results.pips')}</span>
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
                  <span>{t('results.tickets')}</span>
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
                <li key={row.key}>
                  <span>{row.label}</span>
                  <span className={row.value ? '' : 'zero'}>+{row.value}</span>
                </li>
              ))}
              <li className="total">
                <span>{t('results.totalPerTick')}</span>
                <span>{results.pipsPerTick}</span>
              </li>
            </ul>

            <p className="footnote">{t('results.footnote')}</p>
          </div>
        </aside>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <strong>WvW Pip Tally</strong>
            <span>{t('footer.disclaimer')}</span>
          </div>
          <div className="footer-links">
            <div className="footer-chip">
              <span className="footer-label">{t('footer.madeBy')}</span>
              <span className="footer-value">navi.5047</span>
            </div>
            <a
              className="footer-kofi"
              href="https://ko-fi.com/jacobwittig"
              target="_blank"
              rel="noreferrer"
            >
              {t('footer.kofi')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
