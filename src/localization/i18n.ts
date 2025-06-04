import i18n from 'i18next';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { initReactI18next, useTranslation } from 'react-i18next';

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

export function LanguageWrapper({ children }) {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const [ready, setReady] = useState(false);

  if (typeof resources[lang] === "undefined"){ window.location.href = `/en/${lang}` }

  useEffect(() => {
    i18n.changeLanguage(lang).then(() => { setReady(true); });
  }, [lang, i18n]);

  return ready ? children : "";
}

export const t = (key, params = {}, options = {}) => {
  let text = i18n.t(key, options);
  Object.entries(params).forEach(([key, value]) => {
    text = text.replaceAll(`%{${key}}`, value);
  });
  return text;
}

export function l(input) {
  let date;
  if (typeof input === "number" || /^[0-9]+$/.test(input)) { date = new Date(Number(input)); }
  else {
    const utcStr = /[Zz]|[+-]\d{2}:\d{2}$/.test(input) ? input : `${input}Z`;
    date = new Date(utcStr);
  }

  const options = {
    month:  "long",
    day:    "2-digit",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
    hour12: false
  };

  const localDateTime = date.toLocaleString(undefined, options);

  const offsetMin = -date.getTimezoneOffset();
  const sign      = offsetMin >= 0 ? "+" : "-";
  const absMin    = Math.abs(offsetMin);
  const hh        = String(Math.floor(absMin / 60)).padStart(2, "0");
  const mm        = String(absMin % 60).padStart(2, "0");
  const offsetStr = `${sign}${hh}:${mm}`;

  return `${localDateTime} (UTC${offsetStr})`;
}
