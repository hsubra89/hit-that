import { NoOp, StateMachine } from "./state-utils"

export class NoState implements StateMachine {
  resetState = NoOp

  static create() {
    return new NoState()
  }
}
