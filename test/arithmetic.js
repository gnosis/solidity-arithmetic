var Arithmetic = artifacts.require("./Arithmetic.sol");

contract('Arithmetic', function(accounts) {
  it("should calculate a * b / d correctly", function() {
    return Arithmetic.deployed().then(function(instance) {
      return instance.overflowResistantFraction.call(2, 2, 3);
  }).then(function(c) {
      assert.equal(c.valueOf(), 1, "c != a * b / d");
    });
  });
});
