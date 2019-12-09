import React from 'react'
import * as Material from '@material-ui/core/index'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react/dist/mobx-react'

import SampleModel from '../../../models/Sample'
import ModalState from './state'

export default @observer
class Modal extends React.Component {
  @observable file

  @action handleNameChange = (e) => ModalState.model.name = e.target.value

  @action handleFileChange = async (e) => {
    this.file = e.target.files[0]
    ModalState.model.arrayBuffer = await this.file.arrayBuffer()
    // this.file = file
    // let source = audioContext.createBufferSource()
    // source.buffer = audioBuffer
    // source.connect(audioContext.destination)
    // source.start(0)
  }

  submit = () => {
    SampleModel.save(ModalState.model)
    ModalState.close()
  }

  render() {
    return <Material.Dialog open={ModalState.isOpen} onClose={ModalState.close}>
      <Material.DialogTitle>{ModalState.model.id ? 'Update' : 'Create'} New Sample</Material.DialogTitle>
      <Material.DialogContent>
        <Material.TextField
          autoFocus
          margin="dense"
          label="Sample Title"
          fullWidth
          value={ModalState.model.name}
          onChange={this.handleNameChange}
        />
        <Material.Box mt={1} mb={1}>
          <Material.Button variant='contained' component='label' fullWidth>
            {this.file ? this.file.name : 'Upload .wav'}
            <input type='file' hidden={true} onChange={this.handleFileChange}/>
          </Material.Button>
        </Material.Box>
      </Material.DialogContent>
      <Material.Divider />
      <Material.DialogActions>
        <Material.Button onClick={ModalState.close}>
          Cancel
        </Material.Button>
        <Material.Button variant='outlined' onClick={this.submit}>
          Save
        </Material.Button>
      </Material.DialogActions>
    </Material.Dialog>
  }
}

