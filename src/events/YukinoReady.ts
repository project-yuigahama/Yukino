import { Event } from 'klasa'

export default class YukinoReady extends Event {
  once = true

  event = 'ready'

  public async run (): Promise<void> {
    this.client.console.log([
      `Users: ${this.client.users.size}`,
      `Guilds: ${this.client.guilds.size}`
    ])
  }
}
