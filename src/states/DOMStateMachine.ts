import { findVisiblePointerDOMElements, isNodeInput, removeNestedPointerElements } from '../dom-utils'
import { HitHintState } from './HitHintState'
import { LinkSearchState } from './LinkSearchState'
import { NoState } from './NoState'
import { StateMachine } from './state-utils'


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

  isLinkSearch = (state: StateMachine): state is LinkSearchState => {
    if (state instanceof LinkSearchState) {
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

  enableLinkSearchState = (keyboardEvent: KeyboardEvent) => {

    const targetElement = keyboardEvent.target as HTMLElement

    if (!this.isInactive(this.state) || isNodeInput(targetElement)) {
      return
    }

    keyboardEvent.preventDefault()
    keyboardEvent.stopPropagation()

    const links = removeNestedPointerElements(findVisiblePointerDOMElements())
      .map(a => {

        const title = a.innerText.trim().toLowerCase()

        return {
          title,
          anchor: a
        }
      })
      // Filter out links without titles because we can't use
      // fuzzy-search to get to them
      .filter(a => a.title !== '')

    this.state = new LinkSearchState(links, this.resetState)
  }

  enableHitHintState = (keyboardEvent: KeyboardEvent) => {

    const targetElement = keyboardEvent.target as HTMLElement

    if (!this.isInactive(this.state) || isNodeInput(targetElement)) {
      return
    }

    keyboardEvent.preventDefault()
    keyboardEvent.stopPropagation()

    const links = removeNestedPointerElements(findVisiblePointerDOMElements())

    this.state = new HitHintState()
  }
}
