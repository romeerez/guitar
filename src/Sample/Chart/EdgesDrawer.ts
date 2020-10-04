import SampleProcess from "Sample/SampleProcess"
import Component, { ComponentOptions } from "chartix/lib/component"
import Props from 'chartix'
import { findGreaterThanOrEqual, findLowerThanOrEqual } from "utils"

type Options = {
  sampleProcess: SampleProcess
  wave: {
    highFactor: number,
    from: number,
    to: number
  }
}

interface EdgesDrawer extends Options {}

class EdgesDrawer extends Component {
  length: number

  constructor({ wave, sampleProcess, ...options }: ComponentOptions & Options, items?: any[]) {
    super(options, items)
    this.sampleProcess = sampleProcess
    this.wave = wave
    this.length = sampleProcess.channelData.length
  }

  render({ctx, left, top, width, height, offsetX, scaleX}: Props) {
    const { highFactor, from, to } = this.wave
    const { edgeFrames, maxes, indices } = this.sampleProcess.zeroCrossings
    const start = findGreaterThanOrEqual(indices, from)
    const end = findGreaterThanOrEqual(indices, to)
    const pixelsPerValue = width * scaleX / this.length
    const offset = offsetX > 0 ? 0 : -offsetX

    ctx.beginPath()

    for (let i = start; i <= end; i++) {
      const frame = edgeFrames[i]
      const max = maxes[i]

      const x = left + offset + (frame - from) * pixelsPerValue
      const y = top + height / 2 - max * highFactor * height / 2
      ctx.moveTo(x, 0)
      ctx.lineTo(x, y)
      ctx.lineTo(x - 2, y - 3)
      ctx.moveTo(x, y)
      ctx.lineTo(x + 2, y - 3)
    }

    ctx.strokeStyle = 'rgba(255, 193, 7, .6)'
    ctx.stroke()

    return
  }
}

export default EdgesDrawer