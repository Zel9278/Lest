import { ClientWithLest, MessageWithLest } from '../..'
import { Command } from '../utils'

module.exports = class Ping extends Command {
  constructor(client: ClientWithLest) {
    super(client, {
      name: 'ping',
      description: 'ping pong',
      category: 'Utils',
      examples: ['ping'],
    })
  }

  run(message: MessageWithLest, args: string[]) {
    return message.channel.send('Pong!')
  }
}
