
import { dropWhile, getDistanceAndResult } from './utils'

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

      const title = a.innerText
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

    if(value.length <= 1) {
      return
    }

    const valueChars = value.trim().split('')

    // Convert the input into a shortlist of anchors
    // that match the pattern
    const r = value.trim().split('').join('.*')
    const regex = new RegExp(r, 'i')
    const shortlist = anchors.filter(x => regex.test(x.title))

    const scores = shortlist
      .map(x => ({ ...x, score: scoreBetweenStrings(valueChars, x.title) }))
      .sort((a, b) => a.score - b.score)

    // Now find the distance between characters in the shortlist and score the shortlist
    console.log(scores)
  }

  setTimeout(() => showQuickSearchInputBoxWithFocus(eventHandler), 0)
  enabled = true
}



// This is a logical scoring of distance between the char ordering
// We could use algorithms like levenshtein distance, but they don't
// seem like they would solve the problem.
function scoreBetweenStrings(charOrder: string[], target: string) {

  const srcString = target.split('')
  const char = charOrder.shift()
  const filtered = dropWhile(srcString, x => x != char)

  let score = 0
  let arr = filtered

  while(charOrder.length) {
    const char = charOrder.shift()
    const result = getDistanceAndResult(arr, x => x != char)
    score += result.count
    arr = result.arr
  }

  return score
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
