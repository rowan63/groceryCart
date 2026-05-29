"use client";
import { useState } from "react";
import type { Product } from "@prisma/client";
import { updateProduct, createProduct } from "../actions";

type Errors = {
    _errors?: string[];
    name?: { _errors: string[] };
    description?: { _errors: string[] };
    price?: { _errors: string[] };
    category?: { _errors: string[] };
    subcategory?: { _errors: string[] };
    stock?: { _errors: string[] };
};

export function ProductForm({ product }: { product?: Product }) {
    const [name, setName] = useState(product?.name ?? "");
    const [description, setDescription] = useState(product?.description ?? "");
    const [price, setPrice] = useState(product?.price.toString() ?? "");
    const [category, setCategory] = useState(product?.category ?? "");
    const [subcategory, setSubcategory] = useState(product?.subcategory ?? "");
    const [stock, setStock] = useState(product?.stock.toString() ?? "");
    const [errors, setErrors] = useState<Errors>({});
    const [saveError, setSaveError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    async function handleSave() {
        setErrors({});
        setSaveError("");
        setSuccessMessage("");

        const formData = new FormData();
        formData.set("name", name);
        formData.set("description", description);
        formData.set("price", price);
        formData.set("category", category);
        formData.set("subcategory", subcategory);
        formData.set("stock", stock);

        const result = product
            ? await updateProduct(product.id, formData)
            : await createProduct(formData);

        if (result?.error) {
            setErrors(result.error as unknown as Errors);
            setSaveError("Please fix the errors before saving");
        } else {
            setSuccessMessage(product ? "Product updated successfully" : "Product created successfully");
        }
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                        <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                        {errors.name?._errors?.[0] && <p className="text-xs text-red-500">{errors.name._errors[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
                        {errors.description?._errors?.[0] && <p className="text-xs text-red-500">{errors.description._errors[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="price" className="text-sm font-medium text-gray-700">Price</label>
                        <input id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                        {errors.price?._errors?.[0] && <p className="text-xs text-red-500">{errors.price._errors[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                            <option value="">Select a category</option>
                            <option value="meat-seafood">Poultry, Meat & Seafood</option>
                            <option value="fruit-veg">Fruit & Veg</option>
                            <option value="dairy-fridge">Dairy, Eggs & Fridge</option>
                            <option value="bakery">Bakery</option>
                            <option value="snacks">Snacks & Confectionery</option>
                        </select>
                        {errors.category?._errors?.[0] && <p className="text-xs text-red-500">{errors.category._errors[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="subcategory" className="text-sm font-medium text-gray-700">Subcategory</label>
                        <input id="subcategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                        {errors.subcategory?._errors?.[0] && <p className="text-xs text-red-500">{errors.subcategory._errors[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="stock" className="text-sm font-medium text-gray-700">Stock</label>
                        <input id="stock" value={stock} onChange={(e) => setStock(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                        {errors.stock?._errors?.[0] && <p className="text-xs text-red-500">{errors.stock._errors[0]}</p>}
                    </div>
                    {saveError && <p className="text-sm text-red-500 font-medium">{saveError}</p>}
                    {successMessage && <p className="text-sm text-green-500 font-medium">{successMessage}</p>}
                    <button type="button" onClick={handleSave} className="self-start bg-gray-900 text-white rounded-md px-5 py-2 text-sm font-medium hover:bg-gray-700">Save</button>
                </div>
            </div>
        </main>
    );
}