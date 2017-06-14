/* global localStorage */

import React from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import socket from '../../services/socket.js'

class NewWalletDialog extends React.Component {
  constructor() {
    super()

    this.submitWallet = this.submitWallet.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.cancel = this.cancel.bind(this)

    this.state = {
      address: '',
      password: ''
    }
  }

  submitWallet() {
    socket.emit('new wallet', {
      password: this.state.password,
      socketId: socket.id
    })
    localStorage.setItem('password', this.state.password)
    this.cancel()
  }

  setPassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  cancel() {
    this.setState({
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
        title="Жаңа Әмиян"
        open={this.props.open}
        actions={actions}
        contentStyle={{maxWidth: '450px'}}
        onRequestClose={this.props.close}
      >
        <p>Әмиянға Кілтсөз Ойлап Табыңыз:</p>
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

export default NewWalletDialog
