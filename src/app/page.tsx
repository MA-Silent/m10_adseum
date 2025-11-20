import { useTranslations } from "next-intl";
import Header from "../components/header";

export default function Home() {
  const t = useTranslations('Homepage');

  return (
    <>
      <Header />
      <main className="h-full pt-14 flex justify-center items-center">
        <section>Hello world</section>
      </main>
    </>
  );
}
