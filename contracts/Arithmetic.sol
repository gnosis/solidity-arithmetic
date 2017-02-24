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
        ab1 = (ab0 >> 128) + (ahi * blo & 2**128-1) + (alo * bhi & 2**128-1);
        ab32 = (ab1 >> 128) + ahi * bhi + (ahi * blo >> 128) + (alo * bhi >> 128);
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
        uint qhi = (a21 / b) << 128;
        a21 %= b;

        uint rhi;
        if(a21 >> 128 < b1) {
            q = a21 / b1;
            rhi = a21 % b1;
        } else {
            q = 2**128-1;
            rhi = a21 - (b1 << 128) + b1;
        }

        uint rsub0 = (q & 2**128-1) * b0;
        uint rsub21 = (q >> 128) * b0 + (rsub0 >> 128);
        rsub0 &= 2**128-1;

        while(rsub21 > rhi || rsub21 == rhi && rsub0 > a0) {
            q--;
            a0 += b0;
            rhi += b1 + (a0 >> 128);
            a0 &= 2**128-1;
        }

        q += qhi;
        r = ((rhi - rsub21) << 128) + a0 - rsub0;
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
