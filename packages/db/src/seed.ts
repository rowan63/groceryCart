export async function seed() {
  const { client } = await import("./client.js");
  const { products } = await import("./data.js");

  await client.db.orderItem.deleteMany();
  await client.db.order.deleteMany();
  await client.db.product.deleteMany();
  await client.db.user.deleteMany();

  await client.db.user.create({
    data: {
      email: "test@test.com",
      password: "password",
      name: "Test User",
      role: "user",
    },
  });

  await client.db.user.create({
    data: {
      email: "admin@test.com",
      password: "password",
      name: "Admin User",
      role: "admin",
    },
  });

  for (const product of products) {
    await client.db.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        subcategory: product.subcategory,
        stock: product.stock,
        active: product.active,
      },
    });
  }
}

seed();