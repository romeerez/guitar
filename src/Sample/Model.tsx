import task from 'lib/task'
import { samples as store, audioData as audioDataStore, SampleRecord } from "db"
import { observable, action, toJS } from "mobx"
import SampleProcess from "Sample/SampleProcess"

export type Params = {
  id?: number
  name: string
  audioDataIds: number[]
  offsetX?: number
  scaleX?: number
}

interface Sample extends SampleRecord {}

class Sample {
  static records = observable<Sample>([])

  id!: number
  @observable name: string
  @observable audioDataIds: number[]
  offsetX: number
  scaleX: number

  constructor({
    id,
    name,
    audioDataIds,
    offsetX = 0,
    scaleX = 1,
  }: Params) {
    if (id)
      this.id = id
    this.name = name
    this.audioDataIds = audioDataIds
    this.offsetX = offsetX
    this.scaleX = scaleX
  }

  static toJS({id, ...result}: Sample) {
    result.audioDataIds = toJS(result.audioDataIds)
    return result
  }

  static map = (records: SampleRecord[]) =>
    records.map(record => new Sample(record))

  @action static push = (record: Sample) =>
    Sample.records.push(record)

  @action static replaceRecords = (records: Sample[]) =>
    Sample.records.replace(records)

  @task.once static async fetch() {
    const records = await store.all()
    Sample.replaceRecords(Sample.map(records))
  }

  static get all() {
    this.fetch()
    return this.records
  }

  @task static create = async (params: Params) => {
    const record = new Sample(params)
    record.id = await store.put(Sample.toJS({ ...record }))
    Sample.push(record)
    return record
  }

  @task static update = async (id: number, params: Partial<SampleRecord>) => {
    const record = Sample.records.find(record => record.id === id)
    const value = { ...record, ...params } as Sample
    delete value.id
    await store.put(Sample.toJS(value), id)
    Object.assign(record, params)
  }

  static save = async (params: Partial<SampleRecord>) =>
    params.id ? Sample.update(params.id, params as SampleRecord) : Sample.create(params as SampleRecord)

  @task static remove = async (id: number) => {
    await store.delete(id)
    const record = Sample.records.find(record => record.id === id)
    if (record)
      Sample.records.remove(record)
  }

  @task.cached static getAudioData = async (id: number) => {
    const { arrayBuffer, sampleRate } = await audioDataStore.get(id)
    return new SampleProcess({ channelData: new Float32Array(arrayBuffer), sampleRate })
  }
}

export default Sample
