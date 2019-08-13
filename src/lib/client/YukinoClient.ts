import { KlasaClient } from 'klasa'
import Utils from './utils/Utils'

export default class YukinoClient extends KlasaClient {
  constructor () {
    super({
      prefix: ['yuki!', 'yukino!'],
      typing: true,
      commandLogging: true,
      noPrefixDM: true,
      readyMessage: 'Successfully initialized.',
      providers: {
        default: 'mongodb'
      }
    })
  }

  public async login (): Promise<string> {
    const config = await Utils.getYukinoConfig()
    if (config && config.token) return super.login(config.token)
    else return super.login()
  }
}
