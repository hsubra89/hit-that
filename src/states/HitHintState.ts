import { NoOp, StateMachine } from "./state-utils"

function findClickableElements() {
  const a = document.getElementsByTagName('a')
  const button = document.getElementsByTagName('button')

}

export class HitHintState implements StateMachine {

  resetState = NoOp

  private elements: HTMLAnchorElement[]

  constructor() {
    this.start()
    this.elements = []
  }

  start = () => {

  }
}
