import { ClientWithLest } from '../..'
import { Listener } from '../utils'

module.exports = class Ready extends Listener {
  constructor(client: ClientWithLest) {
    super(client)
  }

  run() {}
}
