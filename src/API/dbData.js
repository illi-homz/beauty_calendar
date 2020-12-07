export default {
  DB_NAME: 'dbStore',
  DB_VERSION: 1,
  DB_SCHEMA: {
    clients: '++id, name, lastName, tel, birthDay, notes, color',
    events: '++id, services, details, client, start, end, price, cost, color, createDate',
    services: '++id, title'
  }
}
