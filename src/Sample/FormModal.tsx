import React from 'react'
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Divider from "@material-ui/core/Divider"
import TextField from "@material-ui/core/TextField"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers'
import { object, string, mixed } from "yup"
import Sample from 'Sample/Model'

const schema = object().shape({
  name: string().required(),
  files: mixed().required('Choose file')
});

type Values = { name: string, files: FileList }

export default function Modal ({onClose}: {onClose: () => void}) {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async ({ name, files }: Values) => {
    const file = (files[0]) as any
    const arrayBuffer = await file.arrayBuffer()
    await Sample.create({ name, arrayBuffer })
    onClose()
  }

  return <Dialog open={true} onClose={onClose}>
    <form onSubmit={handleSubmit<Values>(onSubmit)}>
      <DialogTitle>{false ? 'Update' : 'Create'} New Sample</DialogTitle>
      <DialogContent>
        <TextField
          error={!!errors.name}
          helperText={errors.name?.message}
          inputRef={register}
          name='name'
          autoFocus
          margin="dense"
          label="Sample Title"
          fullWidth
        />
        <Box mt={1} mb={1}>
          <Button variant='contained' component='label' fullWidth>
            {false ? 'this.file.name' : 'Upload .wav'}
            <input ref={register} name='files' type='file' hidden={true} />
          </Button>
          {errors.file && <Box mt={1}>{errors.file.message}</Box>}
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={() => {}}>
          Cancel
        </Button>
        <Button type='submit' variant='outlined'>
          Save
        </Button>
      </DialogActions>
    </form>
  </Dialog>
}

