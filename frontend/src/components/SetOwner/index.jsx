/* global localStorage */

import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import socket from '../../services/socket'

class SetOwner extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      address: ''
    }

    this.setAddress = this.setAddress.bind(this)
    this.setOwner = this.setOwner.bind(this)
  }

  setAddress(e) {
    this.setState({
      address: e.target.value
    })
  }

  setOwner() {
    socket.emit('set owner', {
      newOwner: this.state.address,
      from: localStorage.getItem('address'),
      socketId: socket.id,
      password: localStorage.getItem('password')
    })
    this.setState({
      address: ''
    })
    this.props.closeWallet()
  }

  render() {
    return (
      <div style={{marginLeft: '20px'}}>
        <p>Жаңа иенің адресін енгізіңіз</p>
        <TextField
          hintText="0x4fe..."
          value={this.state.address}
          onChange={this.setAddress}
          style={{width: '400px'}}
        />
        <br />
        <RaisedButton
          label="Жіберу"
          primary={true}
          onTouchTap={this.setOwner}
        />
      </div>
    )
  }
}

export default SetOwner
