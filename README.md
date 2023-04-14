
![dem](https://user-images.githubusercontent.com/40043037/230978413-b7a8c92e-bee8-4810-afc9-4da9fecd34e4.PNG)

## Chain Abstraction Demo Documentation 
A Forwarder is an authorized smart contract that can execute transactions on behalf of another user. ERC2771 context has the basic logic for a simple forwarder. Using this flow we can achieve some pretty cool things such as gasless transactions and the ability to execute transactions belonging to one chain from a different chain entirerly making I possible to abstract away the need to keep track of networks on app UIs. 
1.	A single address
2.	Any asset
3.	No gas tokens

  #Why?
Interacting with multiple blockchains today is annoying. You have to install multiple wallets, buy gas tokens on each chain, all before you can do a simple contract interaction. The process of bridging assets to a new chain can be daunting on its own, which is enough to deter users coming from a traditional CEX experience.
A forwarder which we will now refer to a a SMART WALLET offers a solution for this: it gives you a single address to which you can deposit any asset on any chain, and lets you do anything with these assets without having to ever think about gas tokens.
Whats more, is with the smart wallet it becomes possible to abstract away the need for users to keep track on what chain or network they’re on in order to initiate smart contract interactions such as ERC20 transfers approvals etc.. 

For example with the smart wallet a user could initiate a transfer of dai on ethereum from their smart wallet to some address from the polygon network, or any other chain for that matter. This allows application creators to not have to worry about prompting the user to switch to the correct chain in order to execute a transaction.

## Forwader Design Example
Before we explore the smart wallet contracts lets first look at an example use case of how a smart wallet can be integrated into an application. This way we will have a better understanding of how the smart wallet works by exploring a simple use case to see how we can achieve gasless and muliti-chain transactions through the smart wallet.
For this we will start off with some prerequisites and assumptions. The first being that we have some web3 app which connects to the smart wallet contracts. The second is that we have a user who is accessing our application with some custodial wallet such as metamask. And finally we will assume that we have some Admin account (we can think of the admin as the account who originally deployed the smart wallet contracts. This account will be responsible for paying gas tokens). Consider the diagram below to see a simple layout of this flow

![image](https://user-images.githubusercontent.com/40043037/231320044-b46ba542-dc1f-4ccf-a8a9-6d2fe2b08660.png)
 
# Figure2: Simple overview of how a smart wallet is used in a web3 application
Viewing this diagram might be a little confusing at first without any knowledge of how the smart wallet works and what it is doing for the user. So lets break this diagram down step by step following the ordering.
1: User Connects With Metamask
Initially when a user connects to the app for the first time, they will not have a smart wallet address. So for a first time user the flow begins with them connecting to the application with their web3 wallet. This example uses Metamask but the idea remains the same for any web3 wallet.

## 2/3/4: Frontend calls SmartWallet API (Contrats)
When the user establishes a secure connection to the web3 application, the smart wallet API will be called. The API is just a simple API that calls various smart wallet functions on our behalf such as getAddress() and doTransaction(). When the user first connects the smart wallet API will call a function in the smart wallet contracts to generate that user's smart wallet address. A user's smart wallet address is determinant, meaning that any given user's smart wallet address can be pre-computed beforehand from a variety of different known factors. Many of these are not important for now. But just think of it as the users wallet (Metamask) address is used to figure out what their smart wallet address is going to be. Once the user's smart wallet address is determined, the user's smart wallet contract (who's deployed at this address) is returned to the frontend and assigned to the user. 
5: Smart wallet now ready for user

Onec the factory generates the users smart wallet it is returned to the frontend and can be used by the user.Note that the smart wallet itself is a contract which inside it has functions to both verify and execute blockchain/smart contract calls. Every blockchain interaction that the users makes will now be done through their smart wallet instead of their metamask. However, through special logic defined in the main smart wallet contracts (which we will explore later), any state changing blockchain interaction such as token transfer, or smart contract interaction will take the form of a metaData transaction. This metadata transaction encodes the details of whatever call is being executed. This metaTx needs to be signed by the users metamask before the smart users smart wallet contract has permission to execute it. So the smart wallet acts like an extension of the users metamask or web3 wallet, whereby we can use metamask like a signer that signs whatever transaction we want to execute and the smart wallet will be the entity that actually does the call. So its important to note that a users web3 wallet and their generated smart wallet address (contract) are intrinsically linked

## ADMIN
The most important thing here is the ADMIN, which we can see in the diagram above. The admin is the account who deployed the original smart wallet contracts. So this admin is like the main account over everything and all smart wallet calls from any user will ultimately go through this admin. This is the account responsible for paying the gas tokens required to execute the transactions forwarded to a smart wallet contract. This means that in order for this system to work, the ADMIN account must have a balance of the native token of whatever blockchain the smartwallet contracts are deployed on. So for example if the smartWallet contracts are deployed on Ethereum, then this admin needs to have an ether balance in order for users to be able to execute transactions through their smart wallet. If the smartWallet contracts are deployed on Polygon then the Admin will need to have a Matic balance and so on etc

We can consider the diagram below to see more how the ADMIN plays an important role in the smart wallet architecture.
![image](https://user-images.githubusercontent.com/40043037/231320073-bb98b571-1ea6-4080-8dc3-a39584628958.png)

 
Figure4: User SW generation & smart wallet transaction execution
Again this diagram might seem a little confusing at first glance so let's dissect what's happening here. We know from the last flow that a users smart wallet gets generated from their metamask address and a few other factors once the user calls the main SmartWallet factory contract. When the users smart wallet is generated, they can construct transactions that they want to execute in the form on encoded metaTxs that they sign with their main web3 wallet. Once these meta transactions have been signed they get forwarded to the user's smart wallet, where a special function in their smart wallet will call the transaction for the user. 
However we also know that gas tokens are not paid by the user, but rather, are paid by the ADMIN or the account that initially deploys the main Smart Wallet factory. The reason this is possible is because since the admin is the original deployer of the Factory, then they act like the signer is this system (achieved through logic we'll go through in the next section). So essentially because the original user generates and signs the a meta transaction with their web3 wallet, this pretty much means that the user has already given permission and confirm that they authorise this transaction be executed (through their signing of the metaTx with metamask) so once this user signing has taken place, the transaction itself can get executed by anybody on the users behalf with permission. So this is what the ADMIN is doing.To recap a user generates and signs a metaTx, the metaTx is forwarded to the user smartWallet (who remember was deployed by the factory who was deployed by the ADMIN). Thus when the smart wallet makes the call to whatever is encoded in the metaTX, the actual execution comes from the admin since this is the main EVM account that deployed the contracts. In other words the admin is the main signer or msg_sender() 
1.	So in reference to the diagram above. ADMIN deploys a wallet factory.
2.	Wallet factory is called by user and generates user smart wallet
3.	Smart wallet passed back to frontend to be interacted with by user
4.	User generates a DAI transfer call, signs it with their metamask and forwards it to their smart wallet
5.	The smart wallet calls the DAI contract transfer function and the transaction is executed by the user smart wallet from the ADMIN
So thats a very high level overview of how the smart wallet works and can be implemented in some web3 application

