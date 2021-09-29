import { MessageWithLest } from '../..'
import { escapeRegExp } from '../utils'

export function commandHandler(message: MessageWithLest): any {
  const lest = message.client.lest
  if (
    !message.content.match(
      new RegExp(
        `^${escapeRegExp(lest.config.prefix)}|<@!?${message.client.user?.id}>`
      )
    )
  )
    return

  const isMention = message.mentions.has(message.client.user?.id || '')
    ? `<@!${message.client.user?.id}>`
    : lest.config.prefix
  const args = message.content
    .toString()
    .slice(isMention.length)
    .trim()
    .split(/ +/g)
  const command = lest.collections.commands.get(args.shift()?.toLowerCase() || '')

  if (!command) return
  const type = Object.prototype.toString.call(command)
  console.log(command);
  message.reply({
    content: `Called: ${command.constructor.name}`,
    allowedMentions: {
      parse: ['users']
    }
  })
  /*if (type === '[object Object]') {
    if (!command.enabled) return
    if (command.guildOnly && message.channel.type !== 'GUILD_TEXT') return

    command.run(message, args)
  }

  if (type === '[object Array]') {

  }*/
}