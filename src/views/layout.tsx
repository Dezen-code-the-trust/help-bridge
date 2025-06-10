import React from 'react';
import { t } from '@/localization/i18n';
import { useParams } from "react-router-dom";
import { ROUTES, getRoute } from "@/routes";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import {useAccount} from "wagmi";

interface ViewProps {
  action: string;
  children: React.ReactNode;
}

export function Layout({ action, children }: ViewProps) {
  const { lang } = useParams();
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  return (
    <>
      <title>{ t(`meta.title`) }</title>
      <meta name="description" content={ t(`meta.description`) } />

      <header>
        <a href={getRoute(lang, ROUTES.ROOT)} title={t("general.help_bridge")}>
          <img src="/assets/images/pix/help-logo.svg" title={t("general.help_bridge")} alt={t("general.help_bridge")}/>
        </a>

        {isConnected ? (
          <ConnectButton showBalance={true} chainStatus="none"/>
        ) : (
          <span onClick={openConnectModal!} className="button center connect-wallet">
            {t(`general.connect_wallet`)}
          </span>
        )}


      </header>

      <main id={action}>{children}</main>

      <footer>
        <p>{ t("layout.footer") }</p>
      </footer>
    </>
  );
}