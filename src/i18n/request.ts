import { headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import fs from "fs";
import path from "path";

export default getRequestConfig(async () => {
  const locales = ['en'];
  let locale = "en";

  const header = await headers();
  const languages = header.get('accept-language')?.split(',').reverse();

  const fileLocales = fs.readdirSync(path.join(process.cwd(), "locales"));

  fileLocales.forEach((locale)=>{
    locales.push(locale.slice(0, 2));
  })

  languages?.forEach((lang)=>{
    const slice = lang.slice(0, 2);

    if(locales.includes(slice)){
      locale = slice;
    }
  })

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default
  };
});
