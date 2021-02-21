import { DOMStateMachine } from "./dom"

const domState = new DOMStateMachine()

document.body.addEventListener('keydown', event => {
  switch (event.code) {
    case 'Semicolon':
      domState.enableFuzzySearchState(event)
      break
    case 'Enter':
      domState.navigateToPrimaryLink()
      break
    case 'Escape':
      domState.resetState()
      break
    case `'`:
      break
  }
})
