export type Tier =
  | 'Wood'
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Mithril'
  | 'Diamond'

interface ChestIconProps {
  tier: Tier
  open?: boolean
  dimmed?: boolean
  className?: string
}

/** Official in-game skirmish track chest art (from client assets via GW2 wiki). */
export function chestSrc(tier: Tier, open: boolean): string {
  const base = import.meta.env.BASE_URL
  const state = open ? 'open' : 'closed'
  return `${base}chests/${tier.toLowerCase()}-${state}.png`
}

export function ChestIcon({ tier, open = false, dimmed = false, className }: ChestIconProps) {
  return (
    <img
      className={`chest-icon${dimmed ? ' is-dimmed' : ''}${className ? ` ${className}` : ''}`}
      src={chestSrc(tier, open)}
      alt=""
      width={128}
      height={128}
      draggable={false}
    />
  )
}
