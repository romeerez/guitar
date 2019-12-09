import React from "react";
import * as Material from "@material-ui/core";
import { observer } from "mobx-react";

import Expected from './Expected'

export default @observer
class Tabs extends React.Component {
  handleCheckboxChange = (e) => {
    const {sample} = this.props
    sample.update({[e.target.name]: e.target.checked})
  }

  render() {
    const {sample} = this.props
    return <React.Fragment>
      <Material.Grid container justify='center' direction='row'>
        <Material.FormControlLabel
          control={
            <Material.Checkbox
              checked={sample.enablePitchSelection}
              name='enablePitchSelection'
              onChange={this.handleCheckboxChange}
              color='primary'
            />
          }
          label="Select Pitches"
        />
      </Material.Grid>
      {sample.expected.map((expected, i) => <Expected key={i} expected={expected} number={i} />)}
    </React.Fragment>
  }
}
