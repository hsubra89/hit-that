import './hit-that.css'
import { DOMStateMachine } from "./states/DOMStateMachine"

const domState = new DOMStateMachine()

document.body.addEventListener('keydown', event => {
  switch (event.code) {
    case 'KeyH':
      domState.enableHitHintState(event)
      break
    case 'Semicolon':
      domState.enableLinkSearchState(event)
      break
    case 'Escape':
      domState.resetState()
      break
  }
})
