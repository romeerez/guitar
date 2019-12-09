import { Wave } from 'chartix'

export default class AudioWave extends Wave {
  constructor(channelData) {
    super({
      values: channelData,
      stretch: true,
      stretchOffset: 5,
      fill: true,
      draw({context, height}, path) {
        context.strokeStyle = '#3F51B5'
        context.stroke(path)
        context.fillStyle = '#4050ad'
        context.fill(path)
        context.save()
        context.fillStyle = '#306bb8'
        context.translate(0, height / 2)
        context.scale(1, 0.66)
        context.translate(0, -height / 2)
        context.fill(path)
        context.fillStyle = '#2086c4'
        context.translate(0, height / 2)
        context.scale(1, 0.4)
        context.translate(0, -height / 2)
        context.fill(path)
        context.restore()
      }
    })
  }
}
