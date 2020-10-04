import React from 'react'
import { observer } from "mobx-react"
import Sample from './Model'
import Item from './Item'

export default observer(function List() {
  // const samples = Sample.all
  // const sample = samples[samples.length - 1]
  // if (!sample) return null
  //
  // const arrayBuffer = sample.arrayBuffers[0]
  // const sampleRate = 44100
  // const audioBuffer = new AudioBuffer({
  //   length: 2 * sampleRate,
  //   numberOfChannels: 1,
  //   sampleRate,
  // })
  // audioBuffer.copyToChannel(new Float32Array(arrayBuffer), 0)
  // const source = audioContext.createBufferSource()
  // source.buffer = audioBuffer
  // source.connect(audioContext.destination)
  // source.start()

  const samples = Sample.all
  if (samples.length === 0) return null

  const Emaj = samples[0]
  const Gmaj = samples[3]

  return <>
    {[Emaj].map((sample, i) =>
      <Item key={i} sample={sample} />
    )}
  </>
})
