export type Locale = 'en' | 'pt'

export const LOCALES: Locale[] = ['en', 'pt']

const en = {
  'tagline': 'Guild Wars 2 WvW match rewards calculator',
  'blurb':
    'See pips per tick and time left on the weekly reward track from your chest, placement, rank, and bonuses. Paste an API key to autofill rank and placement; chest progress is still manual.',
  'rewardTrack.aria': 'Reward track',

  'api.title': 'API key',
  'api.getKey': 'Get an API key',
  'api.label': 'Guild Wars 2 API key',
  'api.placeholder': 'Enter API key here',
  'api.hide': 'Hide',
  'api.show': 'Show',
  'api.pull': 'Pull',
  'api.fetchFailed': 'Failed to fetch from API.',
  'api.rank': 'rank {rank}',
  'api.placement': '{placement} in current skirmish',
  'api.placementUnavailable': 'placement unavailable',
  'api.warScore': '{score} war score',
  'api.error.emptyKey': 'Enter an API key first.',
  'api.error.invalidKey':
    'API key is invalid or missing required permissions (account, progression, wvw).',
  'api.error.http': 'GW2 API error ({status}): {detail}',
  'api.error.noRank':
    'Could not read WvW rank. Ensure the key has the progression permission.',

  'placement.title': 'Placement',
  'placement.aria': 'World placement',
  'placement.first': '1st',
  'placement.second': '2nd',
  'placement.third': '3rd',

  'rank.title': 'Rank',
  'rank.aria': 'Personal rank',
  'rank.max': 'Max',
  'rank.level': 'Lv {level}',
  'rank.levelRange': 'Lv {min}–{max}',

  'bonuses.title': 'Bonuses',
  'bonuses.commitment': 'Commitment',
  'bonuses.commander': 'Commander',
  'bonuses.publicCmd': 'Public cmd',

  'results.title': 'Results',
  'results.timeLeft': 'Time left',
  'results.hours': 'h',
  'results.minutes': 'm',
  'results.pipsPerTick': 'Pips / tick',
  'results.ticketsLeft': 'Tickets left',
  'results.pipsLeft': 'Pips left',
  'results.pips': 'Pips',
  'results.tickets': 'Tickets',
  'results.breakdown.placement': 'Placement',
  'results.breakdown.rank': 'Rank',
  'results.breakdown.bonus': 'Bonus',
  'results.totalPerTick': 'Total / tick',
  'results.footnote':
    'Assumes Tier 3+ participation every 5 minutes. Full track is 1450 pips (365 tickets) and resets with weekly WvW reset.',

  'footer.disclaimer': 'Not affiliated with ArenaNet',
  'footer.madeBy': 'Made by',
  'footer.kofi': 'Support on Ko-fi',

  'lang.label': 'Language',
  'lang.en': 'EN',
  'lang.pt': 'PT',

  'track.completed': 'Completed',
  'track.locked': 'Locked',
  'track.next': 'Next: Reward {current} of {total}',
  'track.rewardsAria': '{division} rewards',
  'track.selectAria': 'Select {division} track',
  'track.pipLabel':
    '{division} reward {n}: {pips} pips, {tickets} tickets',

  'division.Wood': 'Wood',
  'division.Bronze': 'Bronze',
  'division.Silver': 'Silver',
  'division.Gold': 'Gold',
  'division.Platinum': 'Platinum',
  'division.Mithril': 'Mithril',
  'division.Diamond': 'Diamond',
} as const

export type MessageKey = keyof typeof en

const pt: Record<MessageKey, string> = {
  'tagline': 'Calculadora de recompensas de partida WvW de Guild Wars 2',
  'blurb':
    'Veja pips por tick e o tempo restante na trilha semanal a partir do baú, colocação, ranque e bônus. Cole uma chave de API para preencher ranque e colocação; o progresso do baú continua manual.',
  'rewardTrack.aria': 'Trilha de recompensas',

  'api.title': 'Chave de API',
  'api.getKey': 'Obter chave de API',
  'api.label': 'Chave de API do Guild Wars 2',
  'api.placeholder': 'Digite a chave de API aqui',
  'api.hide': 'Ocultar',
  'api.show': 'Mostrar',
  'api.pull': 'Buscar',
  'api.fetchFailed': 'Falha ao buscar da API.',
  'api.rank': 'ranque {rank}',
  'api.placement': '{placement} na escaramuça atual',
  'api.placementUnavailable': 'colocação indisponível',
  'api.warScore': '{score} pontuação de guerra',
  'api.error.emptyKey': 'Digite uma chave de API primeiro.',
  'api.error.invalidKey':
    'A chave de API é inválida ou não tem as permissões necessárias (account, progression, wvw).',
  'api.error.http': 'Erro da API do GW2 ({status}): {detail}',
  'api.error.noRank':
    'Não foi possível ler o ranque de WvW. Verifique se a chave tem a permissão progression.',

  'placement.title': 'Colocação',
  'placement.aria': 'Colocação do mundo',
  'placement.first': '1º',
  'placement.second': '2º',
  'placement.third': '3º',

  'rank.title': 'Ranque',
  'rank.aria': 'Ranque pessoal',
  'rank.max': 'Máx',
  'rank.level': 'Nv {level}',
  'rank.levelRange': 'Nv {min}–{max}',

  'bonuses.title': 'Bônus',
  'bonuses.commitment': 'Compromisso',
  'bonuses.commander': 'Comandante',
  'bonuses.publicCmd': 'Cmd. público',

  'results.title': 'Resultados',
  'results.timeLeft': 'Tempo restante',
  'results.hours': 'h',
  'results.minutes': 'm',
  'results.pipsPerTick': 'Pips / tick',
  'results.ticketsLeft': 'Tickets restantes',
  'results.pipsLeft': 'Pips restantes',
  'results.pips': 'Pips',
  'results.tickets': 'Tickets',
  'results.breakdown.placement': 'Colocação',
  'results.breakdown.rank': 'Ranque',
  'results.breakdown.bonus': 'Bônus',
  'results.totalPerTick': 'Total / tick',
  'results.footnote':
    'Assume participação Tier 3+ a cada 5 minutos. A trilha completa tem 1450 pips (365 tickets) e reinicia com o reset semanal do WvW.',

  'footer.disclaimer': 'Não afiliado à ArenaNet',
  'footer.madeBy': 'Feito por',
  'footer.kofi': 'Apoiar no Ko-fi',

  'lang.label': 'Idioma',
  'lang.en': 'EN',
  'lang.pt': 'PT',

  'track.completed': 'Concluído',
  'track.locked': 'Bloqueado',
  'track.next': 'Próx.: Recompensa {current}/{total}',
  'track.rewardsAria': 'Recompensas de {division}',
  'track.selectAria': 'Selecionar trilha {division}',
  'track.pipLabel':
    '{division} recompensa {n}: {pips} pips, {tickets} tickets',

  'division.Wood': 'Madeira',
  'division.Bronze': 'Bronze',
  'division.Silver': 'Prata',
  'division.Gold': 'Ouro',
  'division.Platinum': 'Platina',
  'division.Mithril': 'Mithril',
  'division.Diamond': 'Diamante',
}

export const messages: Record<Locale, Record<MessageKey, string>> = {
  en: en as Record<MessageKey, string>,
  pt,
}

export type Vars = Record<string, string | number>

export function translate(locale: Locale, key: MessageKey, vars?: Vars): string {
  let text = messages[locale][key] ?? messages.en[key] ?? key
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value))
    }
  }
  return text
}

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'pt'
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en'
  const lang = navigator.language?.toLowerCase() ?? ''
  return lang.startsWith('pt') ? 'pt' : 'en'
}
