import type { Inventory } from "./models/Inventory.ts";
import { Product } from "./models/Product.ts";
import { ProductSpec } from "./models/ProductSpec.ts";

export function initalizeInventory(inventory: Inventory) {
  const products = [
    { id: "p1", title: "Laptop", price: 1500 },
    { id: "p2", title: "Gaming Laptop", price: 2300 },
    { id: "p3", title: "Mouse", price: 25.5 },
    { id: "p4", title: "Wireless Mouse", price: 40 },
    { id: "p5", title: "Keyboard", price: 75 },
    { id: "p6", title: "Mechanical Keyboard", price: 120 },
    { id: "p7", title: 'Monitor 24"', price: 320 },
    { id: "p8", title: 'Monitor 27"', price: 450 },
    { id: "p9", title: "Headphones", price: 60 },
    { id: "p10", title: "Wireless Headphones", price: 110 },
    { id: "p11", title: "Webcam", price: 55 },
    { id: "p12", title: "USB-C Hub", price: 45 },
    { id: "p13", title: "External SSD 1TB", price: 140 },
    { id: "p14", title: "External HDD 2TB", price: 95 },
    { id: "p15", title: "Flash Drive 64GB", price: 15 },
    { id: "p16", title: "Flash Drive 128GB", price: 25 },
    { id: "p17", title: "Power Bank 20000mAh", price: 65 },
    { id: "p18", title: "Phone Charger", price: 20 },
    { id: "p19", title: "Smartphone Stand", price: 12 },
    { id: "p20", title: "Bluetooth Speaker", price: 85 },
  ];

  for (const { id, title, price } of products) {
    let spec = new ProductSpec(title, price);
    let prodcut = new Product(id, spec);

    inventory.add(prodcut, 5);
  }
}
