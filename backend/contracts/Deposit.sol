// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";


contract Staking is ERC2771Context {
  address owner;
  mapping(bytes32 => address) public whitelistedTokens;
  mapping(address => mapping(bytes32 => uint256)) public accountBalances;

  constructor(MinimalForwarder forwarder) // Initialize trusted forwarder
    ERC2771Context(address(forwarder)) {
  }

  function whitelistToken(bytes32 symbol, address tokenAddress) external {
    require(_msgSender() == _msgSender(), 'This function is not public');

    whitelistedTokens[symbol] = tokenAddress;
  }

  function getWhitelistedTokenAddresses(bytes32 token) external returns(address) {
    return whitelistedTokens[token];
  }

  function depositTokens(uint256 amount, bytes32 symbol) external {
    accountBalances[_msgSender()][symbol] += amount;
    uint256 allowance = ERC20(whitelistedTokens[symbol]).allowance(_msgSender(), address(this));
    console.log("allowance", _msgSender(), _msgSender());
    ERC20(whitelistedTokens[symbol]).transferFrom(_msgSender(), address(this), amount);
  }

  function withdrawTokens(uint256 amount, bytes32 symbol) external {
    require(accountBalances[_msgSender()][symbol] >= amount, 'Insufficent funds');

    accountBalances[_msgSender()][symbol] -= amount;
    ERC20(whitelistedTokens[symbol]).transfer(_msgSender(), amount);
  }

    function _msgSender()
        internal
        view
        override(ERC2771Context)
        returns (address)
    {
        return ERC2771Context._msgSender();
    }
}