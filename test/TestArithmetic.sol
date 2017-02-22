pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Arithmetic.sol";

contract TestArithmetic {
    using Assert for *;

    function testOverflowResistantFraction() {
        // a * b / d = c
        uint a = 0xcafef00dcafef00dcafef00dcafef00dcafef00dcafef00dcafef00dcafef00d;
        uint b = 0xf7bdef7bdef7bdef7bdef7bdef7bdef7bdef7bdef7bdef7bdef7bdef7bde0000;
        uint c = 0xc47295bac47295bac47295bac47295bac47295bac47295bac47295bac47295ba;
        uint d = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000;

        c.equal(Arithmetic.overflowResistantFraction(a, b, d), "lolwut");
    }

}
