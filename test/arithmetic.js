var BigNumber = require('bignumber.js');
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });

let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

function rand256BitBigNumber() {
    if(crypto) {
        return new BigNumber(crypto.randomBytes(32).toString('hex'), 16);
    }
}

var Arithmetic = artifacts.require("./Arithmetic.sol");

contract('Arithmetic', function(accounts) {
  for (var i = 1; i <= 10; i++) {
  it(`should calculate a * b / d correctly, try ${i}`, function() {
      var a = rand256BitBigNumber(), b = rand256BitBigNumber(), d = rand256BitBigNumber();
    return Arithmetic.deployed().then(function(instance) {
      return instance.overflowResistantFraction.call(a, b, d);
  }).then(function(c) {
      assert(c.equals( a.times(b).divToInt(d) ), `0x${c.toString(16)} != 0x${a.toString(16)} * 0x${b.toString(16)} / 0x${d.toString(16)}"`);
    });
  });
}
});
