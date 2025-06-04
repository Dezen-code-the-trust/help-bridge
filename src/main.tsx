import ReactDOM from "react-dom/client"

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import "@/stylesheets/styles.sass";

import { createQueryClient, createWagmiConfig } from "@/utils/wagmi.ts";
import { Router } from "@/routes";

const wagmiConfig = createWagmiConfig();
const queryClient = createQueryClient();

ReactDOM.createRoot(document.getElementsByTagName("body")[0]!).render(
  <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider theme={darkTheme()}>
        <Router />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
