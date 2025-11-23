"use server"
import { getTranslations } from "next-intl/server";
import { prisma } from "../lib/prisma";

const users = await prisma.user.findMany();

export default async function Header() {
  const t = await getTranslations('Header');

  return(
    <div className="fixed top-0 right-2 left-2 text-secondary">
      <div className="bg-black/60 w-full p-4 justify-between flex rounded">
        <div>{t('title')}</div>
        <div className="flex gap-4">{users.map((user) => <div key={user.id}>{user.name}</div>)}</div>
      </div>
    </div>
  )
}
