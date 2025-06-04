import { helpContract } from '@/contracts/Help'
import { sHelpContract } from '@/contracts/sHelp'
import { helpSonicBridgeContract } from '@/contracts/HelpSonicBridge'
import { deBridgeBaseGateContract } from "@/contracts/deBridgeBaseGate";
import { deBridgeSonicGateContract } from "@/contracts/deBridgeSonicGate";
import { base, sonic } from '@wagmi/core/chains'
import { parseEther } from 'viem'
import {
  estimateFeesPerGas,
  http,
  createConfig,
  readContract,
  writeContract,
  getBalance,
  signTypedData,
  waitForTransactionReceipt
} from '@wagmi/core'

const baseConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http()
  },
});

const sonicConfig = createConfig({
  chains: [sonic],
  transports: {
    [sonic.id]: http()
  },
});

export const Bridge = {
  FIXED_GAS: 10000000,

  helpBalance: async (address) => {
    return await calcBalance(baseConfig, helpContract, address);
  },

  sHelpBalance: async (address) => {
    return await calcBalance(sonicConfig, sHelpContract, address);
  },

  helpFee: async (multiplier = 1) => {
    return await calcFees(baseConfig, deBridgeBaseGateContract, multiplier);
  },

  sHelpFee: async (multiplier = 1) => {
    return await calcFees(sonicConfig, deBridgeSonicGateContract, multiplier);
  },

  execute: async (symbol, address, qty, multiplier = 1) => {
    if (symbol === helpContract.symbol) {
      await executeBridge(address, qty, multiplier, baseConfig, helpContract, helpSonicBridgeContract, deBridgeBaseGateContract, "lockAndSendWithPermit");

    } else if (symbol === sHelpContract.symbol) {
      await executeBridge(address, qty, multiplier, sonicConfig, sHelpContract, sHelpContract, deBridgeSonicGateContract, "burnAndSendWithPermit");
    }
  },
}

async function calcBalance(networkConfig, contract, address) {
  return (await getBalance(networkConfig, {
    token: contract.address,
    address: address
  }))?.value;
}

async function calcFees(networkConfig, contract, multiplier) {
  const gas = BigInt(Bridge.FIXED_GAS * multiplier);

  let fixedFees = await readContract(
    networkConfig,
    {
      address: contract.address,
      abi: contract.abi,
      functionName: 'globalFixedNativeFee',
      args: [],
    }
  );

  const gasPrice = await estimateFeesPerGas(networkConfig)
  return fixedFees + (gas * gasPrice.maxFeePerGas);
}

async function executeBridge(address, qty, multiplier, networkConfig, tokenContract, bridgeContract, gateContract, contractMethod){
  const amount = parseEther(`${qty}`);
  const fees = await calcFees(networkConfig, gateContract, multiplier);

  const nonce = await readContract(
    networkConfig,
    {
      address: tokenContract.address,
      abi: tokenContract.abi,
      functionName: 'nonces',
      args: [address],
    }
  );

  const deadline = Math.floor(Date.now() / 1000) + 3600;

  const values = {
    owner: address,
    spender: bridgeContract.address,
    value: amount,
    nonce,
    deadline
  };

  const signature = await signTypedData(
    networkConfig,
    {
      domain: {
        name: tokenContract.name,
        version: "1",
        chainId: networkConfig.chains[0].id,
        verifyingContract: tokenContract.address
      },
      types: {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" }
        ]
      },
      primaryType: 'Permit',
      message: values,
    }
  );

  const r = (signature as string).slice(0, 66)
  const s = ('0x' + (signature as string).slice(66, 130))
  const v = Number.parseInt((signature as string).slice(130, 132), 16)

  const tx = await writeContract(
    networkConfig,
    {
      address: bridgeContract.address,
      abi: bridgeContract.abi,
      functionName: contractMethod,
      args: [amount, deadline, v, r, s],
      value: fees
    }
  );

  const receipt = await waitForTransactionReceipt(networkConfig, { hash: tx });

  console.log('Status:', receipt.status === 'success' ? 'Success' : 'Fail');
}