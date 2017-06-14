/* global localStorage */

import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import './index.css'
import socket from '../../services/socket'

class SetAdmin extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      adminAddress: '',
      notAdminAddress: ''
    }

    this.setAdmin = this.setAdmin.bind(this)
    this.unsetAdmin = this.unsetAdmin.bind(this)
    this.setAdminAddress = this.setAdminAddress.bind(this)
    this.setNotAdminAddress = this.setNotAdminAddress.bind(this)
  }

  setAdminAddress(e) {
    this.setState({
      adminAddress: e.target.value
    })
  }

  setNotAdminAddress(e) {
    this.setState({
      notAdminAddress: e.target.value
    })
  }

  setAdmin() {
    socket.emit('set admin', {
      admin: this.state.adminAddress,
      from: localStorage.getItem('address'),
      socketId: socket.id,
      password: localStorage.getItem('password')
    })
    this.setState({
      adminAddress: ''
    })
  }

  unsetAdmin() {
    socket.emit('unset admin', {
      admin: this.state.notAdminAddress,
      from: localStorage.getItem('address'),
      socketId: socket.id,
      password: localStorage.getItem('password')
    })
    this.setState({
      notAdminAddress: ''
    })
  }

  render() {
    return (
      <div className="set-admin">
        <div style={{marginLeft: '20px'}}>
          <p>Әкімді қою</p>
          <TextField
            hintText="0x4fe..."
            value={this.state.adminAddress}
            onChange={this.setAdminAddress}
            style={{width: '400px'}}
          />
          <br />
          <RaisedButton
            label="Жіберу"
            primary={true}
            onTouchTap={this.setAdmin}
          />
        </div>
        <div style={{marginLeft: '90px'}}>
          <p>Әкімнен түсіру</p>
          <TextField
            hintText="0x4fe..."
            value={this.state.notAdminAddress}
            onChange={this.setNotAdminAddress}
            style={{width: '400px'}}
          />
          <br />
          <RaisedButton
            label="Жіберу"
            primary={true}
            onTouchTap={this.unsetAdmin}
          />
        </div>
      </div>
    )
  }
}

export default SetAdmin
