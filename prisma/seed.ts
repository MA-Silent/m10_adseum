import "dotenv/config";
import { PrismaClient } from "@/src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // --- COMPONENT ---
  const headerComponent = await prisma.component.upsert({
    where: { nameComponent: "Header" },
    update: {},
    create: {
      importPath: "Header",
      nameComponent: "Header",
    },
  });

  // --- ADMIN USER ---
  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.admin" },
    update: {},
    create: {
      email: "admin@admin.admin",
      name: "admin",
      password: await bcrypt.hash("admin", 10),
    },
  });

  // --- USERS ---
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      name: "Alice",
      password: passwordHash,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: "bob@prisma.io",
      name: "Bob",
      password: passwordHash,
    },
  });

  // --- PAGES ---
  const homePage = await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      title: "Homepage",
      slug: "home",
      components: {
        connect: { id: headerComponent.id },
      },
    },
  });

  const aboutPage = await prisma.page.upsert({
    where: { slug: "over-ons" },
    update: {},
    create: {
      title: "Over Ons",
      slug: "over-ons",
      components: {
        connect: { id: headerComponent.id },
      },
    },
  });

  const testPage = await prisma.page.upsert({
    where: { slug: "test-page" },
    update: {},
    create: {
      title: "Test Page",
      slug: "test-page",
    },
  });

  // --- SHOP ITEMS ---
  const tShirt = await prisma.shopItem.upsert({
    where: { title: "Cool T-Shirt" },
    update: {},
    create: {
      title: "Cool T-Shirt",
      price: 24.99,
      description: "Een zeer cool T-shirt gemaakt van 100% biologisch katoen.",
      shortDesc: "Biologisch katoenen T-shirt.",
      images: [],
      sale: 0.1,
      stock: 50,
    },
  });

  const poster = await prisma.shopItem.upsert({
    where: { title: "Vintage Poster" },
    update: {},
    create: {
      title: "Vintage Poster",
      price: 15.0,
      description: "Een prachtige poster van een klassieke film.",
      shortDesc: "Klassieke filmposter.",
      images: [],
      sale: 0,
      stock: 20,
    },
  });

  // --- ARTISTS ---
  const artistA = await prisma.artist.create({
    data: {
      name: "Lena van Vliet",
      description: "Een abstracte kunstenaar bekend om haar levendige kleuren.",
      shortDesc: "Abstracte kunstenaar.",
      images: [],
    },
  });

  const artistB = await prisma.artist.create({
    data: {
      name: "Max de Vries",
      description: "Fotograaf gespecialiseerd in landschapsfotografie.",
      shortDesc: "Landschapsfotograaf.",
      images: [],
    },
  });

  console.log({
    admin,
    alice,
    bob,
    homePage,
    aboutPage,
    testPage,
    tShirt,
    poster,
    artistA,
    artistB,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
