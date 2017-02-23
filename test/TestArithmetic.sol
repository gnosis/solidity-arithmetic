pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Arithmetic.sol";

contract TestArithmetic {
    using Assert for *;

    uint constant a = 0xcafef00dcafef00dcafef00dcafef00dcafef00dcafef00dcafef00dcafef00d;
    uint constant b = 0xf7bdef7bdef7bdef7bdef7bdef7bdef7bdef7bdef7bdef7bdef7bdef7bde0000;

    function testMul256By256() {
        var (ab32, ab1, ab0) = Arithmetic.mul256By256(a, b);
        ab32.equal(0xc47295bac47295bac47295bac47295bac47295bac47295bac47295bac471d147, "high 256 bits of product wrong");
        ab1.equal(0x6a453b8d6a453b8d6a453b8d6a453b8d, "next 128 bits of product wrong");
        ab0.equal(0x6a453b8d6a453b8d6a453b8d6a460000, "low 128 bits of product wrong");
    }

    function testMul256By256MaxValues() {
        var (ab32, ab1, ab0) = Arithmetic.mul256By256(2**256-1, 2**256-1);
        ab32.equal(2**256-2, "high 256 bits of max product wrong");
        ab1.equal(0, "next 128 bits of max product wrong");
        ab0.equal(1, "low 128 bits of max product wrong");
    }

    function testOverflowResistantFraction() {
        // a * b / d = c
        uint c = 0xc47295bac47295bac47295bac47295bac47295bac47295bac47295bac47295ba;
        uint d = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000;

        c.equal(Arithmetic.overflowResistantFraction(a, b, d), "lolwut");
    }

}
