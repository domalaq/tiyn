/* global localStorage */

import React from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import socket from '../../services/socket'

class WalletCreatedDialog extends React.Component {
  constructor() {
    super()

    this.cancel = this.cancel.bind(this)

    this.state = {
      address: '',
      password: ''
    }
  }

  cancel() {
    if (localStorage.getItem('address') && localStorage.getItem('password')) {
      socket.emit('open wallet', {
        from: localStorage.getItem('address'),
        socketId: socket.id,
        password: localStorage.getItem('password')
      })
    }

    this.props.close()
  }

  render() {
    const actions = [
      <FlatButton
        label="Сақтап Қойдым"
        onTouchTap={this.cancel}
        primary={true}
      />
    ]

    return (
      <Dialog
        title="Әмиян Жасалды"
        open={this.props.open}
        actions={actions}
        contentStyle={{maxWidth: '450px'}}
        onRequestClose={this.props.close}
        modal={true}
      >
        <p>Әмиянның адресі мен кілтсөзін бір жерге сақтап қойыңыз. Жоғалса әмиянды аша алмай қаласыз.</p>
        <p>Адрес</p>
        <TextField
          hintText="0x4fe..."
          style={{width: '400px'}}
          value={this.props.address}
          name="wallet"
          disabled={true}
        />
        <p>Кілтсөз</p>
        <TextField
          style={{width: '400px'}}
          value={this.props.password}
          type="text"
          name="password"
          disabled={true}
        />
      </Dialog>
    )
  }
}

export default WalletCreatedDialog
