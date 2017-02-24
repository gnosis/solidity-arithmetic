var BigNumber = require('bignumber.js');
BigNumber.config({
    ROUNDING_MODE: BigNumber.ROUND_FLOOR
});

let crypto = require('crypto');

function rand128BitBigNumber() {
    return new BigNumber(crypto.randomBytes(16).toString('hex'), 16);
}

function rand256BitBigNumber() {
    return new BigNumber(crypto.randomBytes(32).toString('hex'), 16);
}

var Arithmetic = artifacts.require("./Arithmetic.sol");
const pow2To256 = new BigNumber(2).pow(256),
    pow2To128 = new BigNumber(2).pow(128);

const numTimes = 100;

contract('Arithmetic', function(accounts) {
    it(`should calculate a * b correctly ${numTimes} times`, function() {
        return Arithmetic.deployed().then(function(instance) {
            return Promise.all([...Array(numTimes)].map(function() {
                var a = rand256BitBigNumber(),
                    b = rand256BitBigNumber();

                return instance.mul256By256.call(a, b).then(function(cvals) {
                    var res = a.times(b),
                        c = cvals[0].times(pow2To256).plus(cvals[1].times(pow2To128)).plus(cvals[2]);

                    assert(c.equals(res), `Contract value doesn't match BigNumber value:\n0x${c.toString(16)} !=\n0x${res.toString(16)}\nformat(\n 0x${a.toString(16)} *\n 0x${b.toString(16)}\n, '02x')`);
                });
            }));
        });
    });

    it(`should calculate a / b correctly ${numTimes} times`, function() {
        return Arithmetic.deployed().then(function(instance) {
            return Promise.all([...Array(numTimes)].map(function() {
                var a21 = rand256BitBigNumber(),
                    a0 = rand128BitBigNumber(),
                    b1 = rand128BitBigNumber(),
                    b0 = rand128BitBigNumber(),
                    a = a21.times(pow2To128).plus(a0),
                    b = b1.times(pow2To128).plus(b0);
                return instance.div256_128By128_128.call(a21, a0, b, b1, b0).then(function(qr) {
                    var resQ = a.divToInt(b),
                        resR = a.mod(b);
                    assert(qr[0].equals(resQ), `Contract value doesn't match BigNumber value:\n0x${qr[0].toString(16)} !=\n0x${resQ.toString(16)}\nformat(\n 0x${a.toString(16)} //\n 0x${b.toString(16)}\n, '02x')`);
                    assert(qr[1].equals(resR), `Contract value doesn't match BigNumber value:\n0x${qr[1].toString(16)} !=\n0x${resQ.toString(16)}\nformat(\n 0x${a.toString(16)} %\n 0x${b.toString(16)}\n, '02x')`);
                });
            }));
        });
    });

    it(`should calculate a * b / d correctly ${numTimes} times`, function() {
        return Arithmetic.deployed().then(function(instance) {
            return Promise.all([...Array(numTimes)].map(function() {
                var a = rand256BitBigNumber(),
                    b = rand256BitBigNumber(),
                    d = rand256BitBigNumber();
                return instance.overflowResistantFraction.call(a, b, d).then(function(c) {
                    var res = a.times(b).divToInt(d);
                    // gotta truncate res
                    res = res.sub(res.divToInt(pow2To256).mul(pow2To256));

                    assert(c.equals(res), `Contract value doesn't match BigNumber value:\n0x${c.toString(16)} !=\n0x${res.toString(16)}\nformat(\n 0x${a.toString(16)} *\n 0x${b.toString(16)} //\n 0x${d.toString(16)}\n, '02x')`);
                });
            }));
        });
    });
});
