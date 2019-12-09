import {observable, action} from "mobx";

class ModalStore {
  @observable isOpen = false
  @observable model = { name: '', arrayBuffer: null }

  @action close = () => this.isOpen = false
  @action new = () => {
    Object.assign(this.model, { name: '', arrayBuffer: null })
    this.isOpen = true
  }
  @action edit = (model) => {
    this.model.id = model.id
    this.model.name = model.name
    this.model.arrayBuffer = model.arrayBuffer
    this.isOpen = true
  }
}

export default new ModalStore()
