pragma solidity ^0.4.8;

// Arithmetic library
library Arithmetic {
    function mul256By256(uint a, uint b)
        constant
        returns (uint ab32, uint ab1, uint ab0)
    {
        uint ahi = a >> 128;
        uint alo = a & 2**128-1;
        uint bhi = b >> 128;
        uint blo = b & 2**128-1;
        ab0 = alo * blo;
        ab1 = ((ahi * blo + alo * bhi) & 2**128-1) + (ab0 >> 128);
        ab32 = ahi * bhi + (ahi * blo >> 128) + (alo * bhi >> 128) + (ab1 >> 128);
        ab1 &= 2**128-1;
        ab0 &= 2**128-1;
    }

    // I adapted this from Fast Division of Large Integers by Karl Hasselström
    // Algorithm 3.4: Divide-and-conquer division (3 by 2)
    // Karl got it from Burnikel and Ziegler and the GMP lib implementation
    function div256_128By128_128(uint a21, uint a0, uint b, uint b1, uint b0)
        constant
        returns (uint q, uint r)
    {
        if(a21 >> 128 < b1) {
            q = a21 / b1;
            r = a21 % b1;
        } else {
            q = 2**128-1;
            r = a21 - (b1 << 128) + b1;
        }

        uint rsub = q * b0;

        if(r >= 2**128) {
            r = (r << 128) + a0 - rsub;
        } else {
            r = (r << 128) + a0;
            if(rsub > r) {
                q--;
                if(rsub >= b) {
                    rsub -= b;
                    if(rsub > r) {
                        q--;
                        rsub -= b;
                    }
                } else {
                    rsub -= b;
                }
            }
            r -= rsub;
        }
    }

    function overflowResistantFraction(uint a, uint b, uint divisor)
        returns (uint)
    {
        uint ab32_q1; uint ab1_r1; uint ab0;
        if(b <= 1 || b != 0 && a * b / b == a) {
            return a * b / divisor;
        } else {
            (ab32_q1, ab1_r1, ab0) = mul256By256(a, b);
            (a, b) = (divisor >> 128, divisor & 2**128-1);
            (ab32_q1, ab1_r1) = div256_128By128_128(ab32_q1, ab1_r1, divisor, a, b);
            (a, b) = div256_128By128_128(ab1_r1, ab0, divisor, a, b);
            return (ab32_q1 << 128) + a;
        }
    }
}
