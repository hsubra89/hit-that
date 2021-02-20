
import { scoreBetweenCharArrays } from './utils'

let enabled = false

document.body.addEventListener('keydown', event => {
  switch (event.code) {
    case 'Semicolon':
      enableFuzzyLinkSearch(event)
      break
    case 'Enter':
      potentiallyNavigate()
      break
    case 'Escape':
      disableFuzzyLinkSearch()
      break
    case `'`:
      break
  }
})

const IGNORE_NODE_NAMES: Set<string> = new Set(['TEXTAREA', 'INPUT', 'SELECT'])

function isNodeInput(e: HTMLElement): boolean {
  return e.isContentEditable || IGNORE_NODE_NAMES.has(e.nodeName.toUpperCase())
}

type LinkElements = {
  url: string
  title: string
  anchor: HTMLAnchorElement
}

function enableFuzzyLinkSearch(e: KeyboardEvent) {

  if (enabled) {
    return
  }

  const target = e.target as HTMLElement

  if(isNodeInput(target)) {
    return
  }

  e.preventDefault()

  const anchors = Array
    .from(document.getElementsByTagName('a'))
    .map(a => {

      const title = a.innerText.trim().toLowerCase()
      const url = a.href

      return {
        url,
        title,
        anchor: a
      }
    })

  const eventHandler: EventListener = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()

    // Get value from the input
    const value = (event.target as HTMLInputElement).value

    if (value.length <= 1) {
      refitHighlights([])
      return
    }

    const valueChars = value.trim().toLowerCase().split('')

    // Convert the input into a shortlist of anchors
    // that match the pattern
    const r = valueChars.join('.*')
    const regex = new RegExp(r)
    const shortlist = anchors.filter(x => regex.test(x.title))

    // Now find the distance between characters in the shortlist and score the shortlist
    const scores = shortlist
      .map(x => ({ ...x, score: scoreBetweenCharArrays(x.title.split(''), valueChars) }))
      .sort((a, b) => a.score - b.score)

    refitHighlights(scores)
  }

  setTimeout(() => showQuickSearchInputBoxWithFocus(eventHandler), 0)
  enabled = true
}


let fuzzySearchResults: LinkElements[] = []

const HIGHLIGHT_CLASS = 'hit-that-highlight'
const HIGHLIGHT_CLASS_PRIMARY = 'hit-that-highlight-primary'

function refitHighlights(newHighlightList: LinkElements[]) {

  fuzzySearchResults
    .forEach((elem, index) => {
      elem.anchor.classList.remove(index === 0 ? HIGHLIGHT_CLASS_PRIMARY : HIGHLIGHT_CLASS)
    })

  fuzzySearchResults = []

  newHighlightList.forEach((elem, index) => {
    elem.anchor.classList.add(index === 0 ? HIGHLIGHT_CLASS_PRIMARY : HIGHLIGHT_CLASS)
  })

  fuzzySearchResults = newHighlightList
}

const HIT_INPUT_WINDOW_ID = `_hit_that_input_window_`
const HIT_INPUT_INPUT_ID = `_hit_that_fuzzy_search_`

function showQuickSearchInputBoxWithFocus(eventHandler: EventListener) {
  const div = document.createElement('div')
  div.setAttribute('id', HIT_INPUT_WINDOW_ID)
  div.innerHTML = `<input id="${HIT_INPUT_INPUT_ID}" placeholder="Fuzzy link search" value = "" autcomplete="no" \>`
  document.body.appendChild(div)

  const element = document.getElementById(HIT_INPUT_INPUT_ID) as HTMLInputElement
  element.addEventListener('input', eventHandler, true)
  element.focus()
}

function disableFuzzyLinkSearch() {

  const element = document.getElementById(HIT_INPUT_WINDOW_ID)

  if (element) {
    (element as any as HTMLDivElement).remove()
  }

  refitHighlights([])
  enabled = false
}

function potentiallyNavigate() {
  if(enabled && fuzzySearchResults.length > 0) {
    fuzzySearchResults[0].anchor.click()
  }
}
