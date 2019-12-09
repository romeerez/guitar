import React from 'react'
import { observer } from 'mobx-react'

import SampleModel from '../../models/Sample'
import Item from './Item'
import Modal from './Modal/Modal'

export default observer(() =>
  <React.Fragment>
    {SampleModel.all.map((sample, i) => <Item key={i} sample={sample}/>)}
    <Modal/>
  </React.Fragment>
)
