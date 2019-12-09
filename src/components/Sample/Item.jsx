import React from 'react'
import * as Material from "@material-ui/core";
import * as Icons from "@material-ui/icons";
import { styled, withStyles } from "@material-ui/core";

import Chart from './Chart/Chart'
import Menu from './Item/Menu'
import Tabs from './Item/Tabs'

const StyledExpansionPanelSummary = withStyles({
  content: {
    margin: '0 !important',
  }
})(Material.ExpansionPanelSummary);

const StyledExpansionPanelDetails = styled(Material.ExpansionPanelDetails)({
  display: 'block',
  padding: 0,
})

const stopPropagation = (e) => e.stopPropagation()

export default ({sample}) =>
  <Material.ExpansionPanel defaultExpanded>
    <StyledExpansionPanelSummary
      expandIcon={<Icons.ExpandMore/>}
    >
      <Material.Box p={2} style={{flexGrow: 1}}>
        {sample.name}
      </Material.Box>
      <Material.Box onClick={stopPropagation}>
        <Menu sample={sample}/>
      </Material.Box>
    </StyledExpansionPanelSummary>
    <StyledExpansionPanelDetails>
      <Material.Divider/>
      <Chart sample={sample}/>
      <Material.Divider/>
      <Tabs sample={sample}/>
    </StyledExpansionPanelDetails>
  </Material.ExpansionPanel>
