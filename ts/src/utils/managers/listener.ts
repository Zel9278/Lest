import { ClientWithLest } from "../../.."

export interface ListenerOptions {
  isOnce?: boolean
}

export class Listener {
  isOnce?: boolean

  constructor(public client: ClientWithLest, options?: ListenerOptions) {
    this.isOnce = options?.isOnce || false
  }

  run(...args: any[]) {
    throw new Error('Listener must be implemented')
  }
}
