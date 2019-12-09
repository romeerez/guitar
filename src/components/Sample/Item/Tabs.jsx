import React from "react";
import * as Material from "@material-ui/core";
import { observer } from "mobx-react";

import ControlPanel from './ControlPanel'

export default @observer
class Tabs extends React.Component {
  handleTabChange = (e, value) => {
    const {sample} = this.props
    sample.update({tab: sample.tab === value ? 0 : value})
  }

  render() {
    const {sample, state} = this.props
    return <React.Fragment>
      <Material.Tabs value={sample.tab} onChange={this.handleTabChange}>
        <Material.Tab hidden />
        <Material.Tab label="Control Panel" />
      </Material.Tabs>
      <Material.Collapse in={sample.tab === 1}>
        <Material.Box p={3}>
          <ControlPanel sample={sample} state={state} />
        </Material.Box>
      </Material.Collapse>
    </React.Fragment>
  }
}
