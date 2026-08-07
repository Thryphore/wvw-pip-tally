/** GoatCounter site code — claim this exact name at https://www.goatcounter.com */
const GOATCOUNTER_CODE = 'jacobwittig'

/** Lightweight, privacy-friendly pageview analytics (production only). */
export function initAnalytics(): void {
  if (!import.meta.env.PROD) return
  if (document.querySelector('script[data-goatcounter]')) return

  const script = document.createElement('script')
  script.async = true
  script.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`
  script.src = 'https://gc.zgo.at/count.js'
  document.head.appendChild(script)
}
