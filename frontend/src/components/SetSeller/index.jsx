/* global localStorage */

import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import './index.css'
import socket from '../../services/socket'

class SetSeller extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      sellerAddress: '',
      notSellerAddress: ''
    }

    this.setSeller = this.setSeller.bind(this)
    this.unsetSeller = this.unsetSeller.bind(this)
    this.setSellerAddress = this.setSellerAddress.bind(this)
    this.setNotSellerAddress = this.setNotSellerAddress.bind(this)
  }

  setSellerAddress(e) {
    this.setState({
      sellerAddress: e.target.value
    })
  }

  setNotSellerAddress(e) {
    this.setState({
      notSellerAddress: e.target.value
    })
  }

  setSeller() {
    socket.emit('set seller', {
      seller: this.state.sellerAddress,
      from: localStorage.getItem('address'),
      socketId: socket.id,
      password: localStorage.getItem('password')
    })
    this.setState({
      sellerAddress: ''
    })
  }

  unsetSeller() {
    socket.emit('unset seller', {
      seller: this.state.notSellerAddress,
      from: localStorage.getItem('address'),
      socketId: socket.id,
      password: localStorage.getItem('password')
    })
    this.setState({
      notSellerAddress: ''
    })
  }

  render() {
    return (
      <div className="set-seller">
        <div style={{marginLeft: '20px'}}>
          <p>Сату рұқсатын беру</p>
          <TextField
            hintText="0x4fe..."
            value={this.state.sellerAddress}
            onChange={this.setSellerAddress}
            style={{width: '400px'}}
          />
          <br />
          <RaisedButton
            label="Жіберу"
            primary={true}
            onTouchTap={this.setSeller}
          />
        </div>
        <div style={{marginLeft: '90px'}}>
          <p>Сатуға тыйым салу</p>
          <TextField
            hintText="0x4fe..."
            value={this.state.notSellerAddress}
            onChange={this.setNotSellerAddress}
            style={{width: '400px'}}
          />
          <br />
          <RaisedButton
            label="Жіберу"
            primary={true}
            onTouchTap={this.unsetSeller}
          />
        </div>
      </div>
    )
  }
}

export default SetSeller
