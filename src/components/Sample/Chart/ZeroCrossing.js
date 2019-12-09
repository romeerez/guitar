import zeroCrossing from '../../../lib/zero_crossing'
import notes, { quartytoneRatio } from '../../../lib/notes'
import {secToX} from './utils'

export default class ZeroCrossing {
  constructor({wave, duration, channelData, sampleRate}) {
    this.wave = wave
    this.duration = duration
    this.channelData = channelData
    this.sampleRate = sampleRate
    this.lineSize = 5
    this.lineWidth = 5
    this.color = '#ffc107'
  }

  start(chart) {
    this.chart = chart
    this.processed = false
    this.i = 0
    this.xValues = new Uint32Array(chart.width)
    this.yValues = new Float32Array(chart.width)
  }

  draw() {
    if (!this.processed) {
      this.processed = true
      const pushZeroCrossing = zeroCrossing(
        notes[0][0] / quartytoneRatio, -30, this.handleZeroCrossing
      )
      this.channelData.forEach(value => pushZeroCrossing(value))
    }
    const {context, offsetX, scaleX} = this.chart
    context.strokeStyle = this.color
    context.strokeWidth = this.lineWidth
    if (!this.path || this.path.offsetX !== offsetX || this.path.scaleX !== scaleX)
      this.path = this.createPath()
    context.stroke(this.path)
  }

  handleZeroCrossing = (frame, max) => {
    this.xValues[this.i] = frame
    this.yValues[this.i] = max
    this.i++
  }

  createPath() {
    const {chart, sampleRate, duration, lineSize} = this
    const {width, height, scaleX, offsetX} = chart
    const halfHeight = height / 2
    const multiplier = this.wave.highFactor * (halfHeight - this.wave.props.stretchOffset)

    const path = new Path2D()
    path.offsetX = offsetX
    path.scaleX = scaleX
    this.xValues.forEach((frame, i) => {
      const x = secToX(frame / sampleRate, duration, width) * scaleX - offsetX
      if (x >= 0 && x <= width) {
        const y = halfHeight - this.yValues[i] * multiplier
        path.moveTo(x - lineSize, y - lineSize)
        path.lineTo(x, y)
        path.lineTo(x + lineSize, y - lineSize)
      }
    })
    return path
  }
}
