# Rayls QA Challenge – Hardhat Boilerplate

Fork do [Hardhat Boilerplate](https://github.com/NomicFoundation/hardhat-boilerplate) com **testes E2E do RaylsToken** para o QA Engineering Challenge (Rayls Network).

## RaylsToken E2E – Como rodar

1. **Configurar `.env`** (copie de `.env.example` e preencha):
   - `RPC_URL` – Rayls Devnet: `https://devnet-rpc.rayls.com`
   - `CHAIN_ID=123123`
   - `PRIVATE_KEY_OWNER` – chave privada da conta Owner/Deployer fornecida pelo desafio

2. **Testes na rede local (Hardhat):**
   ```sh
   npm run test:e2e
   # ou
   npx hardhat test test/RaylsToken.e2e.js
   ```

3. **Testes na Rayls Devnet** (pedido do desafio para validação final):
   ```sh
   npm run test:e2e:devnet
   # ou
   npx hardhat test test/RaylsToken.e2e.js --network rayls_devnet
   ```
   Se aparecer **error code: 522** (Invalid JSON-RPC response), é timeout/conexão com o RPC `devnet-rpc.rayls.com` (Cloudflare/servidor). Tente de outra rede, sem VPN, ou mais tarde; se persistir, informe ao recrutador e use o resultado dos testes locais (7 passing) como evidência.

### Cenários cobertos pelos testes E2E

- **1. Deployment & Ownership** – deploy do contrato e `owner()` igual ao deployer
- **2. Access Control (Minting)** – Owner pode dar mint; não-owner não pode (revert)
- **3. Allowance Flow (ERC20)** – approve + `transferFrom`, validação de saldos e allowance
- **4. Token Destruction (Burn)** – burn de tokens e redução de `totalSupply`

### Design dos testes

- **Fixture:** um único `before()` faz o deploy do RaylsToken e configura Owner, User A e User B (com 3 signers locais ou criando User A/B e financiando com native token quando há só 1 conta).
- **Helpers:** `getAddress(signer)` e `setupSigners()` para suportar rede local e devnet com uma única conta.

---

## Frontend – Como rodar

**Importante:** todos os comandos Hardhat devem ser executados **de dentro da pasta do projeto** (`rayls-qa-challenge`). Se rodar na pasta pai (`challengeblockchain`), o Hardhat não encontra o `hardhat.config.js` e pode tentar instalar outra versão.

1. **Entre na pasta do projeto:**
   ```sh
   cd rayls-qa-challenge
   ```

2. **Terminal 1 – subir o nó local (deixe rodando):**
   ```sh
   cd rayls-qa-challenge
   npx hardhat node
   ```
   Espere aparecer "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/".

3. **Terminal 2 – fazer o deploy do Token (com o nó já rodando):**
   ```sh
   cd rayls-qa-challenge
   npx hardhat run scripts/deploy.js --network localhost
   ```

4. **Terminal 3 – subir o frontend:**
   ```sh
   cd rayls-qa-challenge/frontend
   npm install
   npm start
   ```
   Abra **http://localhost:3000** e conecte o MetaMask em **localhost:8545** (Chain ID 31337).

**Se aparecer "Cannot connect to the network localhost" (ECONNREFUSED 127.0.0.1:8545):** o nó não está rodando. Volte ao passo 2 e deixe `npx hardhat node` aberto no Terminal 1 antes de rodar o deploy.

**Se aparecer "No Hardhat config file found":** você está na pasta errada. Use `cd rayls-qa-challenge` antes de rodar qualquer comando `npx hardhat ...`.

---

# Hardhat Boilerplate (original)

This repository contains a sample project that you can use as the starting point
for your Ethereum project. It's also a great fit for learning the basics of
smart contract development.

This project is intended to be used with the
[Hardhat Beginners Tutorial](https://hardhat.org/tutorial), but you should be
able to follow it by yourself by reading the README and exploring its
`contracts`, `tests`, `scripts` and `frontend` directories.

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/NomicFoundation/hardhat-boilerplate.git
cd hardhat-boilerplate
npm install
```

Once installed, let's run Hardhat's testing network:

```sh
npx hardhat node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```

Open [http://localhost:3000/](http://localhost:3000/) to see your Dapp. You will
need to have [Coinbase Wallet](https://www.coinbase.com/wallet) or [Metamask](https://metamask.io) installed and listening to
`localhost 8545`.

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://hardhat.org/tutorial).

- [Writing and compiling contracts](https://hardhat.org/tutorial/writing-and-compiling-contracts/)
- [Setting up the environment](https://hardhat.org/tutorial/setting-up-the-environment/)
- [Testing Contracts](https://hardhat.org/tutorial/testing-contracts/)
- [Setting up your wallet](https://hardhat.org/tutorial/boilerplate-project#how-to-use-it)
- [Hardhat's full documentation](https://hardhat.org/docs/)

For a complete introduction to Hardhat, refer to [this guide](https://hardhat.org/getting-started/#overview).

## What's Included?

This repository uses our recommended hardhat setup, by using our [`@nomicfoundation/hardhat-toolbox`](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox). When you use this plugin, you'll be able to:

- Deploy and interact with your contracts using [ethers.js](https://docs.ethers.io/v5/) and the [`hardhat-ethers`](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-ethers) plugin.
- Test your contracts with [Mocha](https://mochajs.org/), [Chai](https://chaijs.com/) and our own [Hardhat Chai Matchers](https://hardhat.org/hardhat-chai-matchers) plugin.
- Interact with Hardhat Network with our [Hardhat Network Helpers](https://hardhat.org/hardhat-network-helpers).
- Verify the source code of your contracts with the [hardhat-etherscan](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan) plugin.
- Get metrics on the gas used by your contracts with the [hardhat-gas-reporter](https://github.com/cgewecke/hardhat-gas-reporter) plugin.
- Measure your tests coverage with [solidity-coverage](https://github.com/sc-forks/solidity-coverage).

This project also includes [a sample frontend/Dapp](./frontend), which uses [Create React App](https://github.com/facebook/create-react-app).

## Troubleshooting

- `Invalid nonce` errors: if you are seeing this error on the `npx hardhat node`
  console, try resetting your Metamask account. This will reset the account's
  transaction history and also the nonce. Open Metamask, click on your account
  followed by `Settings > Advanced > Clear activity tab data`.

## Setting up your editor

[Hardhat for Visual Studio Code](https://hardhat.org/hardhat-vscode) is the official Hardhat extension that adds advanced support for Solidity to VSCode. If you use Visual Studio Code, give it a try!

## Getting help and updates

If you need help with this project, or with Hardhat in general, please read [this guide](https://hardhat.org/hardhat-runner/docs/guides/getting-help) to learn where and how to get it.

For the latest news about Hardhat, [follow us on Twitter](https://twitter.com/HardhatHQ), and don't forget to star [our GitHub repository](https://github.com/NomicFoundation/hardhat)!

**Happy _building_!**
