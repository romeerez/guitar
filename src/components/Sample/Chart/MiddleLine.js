export default class MiddleLine {
  start(chart) {
    this.context = chart.context
    this.zeroLinePath = new Path2D()
    this.zeroLinePath.moveTo(0, chart.height / 2 + 0.5)
    this.zeroLinePath.lineTo(chart.width, chart.height / 2 + 0.5)
  }

  draw() {
    this.context.strokeStyle = 'rgba(255, 255, 255, 0.12)'
    this.context.stroke(this.zeroLinePath)
  }
}
