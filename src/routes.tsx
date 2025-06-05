import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { LanguageWrapper } from "@/localization/i18n";
import { Index } from "@/views/index";
import { useEffect } from "react";

import { NotFound } from "@/views/not_found";

export const ROUTES = {
  ROOT: '/',
};

export function getRoute(lang, route, params = {}, extra = "") {
  let url = `/#/${lang}${route}${extra}`;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replaceAll(`:${key}`, value);
  });
  return url;
}

export function getRouteNavigate(lang, route, params = {}, extra = "") {
  return getRoute(lang, route, params, extra).replace("/#/", "/");
}

export function Router() {
  useEffect(() => {
    const hashParts = window.location.hash.slice(1).split("#");

    if (hashParts.length > 1) {
      setTimeout(() => {
        const element = document.getElementById(hashParts[hashParts.length - 1]);
        if (!element) return;

        const headerElement = document.getElementsByTagName("header")[0];
        element.style.scrollMarginTop = `${headerElement.offsetHeight}px`;
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTES.ROOT} element={<Navigate to="/en" replace />} />
        <Route path="/:lang/*" element={
          <LanguageWrapper>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageWrapper>
        }/>
      </Routes>
    </HashRouter>
  );
}