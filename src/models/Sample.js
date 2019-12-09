import {observable, action, toJS} from 'mobx'
import task from '../lib/task'
import db from '../lib/db'
import Expected from './Expected'
import {remove} from './actions'

class Sample {
  @observable static records = []
  static store = db.store('samples')

  @observable id
  @observable name
  @observable arrayBuffer
  @observable enablePitchSelection
  @observable expected
  @observable tab
  @observable scaleX
  @observable offsetX
  audioContext = new AudioContext()

  constructor({
    id, name, arrayBuffer, enablePitchSelection, tab = 0, scaleX = 1, offsetX = 0, expected = []
  }) {
    if (id)
      this.id = id
    this.name = name
    this.arrayBuffer = arrayBuffer
    this.enablePitchSelection = enablePitchSelection
    this.tab = tab
    this.scaleX = scaleX
    this.offsetX = offsetX
    this.expected = expected.map((expected) => new Expected(expected))
  }

  static map = (records) => records.map((record) => new this(record))

  static toJS({id, audioContext, expected, ...result}) {
    result.expected = toJS(expected)
    return result
  }

  @action static push = (record) =>
    this.records.push(record)

  @task static create = async (params) => {
    const record = new this(params)
    record.id = await this.store.put(this.toJS({ ...record }))
    this.push(record)
  }

  @task static update = async (id, params) => {
    const record = this.records.find((record) => record.id === id)
    const value = { ...record, ...params }
    delete value.id
    await this.store.put(this.toJS(value), id)
    Object.assign(record, params)
  }

  static save = async (params) => {
    params.id ? this.update(params.id, params) : this.create(params)
  }

  @action static replaceRecords = (records) =>
    this.records.replace(records)

  @task.once static async fetch() {
    const records = await this.store.all()
    this.replaceRecords(this.map(records))
  }

  static get all() {
    this.fetch()
    return this.records
  }

  update(params) { Sample.update(this.id, params) }
  save() { Sample.save(this) }
  delete() { remove(this.store, this.records, this.id) }
}

export default Sample
