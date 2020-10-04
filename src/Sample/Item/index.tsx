import React from 'react'
import Sample from 'Sample/Model'
import Accordion from "@material-ui/core/Accordion"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import Box from '@material-ui/core/Box'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Divider from '@material-ui/core/Divider'
import styled from "@material-ui/core/styles/styled"
import withStyles from "@material-ui/core/styles/withStyles"
import Menu from './Menu'
import { observer } from "mobx-react"
import Chart from 'Sample/Chart'

const StyledExpansionPanelSummary = withStyles({
  content: {
    margin: '0 !important',
  }
})(AccordionSummary)

const StyledExpansionPanelDetails = styled(AccordionDetails)({
  display: 'block',
  padding: 0,
})

const stopPropagation = (e: any) => e.stopPropagation()

type Props = {
  sample: Sample
}

export default observer(function Item({sample}: Props) {
  return <Accordion defaultExpanded>
    <StyledExpansionPanelSummary
      expandIcon={<ExpandMore />}
    >
      <Box p={2} style={{flexGrow: 1}}>
        {sample.name}
      </Box>
      <Box onClick={stopPropagation}>
        <Menu sample={sample} />
      </Box>
    </StyledExpansionPanelSummary>
    <StyledExpansionPanelDetails>
      <Divider/>
      <Chart sample={sample} />
    </StyledExpansionPanelDetails>
  </Accordion>
})
