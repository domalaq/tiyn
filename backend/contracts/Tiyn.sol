import "./StandardToken.sol";

pragma solidity ^0.4.10;

contract Tiyn is StandardToken {
  function () {
    throw;
  }

  string public name = 'Tiyn';
  uint8 public decimals = 0;
  string public symbol = 'TIYN';
  string public version = '0.1';
  uint256 public rate;
  address public owner;
  mapping (address => bool) admins;
  mapping (address => bool) buyers;
  mapping (address => bool) sellers;

  function Tiyn() {
    owner = msg.sender;
  }

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  modifier onlyAdmin {
    require(admins[msg.sender]);
    _;
  }

  modifier onlyBuyer {
    require(buyers[msg.sender]);
    _;
  }

  modifier onlySeller {
    require(sellers[msg.sender]);
    _;
  }

  function setOwner(address _owner) onlyOwner returns (bool success) {
    owner = _owner;
    Owner(_owner);
    return true;
  }

  function setAdmin(address _admin) onlyOwner returns (bool success) {
    admins[_admin] = true;
    Admin(_admin);
    return true;
  }

  function unsetAdmin(address _admin) onlyOwner returns (bool success) {
    admins[_admin] = false;
    NotAdmin(_admin);
    return true;
  }

  function setRate(uint256 _rate) onlyAdmin returns (bool success) {
    rate = _rate;
    Rate(_rate);
    return true;
  }

  function isAdmin(address _admin) constant returns (bool admin) {
      return admins[_admin];
  }

  function isBuyer(address _buyer) constant returns (bool buyer) {
      return buyers[_buyer];
  }

  function isSeller(address _seller) constant returns (bool seller) {
      return sellers[_seller];
  }

  function buy() payable onlyBuyer returns (bool success) {
    uint256 sum = msg.value / rate;
    if (msg.value >= rate && balances[msg.sender] + sum > balances[msg.sender]) {
      balances[msg.sender] += sum;
      totalSupply += sum;
      Buy(msg.sender, sum);
      return true;
    }
    else {
      return false;
    }
  }

  function sell(uint256 _amount) onlySeller returns (bool success) {
    uint256 sum = _amount * rate;

    if (_amount > 0 && balances[msg.sender] >= _amount && sum <= this.balance) {
      balances[msg.sender] -= _amount;
      totalSupply -= _amount;
      msg.sender.transfer(sum);
      Sell(msg.sender, _amount);
      return true;
    }
    else {
      return false;
    }
  }

  function withdraw(uint256 _sum) onlyOwner returns (bool success) {
    if (_sum > 0 && _sum <= this.balance) {
      msg.sender.transfer(_sum);
      Withdraw(msg.sender, _sum);
      return true;
    }
    else {
      return false;
    }
  }

  function allowBuy(address _buyer) onlyAdmin returns (bool success) {
    buyers[_buyer] = true;
    Buyer(_buyer);
    return true;
  }

  function revokeBuy(address _buyer) onlyAdmin returns (bool success) {
    buyers[_buyer] = false;
    NotBuyer(_buyer);
    return true;
  }

  function allowSell(address _seller) onlyAdmin returns (bool success) {
    sellers[_seller] = true;
    Seller(_seller);
    return true;
  }

  function revokeSell(address _seller) onlyAdmin returns (bool success) {
    sellers[_seller] = false;
    NotSeller(_seller);
    return true;
  }

  event Rate(uint256 indexed rate);
  event Owner(address indexed owner);
  event Admin(address indexed admin);
  event NotAdmin(address indexed admin);
  event Buyer(address indexed buyer);
  event NotBuyer(address indexed buyer);
  event Seller(address indexed seller);
  event NotSeller(address indexed seller);
  event Buy(address indexed buyer, uint256 value);
  event Sell(address indexed seller, uint256 value);
  event Withdraw(address indexed owner, uint256 value);
}
