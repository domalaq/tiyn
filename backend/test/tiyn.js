/* global artifacts, contract, it, assert */

const Tiyn = artifacts.require('./Tiyn.sol')

contract('Tiyn', function (accounts) {
  let tiyn
  let contractBalance

  it('should not change owner by not owner', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.setOwner(accounts[2], {from: accounts[1]})
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Owner changed')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(true)
    })
  })

  it('should change owner by owner', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      tiyn = instance
      return tiyn.setOwner(accounts[1], {from: accounts[0]})
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Owner not changed')
      return tiyn.owner.call()
    })
    .then(function (res) {
      assert.equal(res, accounts[1], 'New owner address doesn\'t match')
      return tiyn.setOwner(accounts[0], {from: accounts[1]})
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Owner not changed')
      return tiyn.owner.call()
    })
    .then(function (res) {
      assert.equal(res, accounts[0], 'New owner address doesn\'t match')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(false)
    })
  })

  it('should not set admin by not owner', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.setAdmin(accounts[2], {from: accounts[1]})
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Admin set')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(true)
    })
  })

  it('should set admin by owner', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      tiyn = instance
      return tiyn.setAdmin(accounts[1], {from: accounts[0]})
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Admin not set')
      return tiyn.isAdmin.call(accounts[1])
    })
    .then(function (res) {
      assert.ok(res, 'Address is still not admin')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(false)
    })
  })

  it('should not unset admin by not owner', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.unsetAdmin(accounts[1], {from: accounts[1]})
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Admin unset')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(true)
    })
  })

  it('should unset admin by owner', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      tiyn = instance
      return tiyn.setAdmin(accounts[2], {from: accounts[0]})
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Admin not set')
      return tiyn.isAdmin.call(accounts[2])
    })
    .then(function (res) {
      assert.ok(res, 'Address is still not admin')
      return tiyn.unsetAdmin(accounts[2], {from: accounts[0]})
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Admin not unset')
      return tiyn.isAdmin.call(accounts[2])
    })
    .then(function (res) {
      assert.ok(!res, 'Address is still admin')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(false)
    })
  })

  it('should not set rate by not admin', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.setRate(30, {from: accounts[2]})
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Rate set')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(true)
    })
  })

  it('should set rate by admin', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      tiyn = instance
      return tiyn.setRate(30, {from: accounts[1]})
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Rate not set')
      return tiyn.rate.call()
    })
    .then(function (res) {
      assert.equal(res.toNumber(), 30, 'Rate is wrong')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(false)
    })
  })

  it('should not allow buy by not admin', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.allowBuy(accounts[2], {from: accounts[2]})
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Buy allowed')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(true)
    })
  })

  it('should allow buy by admin', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      tiyn = instance
      return tiyn.allowBuy(accounts[2], {from: accounts[1]})
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Buy not allowed')
      return tiyn.isBuyer.call(accounts[2])
    })
    .then(function (res) {
      assert.ok(res, 'Address is not buyer')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(false)
    })
  })

  it('should not revoke buy by not admin', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.revokeBuy(accounts[2], {from: accounts[2]})
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Buy revoked')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(true)
    })
  })

  it('should revoke buy by admin', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      tiyn = instance
      return tiyn.allowBuy(accounts[3], {from: accounts[1]})
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Buy not allowed')
      return tiyn.isBuyer.call(accounts[3])
    })
    .then(function (res) {
      assert.ok(res, 'Address is still not buyer')
      return tiyn.revokeBuy(accounts[3], {from: accounts[1]})
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Buy not revoked')
      return tiyn.isBuyer.call(accounts[3])
    })
    .then(function (res) {
      assert.ok(!res, 'Address is still buyer')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(false)
    })
  })

  it('should not allow sell by not admin', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.allowSell(accounts[2], {from: accounts[2]})
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Sell allowed')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(true)
    })
  })

  it('should allow sell by admin', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      tiyn = instance
      return tiyn.allowSell(accounts[2], {from: accounts[1]})
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Sell not allowed')
      return tiyn.isSeller.call(accounts[2])
    })
    .then(function (res) {
      assert.ok(res, 'Address is not seller')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(false)
    })
  })

  it('should not revoke sell by not admin', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.revokeSell(accounts[2], {from: accounts[2]})
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Sell revoked')
    })
    .catch(function (err) {
      console.log(err)
      assert.ok(true)
    })
  })

  it('should revoke sell by admin', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      tiyn = instance
      return tiyn.allowSell(accounts[3], {from: accounts[1]})
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Sell not allowed')
      return tiyn.isSeller.call(accounts[3])
    })
    .then(function (res) {
      assert.ok(res, 'Address is still not seller')
      return tiyn.revokeSell(accounts[3], {from: accounts[1]})
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Sell not revoked')
      return tiyn.isSeller.call(accounts[3])
    })
    .then(function (res) {
      assert.ok(!res, 'Address is still seller')
    })
    .catch(function (err) {
      console.log(err);
      assert.ok(false)
    })
  })

  it('should not buy by non buyer', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.buy({
        from: accounts[3],
        value: 300
      })
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Non buyer could buy')
    })
    .catch(function (err) {
      console.log(err);
      assert.ok(true)
    })
  })

  it('should not buy if value is less than rate', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.buy({
        from: accounts[2],
        value: 10
      })
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Could buy with value smaller than rate')
    })
    .catch(function (err) {
      console.log(err);
      assert.ok(false)
    })
  })

  it('should buy by buyer', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      tiyn = instance
      contractBalance = web3.eth.getBalance(tiyn.address).toNumber()
      return tiyn.buy({
        from: accounts[2],
        value: 300
      })
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Buyer could not buy')
      return tiyn.balanceOf.call(accounts[2])
    })
    .then(function (res) {
      assert.equal(res.toNumber(), 10, 'Balance of buyer is not right')
      return tiyn.totalSupply.call()
    })
    .then(function (res) {
      assert.equal(res.toNumber(), 10, 'Total supply is not right')
      assert.equal(web3.eth.getBalance(tiyn.address).toNumber(), contractBalance + 300, 'Contract balance is not right')
    })
    .catch(function (err) {
      console.log(err);
      assert.ok(false)
    })
  })

  it('should not sell by non seller', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.sell(5, {
        from: accounts[3]
      })
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Non seller could sell')
    })
    .catch(function (err) {
      console.log(err);
      assert.ok(true)
    })
  })

  it('should not sell zero amount', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.sell(0, {
        from: accounts[2]
      })
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Zero amount sold')
    })
    .catch(function (err) {
      console.log(err);
      assert.ok(false)
    })
  })

  it('should not sell amount bigger than seller balance', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.sell(20, {
        from: accounts[2]
      })
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Amount more than balance sold')
    })
    .catch(function (err) {
      console.log(err);
      assert.ok(false)
    })
  })

  it('should not sell amount bigger than contract balance', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.sell(20, {
        from: accounts[2]
      })
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Amount bigger than contract balance sold')
    })
    .catch(function (err) {
      console.log(err);
      assert.ok(false)
    })
  })

  it('should sell by seller', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      tiyn = instance
      contractBalance = web3.eth.getBalance(tiyn.address).toNumber()

      return tiyn.sell(5, {
        from: accounts[2]
      })
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Seller could not sell')
      return tiyn.balanceOf.call(accounts[2])
    })
    .then(function (res) {
      assert.equal(res.toNumber(), 5, 'Balance of seller is not right')
      return tiyn.totalSupply.call()
    })
    .then(function (res) {
      assert.equal(res.toNumber(), 5, 'Total supply is not right')
      assert.equal(web3.eth.getBalance(tiyn.address).toNumber(), contractBalance - 150, 'Contract balance is not right')
    })
    .catch(function (err) {
      console.log(err);
      assert.ok(false)
    })
  })

  it('should not withdraw by non owner', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.withdraw(15, {
        from: accounts[1]
      })
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Non owner could withdraw')
    })
    .catch(function (err) {
      console.log(err);
      assert.ok(true)
    })
  })

  it('should not withdraw zero amount', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.withdraw(0, {
        from: accounts[0]
      })
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Zero amount withdrawn')
    })
    .catch(function (err) {
      console.log(err);
      assert.ok(true)
    })
  })

  it('should not withdraw more than contract balance', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      return instance.withdraw(50000, {
        from: accounts[0]
      })
    })
    .then(function (res) {
      assert.ok(res.logs.length === 0, 'Amount more than contract balance withdrawn')
    })
    .catch(function (err) {
      console.log(err);
      assert.ok(true)
    })
  })

  it('should withdraw by owner', function () {
    return Tiyn.deployed()
    .then(function (instance) {
      tiyn = instance
      contractBalance = web3.eth.getBalance(tiyn.address).toNumber()

      return tiyn.withdraw(15, {
        from: accounts[0]
      })
    })
    .then(function (res) {
      assert.ok(res.logs.length > 0, 'Owner could not withdraw')
      assert.equal(web3.eth.getBalance(tiyn.address).toNumber(), contractBalance - 15, 'Contract balance is different from expected after withdraw')
    })
    .catch(function (err) {
      console.log(err);
      assert.ok(true)
    })
  })
})
