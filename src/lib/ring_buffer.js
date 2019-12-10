export default class RingBuffer {
  constructor(len) {
    --len
    len |= len >> 1
    len |= len >> 2
    len |= len >> 4
    len |= len >> 8
    len |= len >> 16
    this.array = new Array(len + 1)
    this.mask = len
    this.pos = 0
    this.clear()
  }

  push(val) {
    this.pos--
    this.pos &= this.mask
    this.array[this.pos] = val
  }

  get(index) {
    return this.array[(this.pos + index) & this.mask]
  }

  set(index, value) {
    this.array[(this.pos + index) & this.mask] = value
  }

  clear() {
    this.array.fill(null)
  }
}
