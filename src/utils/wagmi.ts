import { getDefaultConfig, getDefaultWallets, darkTheme, type Theme } from "@rainbow-me/rainbowkit";
import { ledgerWallet, metaMaskWallet, rabbyWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient } from "@tanstack/react-query";
import { base, sonic } from 'wagmi/chains'
import type { Config } from "wagmi";

// https://cloud.reown.com/app/7d9c001a-e69b-416a-953d-1621bc67bfdc/project/fbbf8852-10a7-4448-8bca-29fb07761799
const projectId = '56c3a6fc138adce2072971655b3bb754';
const { wallets } = getDefaultWallets();

export const wagmiConfig: Config = getDefaultConfig({
  appName: "Help bridge",
  appDescription: "",
  appUrl: "",
  appIcon: "",
  projectId: projectId,
  chains: [
    base,
    {
      ...sonic,
      iconUrl: 'https://sonicscan.org//assets/generic/html/favicon.ico',
    }
  ],
  wallets: [
    ...wallets,
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        ledgerWallet,
        rabbyWallet
      ]
    }
  ]
});

export const queryClient: QueryClient = new QueryClient();

export const customTheme: Theme = darkTheme({
  accentColor: "#113111",
  accentColorForeground: "#9FFA9F"
});