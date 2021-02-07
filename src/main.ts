
import { scoreBetweenCharArrays } from './utils'

let enabled = false

document.body.addEventListener('keydown', event => {
  switch (event.code) {
    case 'KeyF':
      enableFuzzyLinkSearch(event)
      break
    case 'Escape':
      disableFuzzyLinkSearch()
      break
    case `'`:
      break
  }
})

function enableFuzzyLinkSearch(e: KeyboardEvent) {

  if (enabled) {
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

  const eventHandler: EventListener = (event: any) => {
    event.preventDefault()
    event.stopPropagation()

    // Get value from the input
    const value = (event.target as HTMLInputElement).value

    if (value.length <= 1) {
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

    console.log(`-------------------------------------------------------------------`)
    console.log(scores)
    console.log(scores.slice(0, 10).map(x => x.title).join('  '))
    console.log(`-------------------------------------------------------------------`)
  }

  setTimeout(() => showQuickSearchInputBoxWithFocus(eventHandler), 0)
  enabled = true
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

  enabled = false
}
