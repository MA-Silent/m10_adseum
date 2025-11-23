"use server"
import { getTranslations } from "next-intl/server";

export default async function Header() {
  const t = await getTranslations('Header');

  return(
    <div className="fixed top-0 right-2 left-2 text-secondary">
      <div className="bg-black/60 w-full p-4 justify-between flex rounded">
        <div>{t('title')}</div>
        <div>Links</div>
      </div>
    </div>
  )
}
