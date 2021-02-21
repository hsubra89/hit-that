import { FuzzySearchState } from './FuzzySearchState'
import { HitHintState } from './HitHintState'
import { NoState } from './NoState'
import { StateMachine } from './state-utils'

const IGNORE_NODE_NAMES: Set<string> = new Set(['TEXTAREA', 'INPUT', 'SELECT'])

function isNodeInput(e: HTMLElement): boolean {
  return e.isContentEditable || IGNORE_NODE_NAMES.has(e.nodeName.toUpperCase())
}

export class DOMStateMachine implements StateMachine {

  state: StateMachine = NoState.create()

  resetState = () => {
    this.state.resetState()
    this.state = NoState.create()
  }

  isInactive = (state: StateMachine): state is NoState => {
    if (state instanceof NoState) {
      return true
    } else {
      return false
    }
  }

  isFuzzySearch = (state: StateMachine): state is FuzzySearchState => {
    if (state instanceof FuzzySearchState) {
      return true
    } else {
      return false
    }
  }

  isHitHintState = (state: StateMachine): state is HitHintState => {
    if (state instanceof HitHintState) {
      return true
    } else {
      return false
    }
  }

  navigateToPrimaryLink = () => {

    if (this.isFuzzySearch(this.state)) {
      this.state.navigateToPrimaryLink()
    }

    // Reset state before attempting navigation.
    this.state.resetState()
  }

  fuzzyNext = (event: KeyboardEvent) => {
    if (this.isFuzzySearch(this.state)) {
      event.preventDefault()
      this.state.highlightNext()
    }
  }

  fuzzyPrevious = (event: KeyboardEvent) => {
    if (this.isFuzzySearch(this.state)) {
      event.preventDefault()
      this.state.highlightPrevious()
    }
  }

  enableFuzzySearchState = (keyboardEvent: KeyboardEvent) => {

    const targetElement = keyboardEvent.target as HTMLElement

    if (!this.isInactive(this.state) || isNodeInput(targetElement)) {
      return
    }

    keyboardEvent.preventDefault()

    const buttons = Array.from(document.getElementsByTagName('button'))
    const anchors = Array.from(document.getElementsByTagName('a'))

    const links = [...buttons, ...anchors]
      .map(a => {

        const title = a.innerText.trim().toLowerCase()

        return {
          title,
          anchor: a
        }
      })

    this.state = new FuzzySearchState(links)
  }

  enableHitHintState = (keyboardEvent: KeyboardEvent) => {

    const targetElement = keyboardEvent.target as HTMLElement

    if (!this.isInactive(this.state) || isNodeInput(targetElement)) {
      return
    }

    this.state = new HitHintState()
  }
}
