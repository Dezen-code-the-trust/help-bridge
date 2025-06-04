import React from 'react';
import { t } from '@/localization/i18n';
import { Layout } from '@/views/layout';

export function Legal() {
  const i18nPage = "pages.legal";
  
  return (
    <Layout action="legal">
      <div className="container">
        {[...Array(5)].map((_, x) => (
          <div key={x} id={t(`${i18nPage}.block${x}.id`)} className="block">
            <h3>{t(`${i18nPage}.block${x}.title`)}</h3>
            <p className="featured">{t(`${i18nPage}.block${x}.text`)}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}