import Dexie from 'dexie';
import dbData from './dbData'

const TABLE_NAME = 'services'
let DB

export default {
  async getDb() {
    if (DB) {
      return DB
    }
    DB = await new Dexie(dbData.DB_NAME)
    DB.version(dbData.DB_VERSION).stores(dbData.DB_SCHEMA)
    return DB
  },
  async addService (service) {
    let db = await this.getDb()
    return await db.table(TABLE_NAME).put({...service}).then(key => key)
  },
  async updateService(id, changes) {
    let db = await this.getDb()
    return await db.table(TABLE_NAME).update(id, changes)
  },
  async getServices() {
    let db = await this.getDb()
    return await db.table(TABLE_NAME).toArray()
  },
  async getService(id) {
    let db = await this.getDb()
    return await db.table(TABLE_NAME).get(id, service => service)
  },
  async delService(id) {
    let db = await this.getDb()
    await db.table(TABLE_NAME).delete(id)
  },
  async removeAllServices() {
    let db = await this.getDb()
    await db.table(TABLE_NAME).clear()
  },
}
