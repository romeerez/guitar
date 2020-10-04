class DB {
  databaseValue?: Promise<IDBDatabase>

  getDB() {
    return this.databaseValue || (this.databaseValue = this.initDatabase() as Promise<IDBDatabase>)
  }

  initDatabase() {
    return new Promise((resolve) => {
      const req = indexedDB.open('db', 1)
      req.onsuccess = (e: any) => resolve(e.target.result)
      req.onupgradeneeded = (e: any) => {
        const db = e.target.result
        db.createObjectStore('samples', {autoIncrement: true})
        db.createObjectStore('audioData', {autoIncrement: true})
      }
    })
  }

  async getObjectStore(storeName: string) {
    const db = await this.getDB()
    const transaction = db.transaction(storeName, 'readwrite')
    return transaction.objectStore(storeName)
  }

  async createRequest(storeName: string, methodName: string, args?: any[]) {
    const objectStore = await this.getObjectStore(storeName)
    return (objectStore as any)[methodName].apply(objectStore, args)
  }

  async call(storeName: string, methodName: string, args: any[]) {
    const request = await this.createRequest(storeName, methodName, args)
    return await new Promise((resolve, reject) => {
      request.onsuccess = (e: any) => resolve(e.target.result)
      request.onerror = reject
    })
  }

  async all(storeName: string) {
    const request = await this.createRequest(storeName, 'openCursor')
    const records: any[] = []
    await new Promise((resolve, reject) => {
      request.onsuccess = (e: any) => {
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

  async get(storeName: string, key: number) {
    return await this.call(storeName, 'get', [key])
  }

  async put(storeName: string, item: any, key?: number) {
    return (await this.call(storeName, 'put', [item, key])) as number
  }

  async delete(storeName: string, key: number) {
    return await this.call(storeName, 'delete', [key])
  }
}

class Store<T extends {id: number}> {
  db: DB
  name: string

  constructor(db: DB, name: string) {
    this.db = db
    this.name = name
  }

  async all() {
    return await this.db.all(this.name) as T[]
  }

  async get(id: number) {
    return await this.db.get(this.name, id) as T
  }

  async put(item: any, id?: number) {
    return await this.db.put(this.name, item, id)
  }

  async delete(id: number) {
    return this.db.delete(this.name, id)
  }
}

export const db = new DB()

export type SampleRecord = {
  id: number
  name: string
  audioDataIds: number[]
  offsetX: number
  scaleX: number
}
export const samples = new Store<SampleRecord>(db, 'samples')

export type AudioDataRecord = {
  id: number
  sampleRate: number
  arrayBuffer: ArrayBuffer
}
export const audioData = new Store<AudioDataRecord>(db, 'audioData')

export const collections = { samples }
