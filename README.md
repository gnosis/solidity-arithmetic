# solidity-arithmetic
A solidity library for performing arithmetic.

## `library Arithmetic` API
```
function mul256By256(uint a, uint b)
    constant
    returns (uint ab32, uint ab1, uint ab0)
```
This function takes two unsigned 256-bit integers and multiplies them, returning
a 512-bit result split into a high 256-bit limb, a middle 128-bit limb, and a
low 128-bit limb.

```
function div256_128By256(uint a21, uint a0, uint b)
    constant
    returns (uint q, uint r)
```
This function takes a unsigned 384-bit integer and divides it by a 256-bit
integer, returning a high-bits truncated 256-bit quotient and a remainder. The
384-bit dividend is represented as a high 256-bit limb and a low 128-bit limb.

```
function overflowResistantFraction(uint a, uint b, uint divisor)
    returns (uint)
```
This function returns a 256-bit truncated `a * b / divisor`, where the division
is integer division. The overflow from `a * b` is handled in a 512-bit buffer,
so this method calculates the expression correctly for high values of `a` and `b`.
