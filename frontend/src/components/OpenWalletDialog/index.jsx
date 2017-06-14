/* global localStorage */

import React from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import socket from '../../services/socket.js'

class OpenWalletDialog extends React.Component {
  constructor() {
    super()

    this.submitWallet = this.submitWallet.bind(this)
    this.setAddress = this.setAddress.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.cancel = this.cancel.bind(this)

    this.state = {
      address: '',
      password: ''
    }
  }

  submitWallet() {
    socket.emit('open wallet', {
      from: this.state.address,
      password: this.state.password,
      socketId: socket.id
    })
    localStorage.setItem('address', this.state.address)
    localStorage.setItem('password', this.state.password)
    this.cancel()
  }

  setAddress(e) {
    this.setState({
      address: e.target.value
    })
  }

  setPassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  cancel() {
    this.setState({
      address: '',
      password: ''
    })
    this.props.close()
  }

  render() {
    const actions = [
      <FlatButton
        label="Жіберу"
        primary={true}
        onTouchTap={this.submitWallet}
      />,
      <FlatButton
        label="Болдырмау"
        onTouchTap={this.cancel}
      />
    ]

    return (
      <Dialog
        title="Әмиянді Ашу"
        open={this.props.open}
        actions={actions}
        contentStyle={{maxWidth: '450px'}}
        onRequestClose={this.props.close}
      >
        <p>Әмиянның адресін енгізіңіз</p>
        <TextField
          hintText="0x4fe..."
          style={{width: '400px'}}
          value={this.state.address}
          onChange={this.setAddress}
          name="wallet"
        />
        <p>Кілтсөз</p>
        <TextField
          style={{width: '400px'}}
          value={this.state.password}
          onChange={this.setPassword}
          type="password"
          name="password"
        />
      </Dialog>
    )
  }
}

export default OpenWalletDialog
