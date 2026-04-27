import "dotenv/config";
import { prisma } from "../src/shared/lib/prisma.ts";

async function seedProducts() {
  const products = [
    { title: "Gaming Mouse", price: 49.99, stock: 30 },
    { title: "Mechanical Keyboard", price: 89.5, stock: 20 },
    { title: "USB-C Hub", price: 34.0, stock: 50 },
    { title: "27-inch Monitor", price: 219.99, stock: 12 },
    { title: "Laptop Stand", price: 27.5, stock: 40 },
  ];

  await prisma.product.createMany({
    data: products,
  });

  const insertedProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  console.log("Seeded products:", insertedProducts);
}

seedProducts()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
