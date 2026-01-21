import Link from "next/link";
import Image from "next/image";
import test from "@/public/white-logo.webp";
import { CmsComponent } from "./componentType";
import { getPages } from "../lib/pages";

const NavBar : CmsComponent = async function ({ children, id, style }) {

  const links = await getPages();

  return (
    <header id={id} style={style} className="group relative top-0 z-30 border-b border-white/10 bg-zinc-900/70 backdrop-blur-xl">
      {children}

      <input
        type="checkbox"
        id="mobile-menu-toggle"
        className="hidden"
      />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <Image src={test} loading="eager" alt="Adseum Logo" className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-zinc-100 md:flex">
          {links.map((link) => (
            <Link
              key={link.slug}
              href={`/${link.slug}`}
              className="rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-zinc-200/85 transition hover:bg-white/10 hover:text-white"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
        </div>

        <div className="flex md:hidden">
          <label
            htmlFor="mobile-menu-toggle"
            className="flex h-9 items-center justify-center rounded-full border border-white/15 bg-zinc-900/70 px-3 cursor-pointer select-none hover:bg-zinc-800"
            aria-label="Toggle navigation"
          >
            <span className="text-base group-has-checked:hidden">☰</span>
            <span className="text-base hidden group-has-checked:block">✕</span>
          </label>
        </div>
      </div>

      <div
        id="mobile-menu"
        className="
          overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out
          max-h-0 opacity-0
          group-has-checked:max-h-64 group-has-checked:opacity-100
          md:hidden border-t border-white/10 bg-zinc-950/95 backdrop-blur-xl
        "
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm">
          {links.map((link) => (
            <Link
              key={link.slug}
              href={`/${link.slug}`}
              className="flex items-center justify-between rounded-full px-4 py-2 text-[13px] font-medium text-zinc-100 hover:bg-zinc-800/80"
            >
              <span>{link.title}</span>
              <span className="text-xs text-zinc-500">↳</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
