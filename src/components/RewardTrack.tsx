import { useEffect, useRef } from 'react'
import {
  CHEST_SEGMENTS,
  DIVISIONS,
  segmentsByDivision,
  type ChestSegment,
} from '../lib/pips'
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
): { kind: 'completed' | 'active' | 'locked'; text: string } {
  const indices = segs.map((s) => CHEST_INDEX[s.id])
  const first = indices[0]
  const last = indices[indices.length - 1]

  if (startingSegmentIndex > last) {
    return { kind: 'completed', text: 'Completed' }
  }
  if (startingSegmentIndex < first) {
    return { kind: 'locked', text: 'Locked' }
  }
  const rewardNum = startingSegmentIndex - first + 1
  return {
    kind: 'active',
    text: `Next: Reward ${rewardNum} of ${segs.length}`,
  }
}

export function RewardTrack({ startingSegmentIndex, onSelect }: RewardTrackProps) {
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
          const status = statusForDivision(segs, startingSegmentIndex)
          const isComplete = status.kind === 'completed'

          return (
            <article
              key={division}
              className={`tier-card tier-${status.kind}`}
              role="listitem"
              ref={status.kind === 'active' ? (el) => { activeRef.current = el } : undefined}
            >
              <h3 className="tier-name">{division}</h3>
              <p className={`tier-status status-${status.kind}`}>{status.text}</p>

              <div className="tier-pips" role="group" aria-label={`${division} rewards`}>
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
                      label={`${division} reward ${seg.segmentIndex + 1}: ${seg.pips} pips, ${seg.tickets} tickets`}
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
                aria-label={`Select ${division} track`}
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
