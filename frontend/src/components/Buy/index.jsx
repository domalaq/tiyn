/* global localStorage */

import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import './index.css'
import socket from '../../services/socket'

class Buy extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      amount: '',
      amountTiyn: 0
    }

    this.buy = this.buy.bind(this)
    this.setAmount = this.setAmount.bind(this)
  }

  setAmount(e) {
    this.setState({
      amount: e.target.value,
      amountTiyn: Math.round(e.target.value / this.props.rate)
    })
  }

  buy() {
    socket.emit('buy', {
      amount: this.state.amount,
      from: localStorage.getItem('address'),
      socketId: socket.id,
      password: localStorage.getItem('password')
    })

    this.setState({
      amount: '',
      amountTiyn: 0
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
        <span> ~ {this.state.amountTiyn} TIYN</span>
        <br />
        <RaisedButton
          label="Жіберу"
          primary={true}
          onTouchTap={this.buy}
        />
      </div>
    )
  }
}

export default Buy
