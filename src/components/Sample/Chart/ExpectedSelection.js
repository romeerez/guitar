import {observe, intercept} from 'mobx'
import {RangeSelector} from "chartix"
import Expected from '../../../models/Expected'
import {xToSec, secToX} from './utils'

export default class ExpectedSelection {
  constructor({sample, duration}) {
    this.sample = sample
    this.duration = duration
    this.rangeSelector = new RangeSelector({interactive: sample.enablePitchSelection})
    this.expectedDisposes = []
  }

  start(chart) {
    this.chart = chart
    this.width = chart.width
    this.rangeSelector.start(chart)
    this.sample.expected.forEach(expected => {
      const selection = this.rangeSelector.addSelection({
        from: secToX(expected.from, this.duration, this.width),
        to: secToX(expected.to, this.duration, this.width)
      })
      selection.expected = expected
    })
    this.rangeSelector.events.bindListener(this, 'addSelection', this.handleAddSelection)
    this.rangeSelector.events.bindListener(this, 'resizeSelection', this.handleResizeSelection)
    this.rangeSelector.events.bindListener(this, 'resizeStopSelection', this.handleResizeStopSelection)
    this.rangeSelector.events.bindListener(this, 'removeSelection', this.handleRemoveSelection)
    this.dispose = observe(this.sample, this.handleSampleChange)
  }

  draw() {
    this.rangeSelector.draw()
  }

  stop() {
    this.rangeSelector.stop()
    this.expectedDisposes.forEach(dispose => dispose())
    this.dispose()
  }

  handleSampleChange = (e) => {
    if (e.type === 'update' && e.name === 'enablePitchSelection') {
      this.rangeSelector.interactive = this.sample[e.name]
      this.chart.draw()
    }
  }

  handleAddSelection = ({selection}) => {
    const prev = this.sample.expected[this.sample.expected.length - 1]
    let expected = new Expected({
      from: xToSec(selection.props.from, this.duration, this.width),
      to: xToSec(selection.props.to, this.duration, this.width),
      string: prev ? prev.string : 5,
      fret: prev ? prev.fret : 0,
    })
    this.sample.expected.push(expected)
    this.sample.save()
    selection.expected = expected
    this.expectedDisposes.push(intercept(expected, this.handleExpectedChange))
  }

  handleResizeSelection = ({selection}) => {
    const expected = selection.expected
    expected.from = xToSec(selection.from, this.duration, this.width)
    expected.to = xToSec(selection.to, this.duration, this.width)
  }

  handleResizeStopSelection = () => {
    this.sample.save()
  }

  handleRemoveSelection = ({selection}) => {
    this.sample.expected.remove(selection.expected)
    this.sample.save()
  }

  handleExpectedChange = (change) => {
    const {type, name, object, newValue} = change
    if (type === 'update') {
      if (name === 'from' || name === 'to') {
        const selection = this.rangeSelector.selections.find(selection => {
          return selection.expected === object
        })
        selection[name] = secToX(newValue, this.duration, this.width)
        selection.chart.draw()
      }
    }
    return change
  }
}
