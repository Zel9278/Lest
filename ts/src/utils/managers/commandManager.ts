import { Collection } from 'discord.js'
import path from 'path'
import { Command, commandLoader } from '../index'
import { ClientWithLest, Config, MessageWithLest } from '../../../index'

export class CommandManager extends Collection<string, (Command | CommandManager)> {
  constructor(client: ClientWithLest, config: Config, sourcePath: string) {
    super()

    const defaultCommands = commandLoader(
      path.join(__dirname, '../../defaultCommands')
    )
    const commands = commandLoader(path.join(sourcePath, 'commands'))
    //console.log(commands)

    for (const command in defaultCommands) {
      if (config.defaultCommand?.some((cn) => cn === command)) {
        const cmd = new defaultCommands[command](client)
        this.set(command, cmd)

        if (config.log) {
          console.log(`[CommandManager] Loaded ${cmd.name}`)
        }
      }
    };

    for (const command in commands) {
      if (typeof command !== 'string') return
      const baseCommand = commands[command]
      console.log(baseCommand);
      const type = Object.prototype.toString.call(baseCommand)

      if (type === '[object Function]') {
        const cmd = new baseCommand(client)
        this.set(command, cmd)

        if (config.log) {
          console.log(`[CommandManager] Loaded ${cmd.name}`)
        }
      }

      if (type === '[object Object]') {
        //this.set(command, new CommandManager(client, config, baseCommand._dirname))

        if (config.log) {
          console.log(`[CommandManager] Loaded SubCommand ${command}`)
        }
      }
    }

    if (config.log) console.log("[LestInfo]", `Loaded ${this.size} commands`);
    client.lest.emit("finish-init");

    //console.log(this);
  }
}