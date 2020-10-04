import { decibelToFloat } from "utils/audio"

export default (lowestFrequency: number, hysteresisDb: number, callback: (edgeFrame: number, max: number) => void) => {
  const thresholdMin = 0.5 * decibelToFloat(hysteresisDb)
  const thresholdMax = -thresholdMin
  let up = false
  let frame = 0
  let edgeFrame = 0
  let min = 0
  let max = 0
  let wave = 1

  return (sample: number) => {
    if (sample > thresholdMax) {
      if (!up)
        up = true
      if (max < sample) {
        max = sample
        edgeFrame = frame
      }
    } else if (sample < thresholdMin) {
      if (up) {
        up = false
        if (max > thresholdMax && min < thresholdMin) {
          callback(edgeFrame, max)
          wave++
        }
        min = max = 0
        edgeFrame = -1
      }
      if (min > sample)
        min = sample
    }
    frame++
  }
}
