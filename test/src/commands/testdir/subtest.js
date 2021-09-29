const { Command } = require('../../../../dist/src/utils')

module.exports = class SubTest extends Command {
  constructor(client) {
    super(client, {
      name: 'subtest',
      description: 'SubCommand Testing',
      category: 'Test',
      examples: ['subtest']
    })
  }

  run(message, args) {
    return message.reply({
      content: 'subcommand test',
      allowedMentions: {
        parse: ['users']
      }
    })
  }
}
