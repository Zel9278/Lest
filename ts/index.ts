import { EventEmitter } from 'events'
import path from 'path'
import {
  Client,
  ClientOptions,
  Message
} from 'discord.js'
import {
  Command,
  CommandManager,
  Listener,
  ListenerManager,
} from './src/utils/'

export interface Config {
  sourceDir: string
  prefix: string
  log?: boolean
  admin?: string[]
  defaultCommand?: string[]
  clientOptions: ClientOptions
}

interface collections {
  listeners: ListenerManager
  commands: CommandManager
}

export type ClientWithLest = Client & { lest: Lest }
export type MessageWithLest = Message & { client: ClientWithLest }
export class Lest extends EventEmitter {
  config: Config
  hostPath: string
  sourcePath: string
  collections: collections
  readonly client: ClientWithLest

  constructor(config: Config) {
    super()
    if (!config) throw Error('Could not find the config.')
    this.config = config
    this.hostPath = process.cwd()
    this.sourcePath = path.resolve(this.hostPath, this.config.sourceDir)
    this.client = Object.assign(new Client(config.clientOptions), {
      lest: this,
    })
    this.collections = {
      listeners: new ListenerManager(this.client, this.config, this.sourcePath),
      commands: new CommandManager(this.client, this.config, this.sourcePath),
    }

    //console.log(this);
  }

  setPrefix(prefix: string) {
    const oldPrefix: string = this.config.prefix
    this.config.prefix = prefix || this.config.prefix || '!'
    if (this.config.log)
      console.log("LestInfo", 
        `The current prefix has been changed from ${oldPrefix} to ${prefix}.`
      )
  }

  addCommand(command: Command) {}
}
