export type Product = {
  id?: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  onSpecial?: boolean;
  imageUrl: string;
  category: string;
  subcategory: string;
  stock: number;
  active: boolean;
};

export const products: Product[] = [
  { name: "Chicken Breast", description: "Free range chicken breast", price: 12.99, salePrice: 9.99, onSpecial: true, imageUrl: "https://i.postimg.cc/9QDVPHhp/image.png", category: "meat-seafood", subcategory: "Chicken", stock: 50, active: true },
  { name: "Beef Mince", description: "500g lean beef mince", price: 8.99, imageUrl: "", category: "meat-seafood", subcategory: "Beef", stock: 30, active: true },
  { name: "Lamb Chops", description: "Fresh lamb chops", price: 15.99, imageUrl: "", category: "meat-seafood", subcategory: "Lamb", stock: 20, active: true },
  { name: "Atlantic Salmon", description: "Fresh Atlantic salmon fillet", price: 18.99, salePrice: 14.99, onSpecial: true, imageUrl: "", category: "meat-seafood", subcategory: "Seafood", stock: 25, active: true },
  { name: "Bananas", description: "1kg bunch of bananas", price: 3.49, imageUrl: "", category: "fruit-veg", subcategory: "Fruit", stock: 100, active: true },
  { name: "Strawberries", description: "250g punnet of strawberries", price: 4.99, salePrice: 3.49, onSpecial: true, imageUrl: "", category: "fruit-veg", subcategory: "Fruit", stock: 60, active: true },
  { name: "Broccoli", description: "Fresh broccoli head", price: 2.99, imageUrl: "", category: "fruit-veg", subcategory: "Vegetables", stock: 80, active: true },
  { name: "Carrots", description: "1kg bag of carrots", price: 1.99, imageUrl: "", category: "fruit-veg", subcategory: "Vegetables", stock: 90, active: true },
  { name: "Full Cream Milk", description: "2L full cream milk", price: 3.99, imageUrl: "", category: "dairy-fridge", subcategory: "Milk", stock: 70, active: true },
  { name: "Cheddar Cheese", description: "500g block of cheddar", price: 7.99, imageUrl: "", category: "dairy-fridge", subcategory: "Cheese", stock: 40, active: true },
  { name: "Free Range Eggs", description: "Dozen free range eggs", price: 6.99, salePrice: 5.49, onSpecial: true, imageUrl: "", category: "dairy-fridge", subcategory: "Eggs", stock: 55, active: true },
  { name: "Sourdough Bread", description: "Fresh baked sourdough loaf", price: 5.99, imageUrl: "", category: "bakery", subcategory: "Bread", stock: 30, active: true },
  { name: "Croissants", description: "Pack of 4 butter croissants", price: 4.99, imageUrl: "", category: "bakery", subcategory: "Cakes & Pastries", stock: 25, active: true },
  { name: "Salt & Vinegar Chips", description: "175g bag", price: 3.49, imageUrl: "", category: "snacks", subcategory: "Chips & Crackers", stock: 60, active: true },
  { name: "Milk Chocolate Block", description: "200g milk chocolate", price: 4.49, imageUrl: "", category: "snacks", subcategory: "Chocolate", stock: 45, active: true },
];