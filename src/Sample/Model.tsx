import task from 'lib/task'
import { samples as store, SampleRecord } from "db"
import { observable, action } from "mobx"

export type CreateParams = Omit<SampleRecord, 'id'>

interface Sample extends SampleRecord {}

class Sample {
  @observable static records: Sample[] = []

  id!: number

  constructor({
    id,
    name,
    arrayBuffer,
  }: Omit<SampleRecord, 'id'> & { id?: number }) {
    if (id)
      this.id = id
    this.name = name
    this.arrayBuffer = arrayBuffer
  }

  static toJS({id, ...result}: Sample) {
    return result
  }

  @action static push = (record: Sample) =>
    Sample.records.push(record)

  @task static create = async (params: CreateParams) => {
    const record = new Sample(params)
    record.id = await store.put(Sample.toJS({ ...record }))
    Sample.push(record)
    return record
  }

  // static save = async (params: SampleRecord | CreateParams) => {
  //   'id' in params ? this.update(params) : this.create(params)
  // }
}

export default Sample
