var BigNumber = require('bignumber.js');
BigNumber.config({
    ROUNDING_MODE: BigNumber.ROUND_FLOOR
});

let crypto = require('crypto');

var Arithmetic = artifacts.require("./Arithmetic.sol");
const pow2To256 = new BigNumber(2).pow(256),
    pow2To128 = new BigNumber(2).pow(128);

function randBigNumber(numBytes) {
    return new BigNumber(crypto.randomBytes(numBytes).toString('hex'), 16);
}

function truncate256(value) {
    return value.sub(value.divToInt(pow2To256).mul(pow2To256));
}

const numTimes = 100;

contract('Arithmetic', function(accounts) {
    it(`should calculate a * b correctly ${numTimes} times`, function() {
        return Arithmetic.deployed().then(function(instance) {
            return Promise.all([...Array(numTimes)].map(function(_, i) {
                var a = randBigNumber(32 - Math.floor(i/31)),
                    b = randBigNumber(32 - i%31);

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
            return Promise.all([...Array(numTimes)].map(function(_, i) {
                var a = randBigNumber(48 - Math.floor(i/47)),
                    a21 = a.divToInt(pow2To128),
                    a0 = a.sub(a21.mul(pow2To128)),
                    b = randBigNumber(32 - i%31);
                return instance.div256_128By256.call(a21, a0, b).then(function(qr) {
                    var resQ = truncate256(a.divToInt(b)),
                        resR = truncate256(a.mod(b));
                    assert(qr[0].equals(resQ), `Contract value doesn't match BigNumber value:\n0x${qr[0].toString(16)} !=\n0x${resQ.toString(16)}\nformat(\n 0x${a.toString(16)} //\n 0x${b.toString(16)}\n, '02x')`);
                    assert(qr[1].equals(resR), `Contract value doesn't match BigNumber value:\n0x${qr[1].toString(16)} !=\n0x${resQ.toString(16)}\nformat(\n 0x${a.toString(16)} %\n 0x${b.toString(16)}\n, '02x')`);
                });
            }));
        });
    });

    it(`should calculate a * b / d correctly ${numTimes} times`, function() {
        return Arithmetic.deployed().then(function(instance) {
            return Promise.all([...Array(numTimes)].map(function(_, i) {
                var a = randBigNumber(32 - Math.floor(i/31)),
                    b = randBigNumber(32 - i%31),
                    d = randBigNumber(32 - 2*(i%15));
                return instance.overflowResistantFraction.call(a, b, d).then(function(c) {
                    var res = truncate256(a.times(b).divToInt(d));

                    assert(c.equals(res), `Contract value doesn't match BigNumber value:\n0x${c.toString(16)} !=\n0x${res.toString(16)}\nformat(\n 0x${a.toString(16)} *\n 0x${b.toString(16)} //\n 0x${d.toString(16)}\n, '02x')`);
                });
            }));
        });
    });
});
