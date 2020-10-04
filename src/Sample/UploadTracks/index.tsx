import React from 'react'
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers"
import { getAudioData } from "utils/audio"
import * as yup from 'yup'
import Sample from 'Sample/Model'
import { samples, audioData as audioDataStore } from "db"

(window as any).samples = samples

const fileNames = [
  'ableton_live_guitar_Campfire.wav',
  'ableton_live_guitar_Guitar_Open.wav',
  'ableton_live_guitar_Nylon_Concerto_Guitar.wav',
  'garageband_guitar_Acoustic_Guitar.wav',
  'garageband_guitar_Classic_Clean.wav',
  'garageband_guitar_Hard_Rock.wav',
]

const schema = yup.object().shape({
  files: yup.mixed().required('Choose files'),
  annotationsList: yup.mixed().required('Choose annotations'),
})

type Values = {
  files: FileList
  annotationsList: FileList
}

type Props = {
  onClose: () => void,
}

const orderFiles = (files: FileList) => fileNames.map(name => {
  for (let i = files.length - 1; i >= 0; i--) {
    if (files[i].name === name)
      return files[i]
  }
  alert('Incorrect files supplied')
  throw new Error('Incorrect files')
})

const fileToAudioData = async (file: any) => {
  const arrayBuffer = await file.arrayBuffer()
  const { channelData, sampleRate } = await getAudioData(arrayBuffer)
  return { channelData, sampleRate }
}

const readAsText = (file: File) => {
  const fileReader = new FileReader()
  const promise = new Promise<string>(resolve =>
    fileReader.onload = () => {
      resolve(fileReader.result as string)
    }
  )
  fileReader.readAsText(file)
  return promise
}

const parseAnnotations = (text: string) =>
  text.trim().split('\n').map(line => {
    const [from, to, chord] = line.trim().split(/\s+/)
    return { from: parseInt(from), to: parseInt(to), chord }
  })

export default function UploadTracks({onClose}: Props) {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async ({ files, annotationsList }: Values) => {
    const orderedFiles = orderFiles(files)
    const audioDataPromise = Promise.all(orderedFiles.map(fileToAudioData))
    const annotationsPromise = readAsText(annotationsList[0])
    const [audioData, annotationsText] = await Promise.all([audioDataPromise, annotationsPromise])
    const annotations = parseAnnotations(annotationsText)

    for (let { from, to, chord } of annotations) {
      const bytesPerElement = 4
      const ids = await Promise.all(audioData.map(async ({ channelData, sampleRate }) =>
        await audioDataStore.put({
          sampleRate,
          arrayBuffer: channelData.buffer.slice(from * sampleRate * bytesPerElement, to * sampleRate * bytesPerElement)
        })
      ))

      await Sample.create({
        name: chord,
        audioDataIds: ids,
      })

      console.log('Created:', chord)
    }

    onClose()
  }

  return <Dialog open={true} onClose={onClose}>
    <form onSubmit={handleSubmit<Values>(onSubmit)}>
      <DialogTitle>Upload all tracks</DialogTitle>
      <DialogContent>
        <Box mb={1}>
          <Button variant='contained' component='label' fullWidth>
            Upload files here
            <input ref={register} name='files' type='file' hidden multiple />
          </Button>
        </Box>
        <Box mb={1}>
          <Button variant='contained' component='label' fullWidth>
            Upload annotations file
            <input ref={register} name='annotationsList' type='file' hidden multiple />
          </Button>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button type='submit' variant='outlined'>
          Save
        </Button>
      </DialogActions>
    </form>
  </Dialog>
}
