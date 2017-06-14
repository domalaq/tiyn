/* global localStorage */

import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import './index.css'
import socket from '../../services/socket'

class SetRate extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      rate: ''
    }

    this.setRate = this.setRate.bind(this)
    this.setRateValue = this.setRateValue.bind(this)
  }

  setRateValue(e) {
    this.setState({
      rate: e.target.value
    })
  }

  setRate() {
    socket.emit('set rate', {
      rate: this.state.rate,
      from: localStorage.getItem('address'),
      socketId: socket.id,
      password: localStorage.getItem('password')
    })

    this.setState({
      rate: ''
    })
  }

  render() {
    return (
      <div style={{marginLeft: '20px'}}>
        <p>Бағамның мәнін енгізіңіз</p>
        <TextField
          hintText="3025000"
          value={this.state.rate}
          onChange={this.setRateValue}
          type="number"
        />
        <br />
        <RaisedButton
          label="Жіберу"
          primary={true}
          onTouchTap={this.setRate}
        />
      </div>
    )
  }
}

export default SetRate
