const { Command } = require('../../../dist/src/utils')
const { inspect } = require('util')

module.exports = class Test extends Command {
  constructor(client) {
    super(client, {
      name: 'test',
      description: 'test',
      category: 'Test',
      examples: ['test', 'test <args>']
    })
  }

  run(message, args) {
    return message.reply({
      embeds: [
        {
          title: 'Test',
          description: 'test',
          fields: [
            {
              name: 'message',
              value: message.content
            },
            {
              name: 'args',
              value: (args.length !== 0) ? inspect(args) : 'None'
            },
            {
              name: 'author',
              value: message.author.tag
            }
          ]
        }
      ],
      allowedMentions: {
        parse: ['users']
      }
    })
  }
}
