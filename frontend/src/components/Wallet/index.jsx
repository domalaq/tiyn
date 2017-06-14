/* global localStorage */

import React from 'react'
import SetAdmin from '../SetAdmin'
import SetBuyer from '../SetBuyer'
import SetSeller from '../SetSeller'
import SetOwner from '../SetOwner'
import SetRate from '../SetRate'
import Buy from '../Buy'
import Sell from '../Sell'
import Transfer from '../Transfer'
import Withdraw from '../Withdraw'
import {Tabs, Tab} from 'material-ui/Tabs'
import socket from '../../services/socket'

class Wallet extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      owner: false,
      admin: false,
      buyer: false,
      seller: false,
      balanceEth: 0,
      balanceTiyn: 0
    }

    this._setOwner = this._setOwner.bind(this)
    this._setAdmin = this._setAdmin.bind(this)
    this._setBuyer = this._setBuyer.bind(this)
    this._setSeller = this._setSeller.bind(this)
    this._setBalanceEth = this._setBalanceEth.bind(this)
    this._setBalanceTiyn = this._setBalanceTiyn.bind(this)
  }

  _setOwner(msg) {
    this.setState({
      owner: msg
    })
  }

  _setAdmin(msg) {
    this.setState({
      admin: msg
    })
  }

  _setBuyer(msg) {
    this.setState({
      buyer: msg
    })
  }

  _setSeller(msg) {
    this.setState({
      seller: msg
    })
  }

  _setBalanceEth(msg) {
    this.setState({
      balanceEth: msg
    })
  }

  _setBalanceTiyn(msg) {
    this.setState({
      balanceTiyn: msg
    })
  }

  componentDidMount() {
    socket.on('owner', this._setOwner)
    socket.on('admin', this._setAdmin)
    socket.on('buyer', this._setBuyer)
    socket.on('seller', this._setSeller)
    socket.on('ether', this._setBalanceEth)
    socket.on('tiyn', this._setBalanceTiyn)
  }

  componentWillUnmount() {
    socket.off('owner')
    socket.off('admin')
    socket.off('buyer')
    socket.off('seller')
    socket.off('ether')
    socket.off('tiyn')
  }

  render() {
    return (
      <div>
        <p style={{marginLeft: '20px'}}>Теңгерім ({localStorage.getItem('address')}):</p>
        <p style={{marginLeft: '20px'}}>{this.state.balanceEth} ETH</p>
        <p style={{marginLeft: '20px'}}>{this.state.balanceTiyn} TIYN</p>

        <Tabs>
          {
            this.state.owner ?
            <Tab label="Әкімді Басқару">
              <SetAdmin />
            </Tab>
            : null
          }

          {
            this.state.admin ?
            <Tab label="Бағам Жариялау">
              <SetRate />
            </Tab>
            : null
          }

          {
            this.state.admin ?
            <Tab label="Сатып Алуды Басқару">
              <SetBuyer />
            </Tab>
            : null
          }

          {
            this.state.admin ?
            <Tab label="Сатуды Басқару">
              <SetSeller />
            </Tab>
            : null
          }

          {
            this.state.buyer ?
            <Tab label="Сатып Алу">
              <Buy rate={this.props.rate} />
            </Tab>
            : null
          }

          {
            this.state.seller ?
            <Tab label="Сату">
              <Sell rate={this.props.rate} />
            </Tab>
            : null
          }

          <Tab label="Аудару">
            <Transfer />
          </Tab>

          {
            this.state.owner ?
            <Tab label="Шығарып алу">
              <Withdraw />
            </Tab>
            : null
          }

          {
            this.state.owner ?
            <Tab label="Ие Тағайындау">
              <SetOwner closeWallet={this.closeWallet} />
            </Tab>
            : null
          }
        </Tabs>
      </div>
    )
  }
}

export default Wallet
