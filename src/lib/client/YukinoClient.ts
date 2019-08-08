import { KlasaClient } from 'klasa'
import { readFile } from 'fs-nextra'
import YAML from 'js-yaml'

export interface YukinoConfig {
  token?: string
}

export default class YukinoClient extends KlasaClient {
  constructor () {
    super({
      prefix: ['yuki!', 'yukino!'],
      typing: true,
      commandLogging: true,
      noPrefixDM: true,
      disabledCorePieces: ['commands']
    })
  }

  public async login (): Promise<string> {
    const config: YukinoConfig | undefined = YAML.safeLoad(await readFile('./yukino-config.yml', 'utf8'))
    if (config && config.token) return super.login(config.token)
    else return super.login()
  }
}
