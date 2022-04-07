require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/195d30bd1c384eafa2324e0d6baab488",
      accounts: [`ab02ed04165f0595a2ee92a776855372fcaa1472f73bed73e9507b88a0ac6cd2`]
    }
  }
};