/* global localStorage */

import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import socket from '../../services/socket'
import './index.css'

class SetBuyer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      buyerAddress: '',
      notBuyerAddress: ''
    }

    this.setBuyer = this.setBuyer.bind(this)
    this.unsetBuyer = this.unsetBuyer.bind(this)
    this.setBuyerAddress = this.setBuyerAddress.bind(this)
    this.setNotBuyerAddress = this.setNotBuyerAddress.bind(this)
  }

  setBuyerAddress(e) {
    this.setState({
      buyerAddress: e.target.value
    })
  }

  setNotBuyerAddress(e) {
    this.setState({
      notBuyerAddress: e.target.value
    })
  }

  setBuyer() {
    socket.emit('set buyer', {
      buyer: this.state.buyerAddress,
      from: localStorage.getItem('address'),
      socketId: socket.id,
      password: localStorage.getItem('password')
    })
    this.setState({
      buyerAddress: ''
    })
  }

  unsetBuyer() {
    socket.emit('unset buyer', {
      buyer: this.state.notBuyerAddress,
      from: localStorage.getItem('address'),
      socketId: socket.id,
      password: localStorage.getItem('password')
    })
    this.setState({
      notBuyerAddress: ''
    })
  }

  render() {
    return (
      <div className="set-buyer">
        <div style={{marginLeft: '20px'}}>
          <p>Сатып алуға рұқсат беру</p>
          <TextField
            hintText="0x4fe..."
            value={this.state.buyerAddress}
            onChange={this.setBuyerAddress}
            style={{width: '400px'}}
          />
          <br />
          <RaisedButton
            label="Жіберу"
            primary={true}
            onTouchTap={this.setBuyer}
          />
        </div>
        <div style={{marginLeft: '90px'}}>
          <p>Сатып алуға тыйым салу</p>
          <TextField
            hintText="0x4fe..."
            value={this.state.notBuyerAddress}
            onChange={this.setNotBuyerAddress}
            style={{width: '400px'}}
          />
          <br />
          <RaisedButton
            label="Жіберу"
            primary={true}
            onTouchTap={this.unsetBuyer}
          />
        </div>
      </div>
    )
  }
}

export default SetBuyer
