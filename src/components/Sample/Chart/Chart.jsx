import React from 'react'
import * as Material from "@material-ui/core/index";
import Chartix, { Zoom, Scroll } from 'chartix'

import MiddleLine from './MiddleLine'
import Wave from './Wave'
import ExpectedSelection from './ExpectedSelection'
import ZeroCrossing from './ZeroCrossing'

export default class Chart extends React.Component {
  ref = React.createRef()
  debounceMs = 100

  async componentDidMount() {
    const {sample} = this.props
    const chart = new Chartix({
      wrapper: this.ref.current, offsetX: sample.offsetX, scaleX: sample.scaleX
    })
    this.chart = chart
    chart.add(new Scroll())
    chart.add(new Zoom())
    chart.add(new MiddleLine())
    chart.events.addListener('scaleXChange', this.handleChange)
    chart.events.addListener('offsetXChange', this.handleChange)
    this.dispose = chart.start()
    chart.draw()

    const audioBuffer = await sample.audioContext.decodeAudioData(sample.arrayBuffer.slice(0))
    const channelData = audioBuffer.getChannelData(0)
    const {duration, sampleRate} = audioBuffer
    const wave = new Wave(channelData)
    chart.add(wave)
    chart.add(new ExpectedSelection({sample, duration}))
    chart.draw()

    this.zeroCrossing = new ZeroCrossing({wave, duration, channelData, sampleRate})
    chart.add(this.zeroCrossing)
    chart.draw()
  }

  handleChange = (e) => {
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() =>
      this.props.sample.update({
        scaleX: this.chart.scaleX,
        offsetX: this.chart.offsetX,
      })
    , this.debounceMs)
  }

  componentWillUnmount() {
    const {chart} = this
    chart.events.removeListener('scaleXChange', this.handleChange)
    chart.events.removeListener('offsetXChange', this.handleChange)
    this.dispose()
  }

  render() {
    return <Material.Box ref={this.ref} p={2}/>
  }
}
