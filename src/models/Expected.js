import {observable} from 'mobx'
import notes from '../lib/notes'

export default class Expected {
  @observable from
  @observable to
  @observable string
  @observable fret

  constructor({from, to, string, fret}) {
    this.from = from
    this.to = to
    this.string = string
    this.fret = fret
  }

  get frequency() {
    return notes[this.string][this.fret]
  }

  set frequency(newValue) {
    const current = this.frequency
    let {string, fret} = this
    if (newValue > current) {
      if (!notes[string][++fret]) {
        if (!notes[--string]) return
        fret = 0
      }
    } else if (newValue < current) {
      if (!notes[string][--fret]) {
        if (!notes[++string]) return
        fret = notes[string].length - 1
      }
    }
    this.string = string
    this.fret = fret
  }
}
