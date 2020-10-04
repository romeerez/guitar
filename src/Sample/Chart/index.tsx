import React from 'react'
import Sample from 'Sample/Model'
import Box from '@material-ui/core/Box'
import Wave from "chartix/lib/wave"
import Chartix from "chartix";
import Axis from "chartix/lib/axis"
import Line from 'chartix/lib/line'
import { debounce } from 'utils'
import EdgesDrawer from "Sample/Chart/EdgesDrawer"

const waveColor = '#2086c4'
const textColor = '#fff'

type Props = {
  sample: Sample
}

export default function Chart({ sample }: Props) {
  const ref = React.useRef(null)

  const initChart = async () => {
    const sampleProcess = await Sample.getAudioData(sample.audioDataIds[0])
    const duration = 2

    const top = 7
    const left = 50
    const right = 15
    const bottom = 24

    const wave = new Wave({data: sampleProcess.channelData, stretch: true, style: {
      strokeStyle: waveColor, top, left, right, bottom
    }})

    const chart = new Chartix({
      wrapper: ref.current as unknown as HTMLElement,
      offsetX: sample.offsetX,
      scaleX: sample.scaleX,
    }, [
      new Line({
        fromY: 0.5,
        toY: 0.5,
        color: 'rgba(255, 255, 255, .3)',
        style: { top, left, right, bottom }
      }),
      wave,
      new Axis({
        side: 'left',
        from: -1,
        to: 1,
        value: (value) => value > 0 ? value / wave.highFactor : value / wave.lowFactor,
        targetSize: 25,
        textSize: 40,
        space: 10,
        color: textColor,
        style: { top, right, bottom, left: 15 }
      }),
      new Axis({
        side: 'bottom',
        to: duration,
        targetSize: 30,
        color: textColor,
        style: {
          left: 50,
          right: 15,
        }
      }),
      new EdgesDrawer({ wave, sampleProcess, style: {
        top, left, right, bottom
      }})
    ]);

    chart.events.addListener('offsetXChange', debounce(({ offsetX }: { offsetX: number }) => {
      Sample.update(sample.id, {offsetX})
    }, 300))

    chart.events.addListener('scaleXChange', debounce(({ scaleX }: { scaleX: number }) => {
      Sample.update(sample.id, {scaleX})
    }, 300))
  }

  React.useEffect(() => { initChart() }, [])

  return <Box p={2}>
    <div style={{height: '300px'}} ref={ref}/>
  </Box>
}
