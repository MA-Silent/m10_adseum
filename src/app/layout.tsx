import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local"

export const metadata: Metadata = {
  title: "Adseum",
  description: "Queer art",
};

const myFont = localFont({
  src: '../fonts/DIN_Alternate_Bold.ttf'
})

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${myFont.className + " text-lg"} `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
