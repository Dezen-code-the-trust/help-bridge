import i18n from 'i18next';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { initReactI18next, useTranslation } from 'react-i18next';

interface ViewProps {
  children: React.ReactNode;
}

const resources = {
  en: { translation: await import('@/localization/en.json') }
};

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    resources: resources
  });

export function LanguageWrapper({ children }: ViewProps) {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!lang || !(lang in resources)) window.location.href = `#/en`;
    i18n.changeLanguage(lang).then(() => { setReady(true); });
  }, [lang, i18n]);

  return ready ? children : "";
}

export const t = (key: any, params = {}, options: any = {}): string => {
  let text: string = i18n.t(key, options) as string;
  Object.entries(params).forEach(([key, value]) => {
    text = text.replaceAll(`%{${key}}`, value as string) ;
  });
  return text;
}

export function l(input: number | string | Date) {
  let date = new Date();
  if (typeof input === "number" || (typeof input === "string" && /^[0-9]+$/.test(input))) {
    date = new Date(Number(input));

  } else if (typeof input === "string") {
    const utcStr = /[Zz]|[+-]\d{2}:\d{2}$/.test(input ) ? input : `${input}Z`;
    date = new Date(utcStr);
  }

  const localDateTime = date.toLocaleString(undefined, {
    month:  "long",
    day:    "2-digit",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const offsetMin = -date.getTimezoneOffset();
  const sign      = offsetMin >= 0 ? "+" : "-";
  const absMin    = Math.abs(offsetMin);
  const hh        = String(Math.floor(absMin / 60)).padStart(2, "0");
  const mm        = String(absMin % 60).padStart(2, "0");
  const offsetStr = `${sign}${hh}:${mm}`;

  return `${localDateTime} (UTC${offsetStr})`;
}
