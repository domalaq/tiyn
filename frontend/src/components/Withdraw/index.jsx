/* global localStorage */

import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import './index.css'
import socket from '../../services/socket'

class Withdraw extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      amount: ''
    }

    this.withdraw = this.withdraw.bind(this)
    this.setAmount = this.setAmount.bind(this)
  }

  setAmount(e) {
    this.setState({
      amount: e.target.value
    })
  }

  withdraw() {
    socket.emit('withdraw', {
      amount: this.state.amount,
      from: localStorage.getItem('address'),
      socketId: socket.id,
      password: localStorage.getItem('password')
    })

    this.setState({
      amount: ''
    })
  }

  render() {
    return (
      <div style={{marginLeft: '20px'}}>
        <p>ETH мәнін енгізіңіз</p>
        <TextField
          hintText="0.01"
          value={this.state.amount}
          onChange={this.setAmount}
          type="number"
        />
        <br />
        <RaisedButton
          label="Жіберу"
          primary={true}
          onTouchTap={this.withdraw}
        />
      </div>
    )
  }
}

export default Withdraw
