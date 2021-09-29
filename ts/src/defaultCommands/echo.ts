import { ClientWithLest, MessageWithLest } from '../..'
import { Command } from '../utils'

module.exports = class Echo extends Command {
  constructor(client: ClientWithLest) {
    super(client, {
      name: 'echo',
      description: 'echo',
      category: 'Utils',
      examples: ['echo <text>'],
    })
  }

  run(message: MessageWithLest, args: string[]) {
    return message.channel.send(args.join(' '))
  }
}
