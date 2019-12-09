class Store {
  constructor(db, name) {
    this.db = db
    this.name = name
  }

  all = () => this.db.all(this.name)
  put = (item, key) => this.db.put(this.name, item, key)
  delete = (key) => this.db.delete(this.name, key)
}

class DB {
  stores = {}

  store = (storeName) => this.stores[storeName] || (this.stores[storeName] = new Store(this, storeName))

  getDB() {
    return this.databaseValue || (this.databaseValue = this.initDatabase())
  }

  initDatabase() {
    return new Promise((resolve) => {
      const req = indexedDB.open('db', 1)
      req.onsuccess = (e) => resolve(e.target.result)
      req.onupgradeneeded = (e) => {
        const db = e.target.result
        db.createObjectStore('samples', {autoIncrement: true})
      }
    })
  }

  async getObjectStore(storeName) {
    const db = await this.getDB()
    const transaction = db.transaction(storeName, 'readwrite')
    return transaction.objectStore(storeName)
  }

  async createRequest(storeName, methodName, args) {
    const objectStore = await this.getObjectStore(storeName)
    return objectStore[methodName].apply(objectStore, args)
  }

  async call(storeName, methodName, args) {
    const request = await this.createRequest(storeName, methodName, args)
    return await new Promise((resolve, reject) => {
      request.onsuccess = (e) => resolve(e.target.result)
      request.onerror = reject
    })
  }

  async all(storeName) {
    const request = await this.createRequest(storeName, 'openCursor')
    const records = []
    await new Promise((resolve, reject) => {
      request.onsuccess = (e) => {
        const cursor = e.target.result
        if (cursor) {
          records.push({ ...cursor.value, id: cursor.key })
          cursor.continue()
        } else resolve()
      }
      request.onerror = reject
    })
    return records
  }

  async put(storeName, item, key) {
    return await this.call(storeName, 'put', [item, key])
  }

  async delete(storeName, key) {
    return await this.call(storeName, 'delete', [key])
  }
}

export default new DB()
