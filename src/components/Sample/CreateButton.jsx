import React from 'react'
import * as Material from "@material-ui/core";
import * as Icon from "@material-ui/icons";
import ModalState from './Modal/state'

export default () => {
  return <React.Fragment>
    <Material.Fab onClick={ModalState.new} color="primary">
      <Icon.Add/>
    </Material.Fab>
  </React.Fragment>
}
