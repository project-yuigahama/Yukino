import { MongoClient, Db, Collection } from 'mongodb'
import { Provider, util } from 'klasa'
import YukinoUtils from '../lib/client/utils/Utils'

const resolveQuery = (query: any) => (util.isObject(query) ? query : { id: query })

export default class MongoDB extends Provider {
  name = 'mongodb'

  db: Db | null = null;

  mongoclient: MongoClient | null = null;

  public async init (): Promise<void> {
    const config = await YukinoUtils.getYukinoConfig()
    if (!config) throw new Error('"yukino-config.yml" is not found.')

    if (config.mongodb.password && config.mongodb.user) {
      const client = await new MongoClient(`mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host || 'localhost'}:${config.mongodb.port || '27017'}/${config.mongodb.db || ''}`, { useNewUrlParser: true }).connect()
      this.db = client.db(config.mongodb.db)
      this.mongoclient = client

      this.client.console.log('[MongoDB] Connect to database.')

      return
    }

    const client = await new MongoClient(`mongodb://${config.mongodb.host || 'localhost'}:${config.mongodb.port || '27017'}/${config.mongodb.db || ''}`, { useNewUrlParser: true }).connect()
    this.db = client.db(config.mongodb.db)
    this.mongoclient = client

    this.client.console.log('[MongoDB] Connect to database.')
  }

  public async createTable (table: string): Promise<Collection<any>> {
    if (this.db) return this.db.createCollection(table)
    else throw new Error()
  }

  public async hasTable (table: string): Promise<boolean> {
    if (this.db) {
      return this.db.listCollections().toArray().then((collections: any[]) => {
        return collections.some(col => col.name === table)
      })
    } else throw new Error()
  }

  public async deleteTable (table: string): Promise<boolean> {
    if (this.db) return this.db.dropCollection(table)
    else throw new Error()
  }

  public async create (table: string, entryID: string, data: any = {}): Promise<any> {
    if (this.db) return this.db.collection(table).insertOne(util.mergeObjects(this.parseUpdateInput(data), resolveQuery(entryID)))
    else throw new Error()
  }

  public async update (table: string, entryID: string, data: any): Promise<any> {
    if (this.db) return this.db.collection(table).updateOne(resolveQuery(entryID), { $set: util.isObject(data) ? this.flatten(data) : this.parseEngineInput(data) })
    else throw new Error()
  }

  public async getAll (table: string): Promise<any> {
    if (this.db) return this.db.collection(table).find().toArray()
    else throw new Error()
  }

  public async getKeys (table: string): Promise<string[]> {
    if (this.db) return this.db.collection(table).find().toArray()
    else throw new Error()
  }

  public async get (table: string, entryID: string): Promise<any> {
    if (this.db) return this.db.collection(table).findOne(resolveQuery(entryID))
    else throw new Error()
  }

  public async replace (table: string, entryID: string, data: any): Promise<any> {
    if (this.db) return this.db.collection(table).replaceOne(resolveQuery(entryID), this.parseUpdateInput(data))
    else throw new Error()
  }

  public async has (table: string, entryID: string): Promise<boolean> {
    if (this.db) return this.get(table, entryID).then(Boolean)
    else throw new Error()
  }

  public async delete (table: string, entryID: string): Promise<any> {
    if (this.db) return this.db.collection(table).deleteOne(resolveQuery(entryID))
    else throw new Error()
  }

  public async shutdown (): Promise<void> {
    if (this.mongoclient) this.mongoclient.close()
  }

  private flatten (obj: any, path: string = ''): any {
    let output = {} as { [key: string]: any }
    for (const [key, value] of Object.entries(obj)) {
      if (util.isObject(value)) {
        output = Object.assign(output, this.flatten(value, path ? `${path}.${key}` : key))
      } else output[path ? `${path}.${key}` : key] = value
    }

    return output
  }

  private parseEngineInput (updated: any[]): any {
    return Object.assign({}, ...updated.map(entry => ({ [entry.data[0]]: entry.data[1] })))
  }
}
