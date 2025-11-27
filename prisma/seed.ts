import { PrismaClient } from "@/src/generated/client";

const prisma = new PrismaClient();

async function main() {
  const headerComponent = await prisma.component.upsert({
    where: { importPath: "Header" },
    update: {},
    create: {
      importPath: "Header",
      nameComponent: "Header",
    },
  });


  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      posts: {
        create: {
          title: 'Check out Prisma with Next.js',
          content: 'https://www.prisma.io/nextjs',
        },
      },
    },
  })
  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      posts: {
        create: [
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma',
          },
          {
            title: 'Follow Nexus on Twitter',
            content: 'https://twitter.com/nexusgql',
          },
        ],
      },
    },
  })

  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: 'Homepage',
      slug: 'home',
      components: {

      },
    },
  });

  const aboutPage = await prisma.page.upsert({
    where: { slug: 'over-ons' },
    update: {},
    create: {
      title: 'Over Ons',
      slug: 'over-ons',
      components: {

      }
    },
  });

  await prisma.page.update({
    where: { id: aboutPage.id },
    data: {
      components: {
        connect: { id: headerComponent.id },
      },
    },
  });

  await prisma.page.update({
    where: { id: homePage.id },
    data: {
      components: {
        connect: { id: headerComponent.id },
      },
    },
  });

  const tShirt = await prisma.shopItem.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Cool T-Shirt',
      price: 24.99,
      description: 'Een zeer cool T-shirt gemaakt van 100% biologisch katoen.',
      shortDesc: 'Biologisch katoenen T-shirt.',
      images: [],
      sale: 0.1,
      stock: 50,
    },
  });

  const poster = await prisma.shopItem.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Vintage Poster',
      price: 15.00,
      description: 'Een prachtige poster van een klassieke film.',
      shortDesc: 'Klassieke filmposter.',
      images: [],
      sale: 0,
      stock: 20,
    },
  });

  // --- Artiesten (Artist) ---
  const artistA = await prisma.artist.create({
    data: {
      name: 'Lena van Vliet',
      description: 'Een abstracte kunstenaar bekend om haar levendige kleuren.',
      shortDesc: 'Abstracte kunstenaar.',
      images: [],
    },
  });

  const artistB = await prisma.artist.create({
    data: {
      name: 'Max de Vries',
      description: 'Fotograaf gespecialiseerd in landschapsfotografie.',
      shortDesc: 'Landschapsfotograaf.',
      images: [],
    },
  });

  console.log({
    alice,
    bob,
    homePage,
    aboutPage,
    tShirt,
    poster,
    artistA,
    artistB,
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
