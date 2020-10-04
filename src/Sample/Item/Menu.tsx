import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import MaterialMenu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import MoreVert from '@material-ui/icons/MoreVert'
import { observer } from "mobx-react"
import Sample from "Sample/Model"
import FormModal from "Sample/FormModal"
import RemoveModal from './RemoveModal'

type Props = {
  sample: Sample
}

export default observer(function Menu({sample}: Props) {
  const [menuAnchor, setMenuAnchor] = React.useState(null)
  const [editModal, setEditModal] = React.useState(false)
  const [removeModal, setRemoveModal] = React.useState(false)

  const openMenu = (e: any) => setMenuAnchor(e.target)
  const closeMenu = () => setMenuAnchor(null)
  const openEditModal = () => setEditModal(true)
  const closeEditModal = () => {
    setEditModal(false)
    closeMenu()
  }
  const toggleRemoveModal = () => setRemoveModal(!removeModal)

  return <>
    {editModal && <FormModal sample={sample} onClose={closeEditModal} />}
    {removeModal && <RemoveModal sample={sample} onClose={toggleRemoveModal} />}
    <IconButton onClick={openMenu}>
      <MoreVert/>
    </IconButton>
    <MaterialMenu
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
      anchorEl={menuAnchor}
      keepMounted
      open={Boolean(menuAnchor)}
      onClose={closeMenu}
    >
      <MenuItem onClick={openEditModal}>
        <ListItemIcon>
          <Edit fontSize='small'/>
        </ListItemIcon>
        <ListItemText primary='Edit'/>
      </MenuItem>
      <MenuItem onClick={toggleRemoveModal}>
        <ListItemIcon>
          <Delete fontSize='small'/>
        </ListItemIcon>
        <ListItemText primary='Delete'/>
      </MenuItem>
    </MaterialMenu>
  </>
})
