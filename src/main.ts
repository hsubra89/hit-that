import { DOMStateMachine } from "./states/DOMStateMachine"

const domState = new DOMStateMachine()

document.body.addEventListener('keydown', event => {
  switch (event.code) {
    case 'KeyH':
      domState.enableHitHintState(event)
      break
    case 'Semicolon':
      domState.enableFuzzySearchState(event)
      break
    case 'ArrowDown':
      domState.fuzzyNext(event)
      break
    case 'ArrowUp':
      domState.fuzzyPrevious(event)
      break
    case 'Enter':
      domState.navigateToPrimaryLink()
      break
    case 'Escape':
      domState.resetState()
      break
  }
})
