import { headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import fs from "fs";
import path from "path";

export default getRequestConfig(async () => {
  const locales = ['en'];

  const fileLocales = fs.readdirSync(path.join(process.cwd(), "locales"));
  fileLocales.forEach((loc) => {
    locales.push(loc.slice(0, 2));
  });

  const header = await headers();
  const accept = header.get("accept-language") || "";

  const candidates = accept
    .split(',')
    .map(l => l.trim().slice(0, 2))
    .filter(l => /^[a-z]{2}$/.test(l));

  const locale = candidates.find(c => locales.includes(c)) || "en";

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default
  };
});
