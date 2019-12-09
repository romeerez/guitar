const decibelToFloat = (db) => -Math.pow(10, db / 20)

export default (lowestFrequency, hysteresisDb, callback) => {
  const thresholdMin = 0.5 * decibelToFloat(hysteresisDb)
  const thresholdMax = -thresholdMin
  let up = false
  let frame = 0
  let edgeFrame = 0
  let min = 0
  let max = 0
  let wave = 1

  return (sample) => {
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
