# Liquid Democracy Testnet #
This repository contains instructions and example config files to set up a test net to deploy liquid democracy smart contracts. The commands included are for a linux machine, but they should work on any OS with the standard os-specific alterations.

## Getting Started ##
### Prerequisites ###
You will need to download [geth](https://geth.ethereum.org/downloads/) to start the testnet, [truffle](truffleframework)(which uses node/npm) to deploy the contracts, and [mist](https://github.com/ethereum/mist/releases) or your facorite wallet application to interact with the contracts.

Once you've installed the necessary packages, you can initialize your private blockchain from this repository by running geth with the following arguments:
```bash
mkdir mychain
geth init --datadir ./mychain ./genesis.json
```

Then, you can connect a geth console to your network with the following command:
```bash 
geth --networkid 2828 --datadir=./mychain --rpc --rpcapi="db,eth,net,web3,personal,web3" console
```

This will launch a node connected to the private testnet at localhost:8545. Type the following commands into the console to create an account and start mining:
```
personal.newAccount("password")
miner.start(1)
```
Create an account using a unique password, since it will be sent in an insecure way when we connect to the mist wallet. 

The 1 confines mining operations to one of the cores on your computer, so it doesn't eat up all your RAM. When the miner starts, first the network will begin creating a DAG to form the base of the blockchain. This can take a few minutes, depending on how powerful your computer is. Then, you will see it mining new blocks and adding them to the chain. Of course, all the mined blocks have 0 transactions because this is your private blockchain. The configuration file has the difficulty set very low, so in no time at all you will be rich in faux ethereum. 


Some other helpful geth console commands to know:
- `personal.listAccounts()` will list the public keys of the accounts on the network.
- `miner.stop()` will stop mining on your account.
- `personal.unlockAccount(personal.listAccounts[x], "password_to_x", 1500)` will unlock account x (so that truffle may use it to deploy contracts) for 1500 seconds.

## Deploy Contracts ##
Now that you have your network running and miner set up, you can deploy smart contracts to it. 

 First, you will need to unlock your account. In the geth console, enter the following command to unlock your first account:
 ```
 personal.unlockAccount(personal.listAccounts[0], "password", 1500)
 ```
 
 Next, you will have to modify `truffle/truffle-config.js` to include the account you created. If you forgot the public key, enter `personal.listAccounts[0]` to print it out again. You shouldn't need to change anything else in this file.
```javascript
  networks: {
    development: {
      port: 8545,             // Custom port
      host: "localhost", //our network is running on localhost
      network_id: 2828,       // Custom network
      gas: 0xca000000,           // Gas sent with each transaction (default: ~6700000)
      //gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
      from: "your public key here",        // Account to send txs from (default: accounts[0])
    },
```

 Now, from the `truffle` directory, call truffle to build and deploy your contracts using your account:
```bash
truffle compile
truffle migrate
```
This should return the addresses of the newly deployed contracts. If it hangs up or gives an 'insufficient funds' error, make sure you are mining on your network by entering `miner.start(1)` in the geth console.

## Interact With Contracts ##
Finally, you are ready to interact with the deployed contracts. Start up mist from a terminal using the following command to connect it to your testnet:
```bash
mist --rpc http://localhost:8545 --swarmurl "null"
``` 
A window will pop up telling you that this is insecure. This is true, but because we do not have any real ether on this network, there's really nothing to lose. In the mist GUI, switch to the contracts tab. Add the contracts you deployed through truffle with the 'watch contract' and 'watch token' buttons.


## Adding More Nodes ##
If you've got access to a public server, like an AWS node, you can leave it running so that other nodes can connect to it. Other nodes that use the same genesis file and networkid when they start will connect to the same net. You can verify this by running a miner on the new node. If it is connected to the remote node, it won't have to generate the DAG before mining. Share with them the addresses of the contracts you deployed, and they can interact with them through their wallet.