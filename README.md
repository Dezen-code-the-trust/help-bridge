# HELP Bridge UI (Base ↔ Sonic)

React interface for bridging **HELP** (on Base) ↔ **sHELP** (on Sonic) via deBridge Messaging.

## Quick Links

| Network  | Address | 
| ---------  | --------------------------------------------  |
| **Base**   | [`0x51aCE6e36E7CE71dB4Bc3589f1eb05e8F6479e1b`](https://basescan.org/address/0x51aCE6e36E7CE71dB4Bc3589f1eb05e8F6479e1b)  |
| **Sonic**  | [`0x200175855125d7C075FD0527e65081693ce7a053`](https://sonicscan.org/address/0x200175855125d7C075FD0527e65081693ce7a053) 

## Deployment and Access

This bridge's official interface is accessible at:

* [https://bridge.helpverse.ai](https://bridge.helpverse.ai)

The UI lets anyone lock HELP on Base, mint sHELP on Sonic (and vice‑versa).
If you prefer to run the UI locally—e.g., for audits, custom front‑end tweaks, or offline signing—follow the steps below.

## Running the UI Locally

### Requirements

* [Node.js v18+](https://nodejs.org/)
* [npm](https://www.npmjs.com/)
* A Web3 wallet (MetaMask, Rabby, etc.) with **Base** and **Sonic** networks added

### Installation

```bash
git clone https://github.com/Dezen-code-the-trust/help-sonic-bridge.git
cd help-sonic-bridge
npm install
```

### Start the UI locally

```bash
npm run dev
```

The app opens at [http://localhost:3000](http://localhost:3000).
Connect your wallet, switch to Base or Sonic as required, and bridge tokens exactly as on the public site.

## Important Notes

* **Fees:** Each bridge operation incurs deBridge protocol fees plus gas on the origin chain (≈ \$2–3 at typical network conditions).
* **Same wallet, both networks:** Base and Sonic share the same EVM address format; your connected address is used on both sides automatically.
* **Mainnet only:** deBridge contracts are not deployed to Sonic testnet, so all tests run on mainnet. Consider using small amounts first.

## Technical References

* [deBridge Docs](https://docs.debridge.finance/)
* [Base Network](https://base.org/)
* [Sonic Labs](https://www.soniclabs.com/)
* [React Documentation](https://react.dev/)

For further support, open an issue in this repo or join [our Telegram community](https://t.me/helpofficialcommunity).