import { computed } from "mobx"
import zeroCrossing from "utils/zeroCrossing"
import { notes, quartytoneRatio } from 'utils/notes'

interface Props {
  channelData: Float32Array
  sampleRate: number
}

interface SampleProcess extends Props {}

class SampleProcess {
  constructor({ channelData, sampleRate }: Props) {
    this.channelData = channelData
    this.sampleRate = sampleRate
  }

  @computed get zeroCrossings() {
    const { channelData } = this
    const edgeFrames: number[] = []
    const maxes: number[] = []
    const indices: number[] = []
    let index: number = 0
    const process = zeroCrossing(
      notes[0][0] / quartytoneRatio,
      -30,
      (edgeFrame, max) => {
        edgeFrames.push(edgeFrame)
        maxes.push(max)
        indices.push(index)
      }
    )
    const len = channelData.length
    for (; index < len; index++)
      process(channelData[index])

    return { edgeFrames, maxes, indices }
  }
}

export default SampleProcess