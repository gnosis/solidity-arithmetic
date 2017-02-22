var Arithmetic = artifacts.require("./Arithmetic.sol");

module.exports = function(deployer) {
  deployer.deploy(Arithmetic);
};
