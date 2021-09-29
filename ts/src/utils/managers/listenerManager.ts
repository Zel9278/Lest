import { Collection } from 'discord.js'
import path from 'path'
import { Listener, listenerLoader } from '../index'
import { ClientWithLest, Config } from '../../../index'

export class ListenerManager extends Collection<string, Listener> {
  constructor(client: ClientWithLest, config: Config, sourcePath: string) {
    super()

    const defaultListeners = listenerLoader(
      path.join(__dirname, '../../defaultListeners')
    )
    const listeners = listenerLoader(path.join(sourcePath, 'listeners'))

    for (const event in defaultListeners) {
      let listener = new defaultListeners[event](client)
      client[listener.isOnce ? 'once' : 'on'](event, (...args) =>
        listener.run(...args)
      )

      this.set(event, listener)

      if (config.log) {
        console.log(`[ListenerManager] Loaded ${event}`)
      }
    }

    for (const event in listeners) {
      let listener = new listeners[event](client)
      client[listener.isOnce ? 'once' : 'on'](event, (...args) =>
        listener.run(...args)
      )

      this.set(event, listener)
      
      if (config.log) {
        console.log(`[ListenerManager] Loaded ${event}`)
      }
    }

    //console.log(this)
  }
}