import { ClientWithLest, MessageWithLest } from "../../.."

export interface CommandOptions {
  name: string
  description: string
  category?: string
  examples?: string[]
  guildOnly?: boolean
  enabled?: boolean
  adminOnly?: boolean
}

export class Command {
  name: string
  description: string
  category?: string
  examples?: string[]
  guildOnly?: boolean
  enabled?: boolean
  adminOnly?: boolean
  _cmdPath: Array<string>

  constructor(client: ClientWithLest, options: CommandOptions) {
    this.name = options.name
    this.description = options.description
    this.category = options.category || ''
    this.examples = options.examples || [this.name]
    this.guildOnly = options.guildOnly || false
    this.enabled = options.enabled || true
    this.adminOnly = options.adminOnly || false
    this._cmdPath = [this.name]
  }

  run(message: MessageWithLest, args: string[]) {
    throw new Error('Command must be implemented')
  }
}
