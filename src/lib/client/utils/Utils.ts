import { safeLoad } from 'js-yaml'
import { readFile } from 'fs-nextra'

export interface YukinoConfig {
  token?: string
  mongodb: {
    user?: string
    password?: string
    host?: string
    port?: number
    db?: string
  }
}

export default class Utils {
  public static async getYukinoConfig (): Promise<YukinoConfig> {
    return safeLoad(await readFile('./yukino-config.yml', 'utf8'))
  }
}
