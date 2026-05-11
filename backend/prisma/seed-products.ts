import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const products = [
  { title: "Wireless Mouse", price: 29.99, stock: 100 },
  { title: "Mechanical Keyboard", price: 89.99, stock: 50 },
  { title: 'USB-C Hub 7-in-1', price: 49.99, stock: 75 },
  { title: '27" 4K Monitor', price: 349.99, stock: 30 },
  { title: "HD Webcam 1080p", price: 79.99, stock: 60 },
  { title: "Noise Cancelling Headphones", price: 199.99, stock: 40 },
  { title: "Portable SSD 1TB", price: 129.99, stock: 45 },
  { title: "Ergonomic Standing Desk", price: 499.99, stock: 15 },
];

async function main() {
  for (const product of products) {
    await prisma.product.create({
      data: {
        title: product.title,
        price: product.price,
        stock: product.stock,
      },
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
