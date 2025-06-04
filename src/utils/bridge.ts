import { helpContract } from '@/contracts/Help'
import { sHelpContract } from '@/contracts/sHelp'
import { helpSonicBridgeContract } from '@/contracts/HelpSonicBridge'
import { deBridgeBaseGateContract } from "@/contracts/deBridgeBaseGate";
import { deBridgeSonicGateContract } from "@/contracts/deBridgeSonicGate";
import { base, sonic } from '@wagmi/core/chains'
import { wagmiConfig } from '@/utils/wagmi.ts';
import { parseEther } from 'viem'
import {
  estimateFeesPerGas,
  readContract,
  writeContract,
  getBalance,
  signTypedData,
  waitForTransactionReceipt
} from '@wagmi/core'

export const Bridge = {
  FIXED_GAS: 10000000,

  helpBalance: async (address) => {
    return await calcBalance(base, helpContract, address);
  },

  sHelpBalance: async (address) => {
    return await calcBalance(sonic, sHelpContract, address);
  },

  helpFee: async (multiplier = 1) => {
    return await calcFees(base, deBridgeBaseGateContract, multiplier);
  },

  sHelpFee: async (multiplier = 1) => {
    return await calcFees(sonic, deBridgeSonicGateContract, multiplier);
  },

  execute: async (symbol, address, qty, multiplier = 1) => {
    if (symbol === helpContract.symbol) {
      await executeBridge(address, qty, multiplier, base, helpContract, helpSonicBridgeContract, deBridgeBaseGateContract, "lockAndSendWithPermit");

    } else if (symbol === sHelpContract.symbol) {
      await executeBridge(address, qty, multiplier, sonic, sHelpContract, sHelpContract, deBridgeSonicGateContract, "burnAndSendWithPermit");
    }
  },
}

async function calcBalance(chain, contract, address) {
  return (await getBalance(wagmiConfig, {
    chainId: chain.id,
    token: contract.address,
    address: address
  }))?.value;
}

async function calcFees(chain, contract, multiplier) {
  const gas = BigInt(Bridge.FIXED_GAS * multiplier);

  let fixedFees = await readContract(
    wagmiConfig,
    {
      chainId: chain.id,
      address: contract.address,
      abi: contract.abi,
      functionName: 'globalFixedNativeFee',
      args: []
    }
  );

  const gasPrice = await estimateFeesPerGas(wagmiConfig, { chainId: chain.id });
  return fixedFees + (gas * gasPrice.maxFeePerGas);
}

async function executeBridge(address, qty, multiplier, chain, tokenContract, bridgeContract, gateContract, contractMethod){
  const amount = parseEther(`${qty}`);
  const fees = await calcFees(chain, gateContract, multiplier);

  const nonce = await readContract(
    wagmiConfig,
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
    wagmiConfig,
    {
      domain: {
        name: tokenContract.name,
        version: "1",
        chainId: chain.id,
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
    wagmiConfig,
    {
      chainId: chain.id,
      address: bridgeContract.address,
      abi: bridgeContract.abi,
      functionName: contractMethod,
      args: [amount, deadline, v, r, s],
      value: fees
    }
  );

  const receipt = await waitForTransactionReceipt(wagmiConfig, {
    chainId: chain.id,
    hash: tx
  });

  console.log('Status:', receipt.status === 'success' ? 'Success' : 'Fail');
}