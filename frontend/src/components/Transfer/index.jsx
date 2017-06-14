/* global localStorage */

import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import './index.css'
import socket from '../../services/socket'

class Transfer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      address: '',
      amount: ''
    }

    this.transfer = this.transfer.bind(this)
    this.setAmount = this.setAmount.bind(this)
    this.setAddress = this.setAddress.bind(this)
  }

  setAmount(e) {
    this.setState({
      amount: e.target.value
    })
  }

  setAddress(e) {
    this.setState({
      address: e.target.value
    })
  }

  transfer() {
    socket.emit('transfer', {
      to: this.state.address,
      amount: this.state.amount,
      from: localStorage.getItem('address'),
      socketId: socket.id,
      password: localStorage.getItem('password')
    })

    this.setState({
      amount: '',
      address: ''
    })
  }

  render() {
    return (
      <div style={{marginLeft: '20px'}}>
        <p>Қабылдаушы әмияны</p>
        <TextField
          hintText="0x4fe..."
          value={this.state.address}
          onChange={this.setAddress}
          style={{width: '400px'}}
        />
        <p>TIYN мәнін енгізіңіз</p>
        <TextField
          hintText="100"
          value={this.state.amount}
          onChange={this.setAmount}
          type="number"
          style={{width: '400px'}}
        />
        <br />
        <RaisedButton
          label="Жіберу"
          primary={true}
          onTouchTap={this.transfer}
        />
      </div>
    )
  }
}

export default Transfer
