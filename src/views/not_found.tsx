import { t } from '@/localization/i18n';
import { Layout } from '@/views/layout';
import { ROUTES } from "@/routes";

export function NotFound() {
  const i18nPage = "pages.not_found";

  return (
    <Layout action="not-found">
      <img src="/assets/images/pix/404.svg" title={ t(`${i18nPage}.title`) } alt={ t(`${i18nPage}.title`) }/>
      <h1>{ t(`${i18nPage}.title`) }</h1>
      <p>{ t(`${i18nPage}.text`) }</p>
      <a href={ROUTES.ROOT} title={ t(`${i18nPage}.button`) } className="button icon-go">{ t(`${i18nPage}.button`) }</a>
    </Layout>
  );
}