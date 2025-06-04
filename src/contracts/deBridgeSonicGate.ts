export const deBridgeSonicGateContract = {
  address: '0x43dE2d77BF8027e25dBD179B491e8d64f38398aA',
  proxyAddress: '0x8a0C79F5532f3b2a16AD1E4282A5DAF81928a824',
  abi: [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "submissionId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "callProxy",
          "type": "address"
        }
      ],
      "name": "AutoRequestExecuted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "submissionId",
          "type": "bytes32"
        }
      ],
      "name": "Blocked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "callProxy",
          "type": "address"
        }
      ],
      "name": "CallProxyUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "chainId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isSupported",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isChainFrom",
          "type": "bool"
        }
      ],
      "name": "ChainSupportUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "chainIds",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "fixedNativeFee",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isSupported",
              "type": "bool"
            },
            {
              "internalType": "uint16",
              "name": "transferFeeBps",
              "type": "uint16"
            }
          ],
          "indexed": false,
          "internalType": "structIDeBridgeGate.ChainSupportInfo",
          "name": "chainSupportInfo",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isChainFrom",
          "type": "bool"
        }
      ],
      "name": "ChainsSupportUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "submissionId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "debridgeId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "chainIdFrom",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "autoParams",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isNativeToken",
          "type": "bool"
        }
      ],
      "name": "Claimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "globalFixedNativeFee",
          "type": "uint256"
        }
      ],
      "name": "FixedNativeFeeAutoUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "globalFixedNativeFee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "globalTransferFeeBps",
          "type": "uint256"
        }
      ],
      "name": "FixedNativeFeeUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "submissionId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lockedOrMintedAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalSupply",
          "type": "uint256"
        }
      ],
      "name": "MonitoringClaimEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "submissionId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lockedOrMintedAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalSupply",
          "type": "uint256"
        }
      ],
      "name": "MonitoringSendEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "debridgeId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "nativeAddress",
          "type": "bytes"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "nativeChainId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "maxAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "minReservesBps",
          "type": "uint16"
        }
      ],
      "name": "PairAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "submissionId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "debridgeId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "receiver",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nonce",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "chainIdTo",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "referralCode",
          "type": "uint32"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "receivedAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "fixFee",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "transferFee",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "useAssetFee",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isNativeToken",
              "type": "bool"
            }
          ],
          "indexed": false,
          "internalType": "structIDeBridgeGate.FeeParams",
          "name": "feeParams",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "autoParams",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "nativeSender",
          "type": "address"
        }
      ],
      "name": "Sent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "submissionId",
          "type": "bytes32"
        }
      ],
      "name": "Unblocked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "debridgeId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        }
      ],
      "name": "WithdrawnFee",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "callProxy",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_debridgeId",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_chainIdFrom",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_nonce",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_signatures",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "_autoParams",
          "type": "bytes"
        }
      ],
      "name": "claim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_debridgeId",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_chainId",
          "type": "uint256"
        }
      ],
      "name": "getDebridgeChainAssetFixedFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getNativeInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "nativeChainId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "nativeAddress",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "globalFixedNativeFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "globalTransferFeeBps",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "submissionId",
          "type": "bytes32"
        }
      ],
      "name": "isSubmissionUsed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_chainIdTo",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_receiver",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "_permitEnvelope",
          "type": "bytes"
        },
        {
          "internalType": "bool",
          "name": "_useAssetFee",
          "type": "bool"
        },
        {
          "internalType": "uint32",
          "name": "_referralCode",
          "type": "uint32"
        },
        {
          "internalType": "bytes",
          "name": "_autoParams",
          "type": "bytes"
        }
      ],
      "name": "send",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "submissionId",
          "type": "bytes32"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_dstChainId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_targetContractAddress",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "_targetContractCalldata",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "_flags",
          "type": "uint256"
        },
        {
          "internalType": "uint32",
          "name": "_referralCode",
          "type": "uint32"
        }
      ],
      "name": "sendMessage",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "submissionId",
          "type": "bytes32"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_dstChainId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_targetContractAddress",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "_targetContractCalldata",
          "type": "bytes"
        }
      ],
      "name": "sendMessage",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "submissionId",
          "type": "bytes32"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_debridgeId",
          "type": "bytes32"
        }
      ],
      "name": "withdrawFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} as const;