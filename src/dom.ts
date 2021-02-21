import { FuzzySearchState } from './states/FuzzySearchState'
import { NoState } from './states/NoState'
import { StateMachine } from './states/state-utils'

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

  navigateToPrimaryLink = () => {
    if (this.isFuzzySearch(this.state)) {
      this.state.navigateToPrimaryLink()
    }

    this.state.resetState()
  }

  fuzzyNext = () => {
    if (this.isFuzzySearch(this.state)) {
      this.state.highlightNext()
    }
  }

  fuzzyPrevious = () => {
    if (this.isFuzzySearch(this.state)) {
      this.state.highlightPrevious()
    }
  }

  enableFuzzySearchState = (keyboardEvent: KeyboardEvent) => {

    const targetElement = keyboardEvent.target as HTMLElement

    if (!this.isInactive(this.state) || isNodeInput(targetElement)) {
      return
    }

    keyboardEvent.preventDefault()

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

    setTimeout(() => {
      this.state = new FuzzySearchState(anchors)
    }, 0)
  }
}
