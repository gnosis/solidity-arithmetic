var HDWalletProvider = require("truffle-hdwallet-provider");

// 12-word mnemonic
var mnemonic = "congress drastic play goose cactus shine begin fork label panel churn potato";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"),
      network_id: 3 // official id of the ropsten network
    }
  }
};
