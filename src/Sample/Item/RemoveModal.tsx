import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Sample from 'Sample/Model'

type Props = {
  sample: { id: number }
  onClose: () => void
}

export default function RemoveModal({sample: { id }, onClose}: Props) {
  const remove = () => Sample.remove(id)

  return <Dialog open={true} onClose={onClose}>
    <DialogTitle>Are you sure?</DialogTitle>
    <DialogActions>
      <Button autoFocus onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={remove} variant='contained'>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
}
