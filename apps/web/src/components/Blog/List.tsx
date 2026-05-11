import type { Product } from "@prisma/client";

export function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) return <div>0 products.</div>

  return (
    <div className="py-6 grid grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <p className="font-semibold">{product.name}</p>
          <p className="text-gray-500 text-sm">{product.description}</p>
          <p className="font-bold text-indigo-600 mt-2">${product.price}</p>
        </div>
      ))}
    </div>
  );
}
export default ProductList;