"use server"

import Header from "../components/Header";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations('Homepage');

  return (
    <>
      <Header />
      <main className="h-full pt-14 flex justify-center items-center">
        <section hidden>{t('title')}</section>
        <section></section>
      </main>
    </>
  );
}
