import React from 'react'
import {observable} from "mobx";
import {observer} from "mobx-react";
import * as Material from "@material-ui/core";
import * as Icons from "@material-ui/icons";

import ModalState from "../Modal/state";

export default @observer
class Menu extends React.Component {
  @observable menuAnchor = null
  @observable confirmDialogOpen = false

  handleMenuOpenClick = (e) => this.menuAnchor = e.target
  closeMenu = () => this.menuAnchor = null
  toggleConfirmDialog = () => this.confirmDialogOpen = !this.confirmDialogOpen

  edit = () => {
    const {sample} = this.props
    ModalState.edit(sample)
  }

  delete = () => {
    const {sample} = this.props
    sample.delete()
    this.toggleConfirmDialog()
  }

  render() {
    return <React.Fragment>
      <Material.IconButton onClick={this.handleMenuOpenClick}>
        <Icons.MoreVert/>
      </Material.IconButton>
      <Material.Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorEl={this.menuAnchor}
        keepMounted
        open={Boolean(this.menuAnchor)}
        onClose={this.closeMenu}
      >
        <Material.MenuItem onClick={this.edit}>
          <Material.ListItemIcon>
            <Icons.Edit fontSize="small"/>
          </Material.ListItemIcon>
          <Material.ListItemText primary="Edit"/>
        </Material.MenuItem>
        <Material.MenuItem onClick={this.toggleConfirmDialog}>
          <Material.ListItemIcon>
            <Icons.Delete fontSize="small"/>
          </Material.ListItemIcon>
          <Material.ListItemText primary="Delete"/>
        </Material.MenuItem>
      </Material.Menu>
      <Material.Dialog
        open={this.confirmDialogOpen}
        onClose={this.toggleConfirmDialog}
      >
        <Material.DialogTitle>Are you sure?</Material.DialogTitle>
        <Material.DialogActions>
          <Material.Button autoFocus onClick={this.toggleConfirmDialog}>
            Cancel
          </Material.Button>
          <Material.Button onClick={this.delete} variant='contained'>
            Delete
          </Material.Button>
        </Material.DialogActions>
      </Material.Dialog>
    </React.Fragment>
  }
}
