import React from "react";
import * as Material from "@material-ui/core";
import { observer } from "mobx-react";
import notes from '../../../lib/notes'

const NumberField = observer((props) =>
  <Material.TextField {...props} value={props.expected[props.name]} type='number' inputProps={{step: 0.0001}} />
)

export default @observer
class Expected extends React.Component {
  onChange = (e) => {
    let value = e.target.value
    if (value === undefined) value = e.target.selected
    const {expected} = this.props
    expected[e.target.name] = +value
  }

  render() {
    const {expected, number} = this.props
    return <Material.Box alignContent='center' m={2}>
      <Material.Paper>
        <Material.Box p={2}>
          <Material.Typography color="textSecondary" gutterBottom>#{number + 1}</Material.Typography>
          <Material.Grid container justify='center' direction='row'>
            <Material.Box display='inline-block' p={2}>
              <NumberField label='Time From' name='from' expected={expected} onChange={this.onChange} />
            </Material.Box>
            <Material.Box display='inline-block' p={2}>
              <NumberField label='Time To' name='to' expected={expected} onChange={this.onChange} />
            </Material.Box>
            <Material.Box display='inline-block' p={2}>
              <Material.FormControl>
                <Material.InputLabel shrink>String</Material.InputLabel>
                <Material.Select name='string' onChange={this.onChange} value={expected.string}>
                  {notes.map((_string, i) =>
                    <Material.MenuItem key={i} value={i}>{i + 1}</Material.MenuItem>
                  )}
                </Material.Select>
              </Material.FormControl>
            </Material.Box>
            <Material.Box display='inline-block' p={2}>
              <Material.FormControl>
                <Material.InputLabel shrink>Fret</Material.InputLabel>
                <Material.Select name='fret' onChange={this.onChange} value={expected.fret}>
                  {notes[5].map((_fret, i) =>
                    <Material.MenuItem key={i} value={i}>{i}</Material.MenuItem>
                  )}
                </Material.Select>
              </Material.FormControl>
            </Material.Box>
            <Material.Box display='inline-block' p={2}>
              <NumberField label='Frequency' name='frequency' expected={expected} onChange={this.onChange} />
            </Material.Box>
          </Material.Grid>
        </Material.Box>
      </Material.Paper>
    </Material.Box>
  }
}
