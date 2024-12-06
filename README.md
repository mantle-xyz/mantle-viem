<br/>

<p align="center">
  <a href="https://viem.mantle.xyz/">
  <h1>Mantle Viem</h1>
  </a>
</p>

<p align="center">
  Viem Extension for Mantle Chain
<p>

<br>

## Features

- Simplifies cross L1 & L2 interactions
- Seamless extension to [Viem](https://github.com/wagmi-dev/viem)
- TypeScript ready
- Test suite running against [forked](https://ethereum.org/en/glossary/#fork) Ethereum network

## Overview

```ts
// import modules
import { walletActionsL1 } from 'mantle-viem'
import { mantle } from 'mantle-viem/chains'
import { createWalletClient, custom } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

// create wallet clients
export const walletClientL1 = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
}).extend(walletActionsL1())

// perform an action
const hash = await walletClientL1.depositMNT({
  account,
  request: {
    amount: parseEther('1'),
  },
  targetChain: mantle,
})
```

## Contributing

If you're interested in contributing, please read the [contributing docs](CONTRIBUTING.md) **before submitting a pull request**.

## License

[MIT](LICENSE.md) License
