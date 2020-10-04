import React from 'react'
import { observer } from "mobx-react"
import Sample from './Model'

export default observer(function Samples() {
  console.log(Sample.all.length)

  return null
})
