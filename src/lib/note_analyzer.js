import RingBuffer from './ring_buffer'

export default class NoteAnalyzer {
  constructor({
    note,
    sampleRate,
    notesInWindow = 3,
    windowWidth = ~~(sampleRate / note) * notesInWindow,
    bufferSize = 32
  }) {
    this.windowWidth = windowWidth
    this.ringBuffer = new RingBuffer(bufferSize)
  }

  addEdge(pos, edge) {
    this.pos = pos
    this.cutRingBufferToWindow()
  }

  cutRingBufferToWindow() {
    const len = this.ringBuffer.length
    for (let i = 0; i < len; i++) {
      const item = this.ringBuffer.get(i)
      if (!item) break

      const width = this.pos - item.pos
      if (width > this.windowWidth) {
        this.ringBuffer.set(i, null)
        break
      }
    }
  }
}
