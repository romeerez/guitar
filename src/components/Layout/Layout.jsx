import React from 'react'
import * as Material from '@material-ui/core'
import CreateButton from '../../components/Sample/CreateButton'

export default ({children}) => {
  return <div>
    <Material.AppBar position="relative" color="secondary">
      <Material.Toolbar>
        <Material.Typography variant="h5">
          Audio Analizing Script Laboratory
        </Material.Typography>
      </Material.Toolbar>
      <Material.Box style={{position: 'absolute', right: 0}} m={2} mt={4}>
        <CreateButton/>
      </Material.Box>
    </Material.AppBar>
    <Material.Box m={2}>{children}</Material.Box>
  </div>
}
