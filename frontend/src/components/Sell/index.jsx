/* global localStorage */

import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import './index.css'
import socket from '../../services/socket'

class Sell extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      amount: '',
      amountEth: 0
    }

    this.sell = this.sell.bind(this)
    this.setAmount = this.setAmount.bind(this)
  }

  setAmount(e) {
    this.setState({
      amount: e.target.value,
      amountEth: e.target.value * this.props.rate
    })
  }

  sell() {
    socket.emit('sell', {
      amount: this.state.amount,
      from: localStorage.getItem('address'),
      socketId: socket.id,
      password: localStorage.getItem('password')
    })

    this.setState({
      amount: '',
      amountEth: 0
    })
  }

  render() {
    return (
      <div style={{marginLeft: '20px'}}>
        <p>ETH мәнін енгізіңіз</p>
        <TextField
          hintText="100"
          value={this.state.amount}
          onChange={this.setAmount}
          type="number"
        />
        <span> ~ {this.state.amountEth} ETH</span>
        <br />
        <RaisedButton
          label="Жіберу"
          primary={true}
          onTouchTap={this.sell}
        />
      </div>
    )
  }
}

export default Sell
