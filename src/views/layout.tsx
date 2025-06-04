import React from 'react';
import { t } from '@/localization/i18n';
import { useParams } from "react-router-dom";
import { ROUTES, getRoute } from "@/routes";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Layout({ action, children }) {
  const { lang } = useParams();

  return (
    <>
      <title>{ t(`meta.title`) }</title>
      <meta name="description" content={ t(`meta.description`) } />

      <header>
        <a href={ getRoute(lang, ROUTES.ROOT) } title={ t("general.help_bridge") }>
          <img src="/assets/images/pix/help-logo.svg" title={ t("general.help_bridge") } alt={ t("general.help_bridge") }/>
        </a>

        <ConnectButton accountStatus="address" showBalance={false} />
      </header>

      <main id={action}>{ children }</main>

      <footer>
        <a href={ getRoute(lang, ROUTES.LEGAL, {}, `#${t("layout.terms_use_anchor")}`) } target="_blank" rel="noreferrer" title={ t("layout.terms_use") }>{ t("layout.terms_use") }</a>
        <a href={ getRoute(lang, ROUTES.LEGAL, {}, `#${t("layout.privacy_policy_anchor")}`) } target="_blank" rel="noreferrer" title={ t("layout.privacy_policy") }>{ t("layout.privacy_policy") }</a>
      </footer>
    </>
  );
}