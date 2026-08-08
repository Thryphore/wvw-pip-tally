import { useEffect, useRef } from 'react'
import {
  CHEST_SEGMENTS,
  DIVISIONS,
  segmentsByDivision,
  type ChestSegment,
} from '../lib/pips'
import { useLocale } from '../i18n/locale'
import type { MessageKey } from '../i18n/messages'
import { ChestIcon, type Tier } from './ChestIcon'
import './RewardTrack.css'

const divisionMap = segmentsByDivision()
const CHEST_INDEX = Object.fromEntries(CHEST_SEGMENTS.map((seg, i) => [seg.id, i]))

interface RewardTrackProps {
  startingSegmentIndex: number
  onSelect: (index: number) => void
}

function Pip({
  state,
  onClick,
  label,
}: {
  state: 'done' | 'active' | 'locked'
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      className={`pip pip-${state}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={state === 'active'}
      title={label}
    >
      {state === 'done' ? (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="7" fill="currentColor" />
          <path
            d="M4.5 8.2l2.2 2.2 4.8-5"
            fill="none"
            stroke="#1a1410"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : state === 'active' ? (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      )}
    </button>
  )
}

function statusForDivision(
  segs: ChestSegment[],
  startingSegmentIndex: number,
  t: (key: MessageKey, vars?: Record<string, string | number>) => string,
): { kind: 'completed' | 'active' | 'locked'; text: string } {
  const indices = segs.map((s) => CHEST_INDEX[s.id])
  const first = indices[0]
  const last = indices[indices.length - 1]

  if (startingSegmentIndex > last) {
    return { kind: 'completed', text: t('track.completed') }
  }
  if (startingSegmentIndex < first) {
    return { kind: 'locked', text: t('track.locked') }
  }
  const rewardNum = startingSegmentIndex - first + 1
  return {
    kind: 'active',
    text: t('track.next', { current: rewardNum, total: segs.length }),
  }
}

function divisionLabel(
  division: string,
  t: (key: MessageKey, vars?: Record<string, string | number>) => string,
): string {
  const key = `division.${division}` as MessageKey
  return t(key)
}

export function RewardTrack({ startingSegmentIndex, onSelect }: RewardTrackProps) {
  const { t } = useLocale()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [startingSegmentIndex])

  return (
    <div className="reward-track">
      <div className="reward-track-scroll" ref={scrollerRef} role="list">
        {DIVISIONS.map((division) => {
          const segs = divisionMap.get(division) ?? []
          const status = statusForDivision(segs, startingSegmentIndex, t)
          const isComplete = status.kind === 'completed'
          const name = divisionLabel(division, t)

          return (
            <article
              key={division}
              className={`tier-card tier-${status.kind}`}
              role="listitem"
              ref={status.kind === 'active' ? (el) => { activeRef.current = el } : undefined}
            >
              <h3 className="tier-name">{name}</h3>
              <p className={`tier-status status-${status.kind}`}>{status.text}</p>

              <div className="tier-pips" role="group" aria-label={t('track.rewardsAria', { division: name })}>
                {segs.map((seg) => {
                  const idx = CHEST_INDEX[seg.id]
                  const state =
                    idx < startingSegmentIndex
                      ? 'done'
                      : idx === startingSegmentIndex
                        ? 'active'
                        : 'locked'
                  return (
                    <Pip
                      key={seg.id}
                      state={state}
                      onClick={() => onSelect(idx)}
                      label={t('track.pipLabel', {
                        division: name,
                        n: seg.segmentIndex + 1,
                        pips: seg.pips,
                        tickets: seg.tickets,
                      })}
                    />
                  )
                })}
              </div>

              <button
                type="button"
                className="tier-chest-btn"
                onClick={() => {
                  const firstIdx = CHEST_INDEX[segs[0].id]
                  const lastIdx = CHEST_INDEX[segs[segs.length - 1].id]
                  if (startingSegmentIndex < firstIdx) onSelect(firstIdx)
                  else if (startingSegmentIndex > lastIdx) onSelect(lastIdx)
                  else onSelect(startingSegmentIndex)
                }}
                aria-label={t('track.selectAria', { division: name })}
              >
                <ChestIcon
                  tier={division as Tier}
                  open={isComplete}
                  dimmed={status.kind === 'locked'}
                />
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
