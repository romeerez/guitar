import React from 'react'
import Sample from 'Sample/Model'
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import Box from '@material-ui/core/Box'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Divider from '@material-ui/core/Divider'
import styled from "@material-ui/core/styles/styled"
import withStyles from "@material-ui/core/styles/withStyles"
import { observer } from "mobx-react"

const StyledExpansionPanelSummary = withStyles({
  content: {
    margin: '0 !important',
  }
})(ExpansionPanelSummary)

const StyledExpansionPanelDetails = styled(ExpansionPanelDetails)({
  display: 'block',
  padding: 0,
})

const stopPropagation = (e: any) => e.stopPropagation()

type Props = {
  sample: Sample
}

export default observer(function Item({sample}: Props) {
  return <ExpansionPanel defaultExpanded>
    <StyledExpansionPanelSummary
      expandIcon={<ExpandMore />}
    >
      <Box p={2} style={{flexGrow: 1}}>
        {sample.name}
      </Box>
      <Box onClick={stopPropagation}>
        menu
      </Box>
    </StyledExpansionPanelSummary>
    <StyledExpansionPanelDetails>
      <Divider/>
      Chart
    </StyledExpansionPanelDetails>
  </ExpansionPanel>
})
