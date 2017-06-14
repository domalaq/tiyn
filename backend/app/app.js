/* global require */

const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const winston = require('winston')
const Web3 = require('web3')
const BigNumber = require('bignumber.js')
const artifacts = require('../build/contracts/Tiyn.json')
const Tx = require('ethereumjs-tx')
const keythereum = require("keythereum")
const config = require('./config')

const tiynAddress = '0xcb1975eD7864f835012976Cd50E8bfB744612Eb4'
const provider = new Web3.providers.HttpProvider("http://localhost:8545")
const web3 = new Web3(provider)
const Tiyn = web3.eth.contract(artifacts.abi)
const tiyn = Tiyn.at(tiynAddress)
const events = tiyn.allEvents({fromBlock: 1077883, toBlock: 'latest'})

function cutAddress(addr) {
  return addr.substr(0, 6) + '...' + addr.substr(38, 4)
}

function sendEvent(err, res) {
  if (err) {
    return winston.error(err)
  }

  const buyer = res.args.buyer ? cutAddress(res.args.buyer) : null
  const seller = res.args.seller ? cutAddress(res.args.seller) : null
  const owner = res.args.owner ? cutAddress(res.args.owner) : null
  const admin = res.args.admin ? cutAddress(res.args.admin) : null
  const _from = res.args._from ? cutAddress(res.args._from) : null
  const _to = res.args._to ? cutAddress(res.args._to) : null

  const titles = {
    'Buy': `${buyer} әмияны ${res.args.value} TIYN cатып алды.`,
    'Sell': `${seller} әмияны ${res.args.value} TIYN сатты.`,
    'Rate': `Бағам жарияланды. 1 TIYN ~ ${res.args.rate} wei.`,
    'Owner': `${owner} әмияны ие болып тағайындалды.`,
    'Admin': `${admin} әмияны әкім болып тағайындалды.`,
    'NotAdmin': `${admin} әмияны әкім қызметінен босатылды.`,
    'Buyer': `${buyer} әмиянына сатып алуға рұқсат берілді.`,
    'NotBuyer': `${buyer} әмиянына сатып алуға тыйым салынды.`,
    'Seller': `${seller} әмиянына сатуға рұқсат берілді.`,
    'NotSeller': `${seller} әмиянына cатуға тыйым салынды.`,
    'Withdraw': `${owner} әмияны контракттан ${res.args.value} wei шығарып алды.`,
    'Transfer': `${_from} әмияны ${_to} әмиянына ${res.args._value} TIYN аударды.`
  }

  const formattedEvent = {
    blockDate: new Date(web3.eth.getBlock(res.blockNumber).timestamp * 1000),
    title: titles[res.event],
    transactionHash: res.transactionHash,
    link: `https://ropsten.etherscan.io/tx/${res.transactionHash}`
  }

  io.emit('contract event', formattedEvent)

  if (res.event === 'Rate') {
    emitRate()
  }
}

function getPrivateKey(msg) {
  const datadir = "/home/bakhtiar/tiyn/backend/"
  const keyObject = keythereum.importFromFile(msg.from, datadir)

  try {
    return keythereum.recover(msg.password, keyObject)
  } catch (e) {
    if (e.message === 'message authentication code mismatch' && msg.socketId) {
      io.to(msg.socketId).emit('notify', 'Кілтсөз сай келмеді.')
    }
    else {
      winston.error(e.message)
    }

    return null
  }
}

function openWallet(msg) {
  io.to(msg.socketId).emit('notify', 'Әмиян ашылуда...')

  if (getPrivateKey(msg)) {
    io.to(msg.socketId).emit('wallet opened', true)

    const owner = tiyn.owner.call()
    io.to(msg.socketId).emit('owner', owner === msg.from)

    const admin = tiyn.isAdmin.call(msg.from)
    io.to(msg.socketId).emit('admin', admin)

    const buyer = tiyn.isBuyer.call(msg.from)
    io.to(msg.socketId).emit('buyer', buyer)

    const seller = tiyn.isSeller.call(msg.from)
    io.to(msg.socketId).emit('seller', seller)

    emitBalanceEth(msg)
    emitBalanceTiyn(msg)
  }
}

function newWallet(msg) {
  io.to(msg.socketId).emit('notify', 'Жаңа Әмиян Жасалуда...')

  const dk = keythereum.create()

  const keyObject = keythereum.dump(msg.password, dk.privateKey, dk.salt, dk.iv)

  keythereum.exportToFile(keyObject)

  const address = `0x${keyObject.address}`
  io.to(msg.socketId).emit('wallet address', address)

  signAndSendTransaction(null, {
    from: config.ownerAddress,
    amountWei: new BigNumber(1).times('1e18'),
    password: config.ownerPassword
  }, address)

  setBuyer({
    buyer: address,
    from: config.adminAddress,
    password: config.adminPassword
  })
}

function signAndSendTransaction(data, msg, address) {
  const privateKey = getPrivateKey(msg)

  const nonce = web3.eth.getTransactionCount(msg.from)
  if (privateKey) {
    const hexValue = msg.amountWei ? web3.toHex(msg.amountWei) : '0x0'

    const rawTx = {
      nonce: web3.toHex(nonce),
      gasPrice: '0x4a817c800',
      gasLimit: '0x2dc6c0',
      to: address,
      value: hexValue,
      data: data ? data : '0x0'
    }

    const tx = new Tx(rawTx)
    tx.sign(privateKey)

    const serializedTx = tx.serialize()
    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
      if (err) {
        io.to(msg.socketId).emit('notify', err.message)
        return winston.error(err)
      }

      io.to(msg.socketId).emit('notify', hash + ' транзакциясы жіберілді')
    })
  }
}

function setOwner(msg) {
  const data = tiyn.setOwner.getData(msg.newOwner)
  signAndSendTransaction(data, msg, tiynAddress)
}

function setAdmin(msg) {
  const data = tiyn.setAdmin.getData(msg.admin)
  signAndSendTransaction(data, msg, tiynAddress)
}

function unsetAdmin(msg) {
  const data = tiyn.unsetAdmin.getData(msg.admin)
  signAndSendTransaction(data, msg, tiynAddress)
}

function setRate(msg) {
  const data = tiyn.setRate.getData(msg.rate)
  signAndSendTransaction(data, msg, tiynAddress)
}

function setBuyer(msg) {
  const data = tiyn.allowBuy.getData(msg.buyer)
  signAndSendTransaction(data, msg, tiynAddress)
}

function unsetBuyer(msg) {
  const data = tiyn.revokeBuy.getData(msg.buyer)
  signAndSendTransaction(data, msg, tiynAddress)
}

function setSeller(msg) {
  const data = tiyn.allowSell.getData(msg.seller)
  signAndSendTransaction(data, msg, tiynAddress)
}

function unsetSeller(msg) {
  const data = tiyn.revokeSell.getData(msg.seller)
  signAndSendTransaction(data, msg, tiynAddress)
}

function buy(msg) {
  msg.amountWei = new BigNumber(msg.amount).times('1e18')
  const data = tiyn.buy.getData()
  signAndSendTransaction(data, msg, tiynAddress)
}

function sell(msg) {
  const data = tiyn.sell.getData(msg.amount)
  signAndSendTransaction(data, msg, tiynAddress)
}

function transfer(msg) {
  const data = tiyn.transfer.getData(msg.to, msg.amount)
  signAndSendTransaction(data, msg, tiynAddress)
}

function withdraw(msg) {
  const wei = new BigNumber(msg.amount).times('1e18')
  const data = tiyn.withdraw.getData(wei)
  signAndSendTransaction(data, msg, tiynAddress)
}

function emitRate() {
  const rate = tiyn.rate.call()
  io.emit('rate', rate.div('1e18').toString(10))
}

function emitBalanceEth(msg) {
  const balanceEth = web3.eth.getBalance(msg.from)
  io.to(msg.socketId).emit('ether', balanceEth.div('1e18'))
}

function emitBalanceTiyn(msg) {
  const balanceTiyn = tiyn.balanceOf.call(msg.from)
  io.to(msg.socketId).emit('tiyn', balanceTiyn)
}

io.on('connection', function(socket) {
  events.watch(sendEvent)

  emitRate()

  socket.on('open wallet', openWallet)
  socket.on('new wallet', newWallet)
  socket.on('set owner', setOwner)
  socket.on('set admin', setAdmin)
  socket.on('unset admin', unsetAdmin)
  socket.on('set rate', setRate)
  socket.on('set buyer', setBuyer)
  socket.on('unset buyer', unsetBuyer)
  socket.on('set seller', setSeller)
  socket.on('unset seller', unsetSeller)
  socket.on('buy', buy)
  socket.on('sell', sell)
  socket.on('transfer', transfer)
  socket.on('withdraw', withdraw)
})

http.listen(3000, function() {
  winston.info('http is listening...')
})
