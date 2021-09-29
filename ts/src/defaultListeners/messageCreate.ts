import { Listener } from '../utils'
import { commandHandler } from '../handlers'
import { ClientWithLest, MessageWithLest } from '../..'

module.exports = class MessageCreate extends Listener {
  constructor(client: ClientWithLest) {
    super(client)
  }

  run(message: MessageWithLest) {
    if (message.author.bot) return
    commandHandler(message)
  }
}
