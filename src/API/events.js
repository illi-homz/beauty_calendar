import Dexie from 'dexie';
import dbData from './dbData'

const TABLE_NAME = 'events'
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
  async addEvent (event) {
    let db = await this.getDb()
    return await db.table(TABLE_NAME).put({
      ...event,
      createDate: new Date().getTime()
    }).then(key => key)
  },
  async updateEvent(id, changes) {
    let db = await this.getDb()
    return await db.table(TABLE_NAME).update(id, changes)
  },
  async getEvents() {
    let db = await this.getDb()
    return await db.table(TABLE_NAME).toArray()
  },
  async getEvent(id) {
    let db = await this.getDb()
    return await db.table(TABLE_NAME).get(id, client => client)
  },
  async delEvent(id) {
    let db = await this.getDb()
    await db.table(TABLE_NAME).delete(id)
  },
  async removeAllEvents() {
    let db = await this.getDb()
    await db.table(TABLE_NAME).clear()
  },
  async getAllEventsClient(clientId) {
    let db = await this.getDb()
    return await db.table(TABLE_NAME).filter(t => t.client === clientId)
  },
  async getEventsByClientId(id) {
    const db = await this.getDb()
    return await db.table(TABLE_NAME).where({client: id}).toArray()
  },
  async delEventsByClientId(id) {
    const db = await this.getDb()
    return await db.table(TABLE_NAME).where({client: id}).delete()
  },

  // for statistic
  async getEventsByDate(days=1) {
    const db = await this.getDb()
    const now = new Date().getTime()
    return await db.table(TABLE_NAME).where('start').between(now - 1000*60*60*24*days, now).toArray()
    // return await db.table(TABLE_NAME).where('id').between(0, 3).toArray()
  },
}
