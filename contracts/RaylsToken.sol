// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RaylsToken
 * @dev ERC20 token with mint (owner only), burn, and ownership - for Rayls QA Challenge.
 */
contract RaylsToken is ERC20, ERC20Burnable, Ownable {
  constructor() ERC20("Rayls Token", "RAYLS") {}

  function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
  }
}
