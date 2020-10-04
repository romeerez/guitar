import React from 'react'
import AppBar from "@material-ui/core/AppBar"
import Typography from "@material-ui/core/Typography"
import Toolbar from "@material-ui/core/Toolbar"
import Box from "@material-ui/core/Box"
import Fab from "@material-ui/core/Fab"
import Add from "@material-ui/icons/Add"
import UploadTracks from "Sample/UploadTracks"

export default ({children}: {children: React.ReactNode }) => {
  const [sampleModal, setSampleModal] = React.useState(false)

  return <div>
    {sampleModal && <UploadTracks onClose={() => setSampleModal(false)} />}
    <AppBar position="relative" color="secondary">
      <Toolbar>
        <Typography variant="h5">
          Audio Analizing Script Laboratory
        </Typography>
      </Toolbar>
      <Box style={{position: 'absolute', right: 0}} m={2} mt={4}>
        <Fab onClick={() => setSampleModal(true)} color="primary">
          <Add/>
        </Fab>
      </Box>
    </AppBar>
    <Box m={2}>{children}</Box>
  </div>
}
