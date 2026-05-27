import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
prisma.unit.findMany({ select: { slug: true, title: true } })
  .then(units => units.forEach(u => console.log(u.slug, "|", u.title)))
  .finally(() => prisma.$disconnect());
