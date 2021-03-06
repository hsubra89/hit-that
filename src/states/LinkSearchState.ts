import { LinkElements } from "../types"
import { NoOp, StateMachine } from "./state-utils"

const HIT_INPUT_WINDOW_ID = `_hit_that_linksearch_window_`
const HIT_INPUT_INPUT_ID = `_hit_that_linksearch_input_`
const HIT_COUNTER = `_hit_that_linksearch_counter_`

const HIGHLIGHT_CLASS = '_hit-that-highlight_'
const HIGHLIGHT_CLASS_PRIMARY = '_hit-that-highlight-primary_'


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

export class LinkSearchState implements StateMachine {

  state = {
    linkElements: NoOp
  }

  linkResults: LinkElements[] = []
  rootNode: HTMLDivElement
  counterNode: HTMLSpanElement

  constructor(private anchors: LinkElements[], private close: () => void) {
    const { input, div, counter } = this.showQuickSearchInputBoxWithFocus()
    this.rootNode = div
    this.counterNode = counter

    input.addEventListener('input', this.inputEventHandler, true)
    input.addEventListener('keydown', this.keydownEventHandler, true)
  }

  resetState = () => {
    // Delete "root node" to remove input box and the counter.
    this.rootNode.remove()

    // Remove "link suggestions" / "link results"
    this.state.linkElements = this.state.linkElements()
    this.linkResults = []
  }

  showQuickSearchInputBoxWithFocus = () => {
    const div = document.createElement('div')
    div.setAttribute('id', HIT_INPUT_WINDOW_ID)
    div.innerHTML = `<input id="${HIT_INPUT_INPUT_ID}" placeholder="Enter text from a link ..." value = "" autcomplete="no" \><span id="${HIT_COUNTER}"></span>`
    document.body.appendChild(div)

    const input = document.getElementById(HIT_INPUT_INPUT_ID) as HTMLInputElement
    const counter = document.getElementById(HIT_COUNTER) as HTMLSpanElement
    input.focus()

    return {
      div,
      input,
      counter
    }
  }

  navigateToPrimaryLink = () => {
    if (this.linkResults.length > 0) {
      const a = this.linkResults[0].anchor
      // We want to run this on nextTick, so that
      // local state can be updated appropriately.
      setTimeout(() => a.click(), 0)
    }
  }

  scrollElementIntoView = (e: HTMLElement) => {
    e.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' })
  }

  highlightPrevious = () => {
    if (this.linkResults.length > 0) {
      const [head, ...tail] = this.linkResults.slice().reverse()
      this.updateHighlights(tail.concat(head).reverse())
      this.scrollElementIntoView(this.linkResults[0].anchor)
    }
  }

  highlightNext = () => {
    if (this.linkResults.length > 0) {
      const [head, ...tail] = this.linkResults
      this.updateHighlights(tail.concat(head))
      this.scrollElementIntoView(this.linkResults[0].anchor)
    }
  }

  updateHighlights(newHighlights: LinkElements[]) {
    // Clear out existing highlights
    this.state.linkElements()

    // Highlight newer results
    this.linkResults = newHighlights
    this.state.linkElements = highlightLinkElements(newHighlights)
  }

  keydownEventHandler = (event: KeyboardEvent) => {

    switch (event.code) {
      case 'ArrowDown':
        event.preventDefault()
        event.stopPropagation()
        this.highlightNext()
        break
      case 'ArrowUp':
        event.preventDefault()
        event.stopPropagation()
        this.highlightPrevious()
        break
      case 'Tab':
        event.stopPropagation()
        event.preventDefault()
        if (event.shiftKey) {
          this.highlightPrevious()
        } else {
          this.highlightNext()
        }
        break
      case 'Enter':
        event.preventDefault()
        event.stopPropagation()
        this.navigateToPrimaryLink()
        this.close()
        break
    }
  }

  updateCounter = () => {
    const count = Math.min(this.linkResults.length, 99)
    this.counterNode.textContent = count === 0 ? '' : count.toString()
  }

  inputEventHandler = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()

    // Get value from the input
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase()

    if (value.length <= 1) {
      this.state.linkElements = this.state.linkElements()
      this.linkResults = []
    } else {

      const matches = this.anchors.filter(x => x.title.includes(value))
      this.updateHighlights(matches)

      // const [perfectMatch, toFuzzyMatch] = partition(this.anchors, x => x.title.includes(value))

      // const valueChars = value.split('')
      // // Convert the input into a shortlist of anchors
      // // that match the pattern
      // const r = valueChars.join('.*')
      // const regex = new RegExp(r)
      // const shortlist = toFuzzyMatch.filter(x => regex.test(x.title))

      // Now find the distance between characters in the shortlist and score the shortlist
      // const results = shortlist
      //   .map(x => ({ ...x, score: scoreBetweenCharArrays(x.title.split(''), valueChars) }))
      //   .filter(a => a.score != Infinity)
      //   .sort((a, b) => a.score - b.score)

      // Reset previous state and highlight new elements
      // this.updateHighlights(perfectMatch)
    }

    this.updateCounter()
  }
}
