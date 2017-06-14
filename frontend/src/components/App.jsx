/* global localStorage */

import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

import Events from './Events'
import OpenWalletDialog from './OpenWalletDialog'
import NewWalletDialog from './NewWalletDialog'
import WalletCreatedDialog from './WalletCreatedDialog'
import Wallet from './Wallet'
import './App.css'
import socket from '../services/socket'

injectTapEventPlugin()

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      openDialog: false,
      newDialog: false,
      walletCreatedDialog: false,
      walletOpen: false,
      rate: 0,
      openSnackbar: false,
      message: '',
      address: '',
      password: ''
    }

    this.showOpenWalletDialog = this.showOpenWalletDialog.bind(this)
    this.hideOpenWalletDialog = this.hideOpenWalletDialog.bind(this)
    this.showNewWalletDialog = this.showNewWalletDialog.bind(this)
    this.hideNewWalletDialog = this.hideNewWalletDialog.bind(this)
    this._showWalletCreatedDialog = this._showWalletCreatedDialog.bind(this)
    this.hideWalletCreatedDialog = this.hideWalletCreatedDialog.bind(this)
    this._openWallet = this._openWallet.bind(this)
    this._setRate = this._setRate.bind(this)
    this._notify = this._notify.bind(this)
    this.closeWallet = this.closeWallet.bind(this)
    this.closeSnackbar = this.closeSnackbar.bind(this)
  }

  componentDidMount() {
    socket.on('connect', function () {
      if (localStorage.getItem('address') && localStorage.getItem('password')) {
        socket.emit('open wallet', {
          from: localStorage.getItem('address'),
          socketId: socket.id,
          password: localStorage.getItem('password')
        })
      }
    })

    socket.on('wallet opened', this._openWallet)
    socket.on('wallet address', this._showWalletCreatedDialog)
    socket.on('rate', this._setRate)
    socket.on('notify', this._notify)
  }

  _openWallet() {
    this.setState({
      address: localStorage.getItem('address'),
      walletOpen: true
    })
  }

  _setRate(msg) {
    this.setState({
      rate: msg
    })
  }

  _showWrongPassword() {
    this.setState({
      message: 'Кілтсөз сай келмеді.',
      openSnackbar: true
    })
  }

  _notify(msg) {
    this.setState({
      message: msg,
      openSnackbar: true
    })
  }

  showOpenWalletDialog() {
    this.setState({openDialog: true})
  }

  hideOpenWalletDialog() {
    this.setState({openDialog: false})
  }

  showNewWalletDialog() {
    this.setState({newDialog: true})
  }

  hideNewWalletDialog() {
    this.setState({newDialog: false})
  }

  _showWalletCreatedDialog(address) {
    localStorage.setItem('address', address)

    this.setState({
      address: address,
      password: localStorage.getItem('password'),
      walletCreatedDialog: true
    })
  }

  hideWalletCreatedDialog() {
    this.setState({walletCreatedDialog: false})
  }

  closeWallet() {
    this.setState({
      walletOpen: false
    })
    localStorage.removeItem('address')
    localStorage.removeItem('password')
  }

  closeSnackbar() {
    this.setState({
      openSnackbar: false,
      message: ''
    })
  }

  render() {
    const NotLogged = () => (
      <IconMenu
        iconButtonElement={
          <IconButton><MoreVertIcon color="white" /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Жаңа Әмиян" onTouchTap={this.showNewWalletDialog} />
        <MenuItem primaryText="Әмиянды Ашу" onTouchTap={this.showOpenWalletDialog} />
      </IconMenu>
    )

    const iconElementRight = this.state.walletOpen ? <FlatButton label="Жабу" onTouchTap={this.closeWallet} /> : <NotLogged />


    return (
      <MuiThemeProvider>
        <div className="root">
          <AppBar
            title="Tiyn (testnet)"
            iconElementRight={iconElementRight}
            showMenuIconButton={false}
          />

          <p style={{marginLeft: '20px'}}>Бағам: 1 TIYN ~ {this.state.rate} ETH</p>

          <OpenWalletDialog open={this.state.openDialog} close={this.hideOpenWalletDialog} />
          <NewWalletDialog open={this.state.newDialog} close={this.hideNewWalletDialog} />
          <WalletCreatedDialog open={this.state.walletCreatedDialog} close={this.hideWalletCreatedDialog} address={this.state.address} password={this.state.password} />

          {
            this.state.walletOpen ?
            <Wallet rate={this.state.rate} /> :
            <h2 style={{marginLeft: '20px', marginTop: '50px'}}>Қош келдіңіз!</h2>
          }

          <Events />

          <Snackbar
            open={this.state.openSnackbar}
            message={this.state.message}
            autoHideDuration={3000}
            onRequestClose={this.closeSnackbar}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
