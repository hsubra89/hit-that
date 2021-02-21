import { LinkElements } from "../types"
import { scoreBetweenCharArrays } from "../utils"
import { NoOp, StateMachine } from "./state-utils"

const HIT_INPUT_WINDOW_ID = `_hit_that_input_window_`
const HIT_INPUT_INPUT_ID = `_hit_that_fuzzy_search_`

const HIGHLIGHT_CLASS = '_hit-that-highlight_'
const HIGHLIGHT_CLASS_PRIMARY = '_hit-that-highlight-primary_'

function showQuickSearchInputBoxWithFocus(eventHandler: EventListener) {
  const div = document.createElement('div')
  div.setAttribute('id', HIT_INPUT_WINDOW_ID)
  div.innerHTML = `<input id="${HIT_INPUT_INPUT_ID}" placeholder="Fuzzy link search" value = "" autcomplete="no" \>`
  document.body.appendChild(div)

  const element = document.getElementById(HIT_INPUT_INPUT_ID) as HTMLInputElement
  element.addEventListener('input', eventHandler, true)
  element.focus()

  return () => {
    div.remove()
    return NoOp
  }
}

function highlightLinkElements(newHighlightList: LinkElements[]) {

  newHighlightList.forEach((elem, index) => {
    elem.anchor.classList.add(index === 0 ? HIGHLIGHT_CLASS_PRIMARY : HIGHLIGHT_CLASS)
  })

  return () => {
    newHighlightList.forEach((elem, index) => {
      elem.anchor.classList.remove(index === 0 ? HIGHLIGHT_CLASS_PRIMARY : HIGHLIGHT_CLASS)
    })

    return NoOp
  }
}

export class FuzzySearchState implements StateMachine {

  state = {
    searchInputBox: NoOp,
    linkElements: NoOp
  }

  linkResults: LinkElements[] = []

  resetState = () => {
    this.state.searchInputBox = this.state.searchInputBox()
    this.state.linkElements = this.state.linkElements()
    this.linkResults = []
  }

  constructor(private anchors: LinkElements[]) {
    this.state.searchInputBox = showQuickSearchInputBoxWithFocus(this.eventHandler)
  }

  navigateToPrimaryLink = () => {
    if (this.linkResults.length > 0) {
      const a = this.linkResults[0].anchor
      this.resetState()

      // We want to run this on nextTick, so that
      // local state can be updated appropriately.
      setTimeout(() => a.click(), 0)
    }
  }

  highlightPrevious = () => {
    if (this.linkResults.length > 0) {
      const [head, ...tail] = this.linkResults.slice().reverse()
      this.updateHighlights(tail.concat(head).reverse())
    }
  }

  highlightNext = () => {
    if (this.linkResults.length > 0) {
      const [head, ...tail] = this.linkResults
      this.updateHighlights(tail.concat(head))
    }
  }

  updateHighlights(newHighlights: LinkElements[]) {
    // Clear out existing highlights
    this.state.linkElements()

    // Highlight newer results
    this.linkResults = newHighlights
    this.state.linkElements = highlightLinkElements(newHighlights)
  }

  eventHandler: EventListener = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()

    // Get value from the input
    const value = (event.target as HTMLInputElement).value

    if (value.length <= 1) {
      this.state.linkElements = this.state.linkElements()
    } else {

      const valueChars = value.trim().toLowerCase().split('')

      // Convert the input into a shortlist of anchors
      // that match the pattern
      const r = valueChars.join('.*')
      const regex = new RegExp(r)
      const shortlist = this.anchors.filter(x => regex.test(x.title))

      // Now find the distance between characters in the shortlist and score the shortlist
      const results = shortlist
        .map(x => ({ ...x, score: scoreBetweenCharArrays(x.title.split(''), valueChars) }))
        .filter(a => a.score != Infinity)
        .sort((a, b) => a.score - b.score)

      // Reset previous state and highlight new elements
      this.updateHighlights(results)
    }
  }
}
