import {observable} from 'mobx'

export default class Model {
  @observable static records = []

  static map = (records) => records.map((record) => new this(record))

  constructor({id, ...props}) {
    Object.assign(this, props)
  }
}
