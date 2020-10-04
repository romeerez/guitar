export const audioContext = new AudioContext()

export const getAudioData = async (arrayBuffer: ArrayBuffer) => {
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  const {duration, sampleRate} = audioBuffer
  const channelData = audioBuffer.getChannelData(0)
  return { channelData, duration, sampleRate }
}

export const decibelToFloat = (db: number) => -Math.pow(10, db / 20)
