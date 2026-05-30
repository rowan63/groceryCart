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
            <div className="bg-[#1D9E75] px-6 h-16 flex items-center justify-between mb-8">
                <a href="/" className="text-xl font-bold text-white">FreshCart Admin</a>
                <a href="/" className="text-xs text-white border border-white/40 rounded-lg px-4 py-1.5 hover:bg-white/10 transition-colors">Back to products</a>
            </div>
            <div className="max-w-2xl mx-auto px-6 pb-8">
                <h1 className="text-lg font-semibold text-gray-900 mb-6">{product ? "Edit product" : "Add product"}</h1>
                <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="text-xs font-medium text-gray-600">Name</label>
                        <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
                        {errors.name?._errors?.[0] && <p className="text-xs text-red-400">{errors.name._errors[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="description" className="text-xs font-medium text-gray-600">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] resize-none" />
                        {errors.description?._errors?.[0] && <p className="text-xs text-red-400">{errors.description._errors[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="price" className="text-xs font-medium text-gray-600">Price</label>
                        <input id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
                        {errors.price?._errors?.[0] && <p className="text-xs text-red-400">{errors.price._errors[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="category" className="text-xs font-medium text-gray-600">Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]">
                            <option value="">Select a category</option>
                            <option value="meat-seafood">Poultry, Meat & Seafood</option>
                            <option value="fruit-veg">Fruit & Veg</option>
                            <option value="dairy-fridge">Dairy, Eggs & Fridge</option>
                            <option value="bakery">Bakery</option>
                            <option value="snacks">Snacks & Confectionery</option>
                        </select>
                        {errors.category?._errors?.[0] && <p className="text-xs text-red-400">{errors.category._errors[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="subcategory" className="text-xs font-medium text-gray-600">Subcategory</label>
                        <input id="subcategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
                        {errors.subcategory?._errors?.[0] && <p className="text-xs text-red-400">{errors.subcategory._errors[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="stock" className="text-xs font-medium text-gray-600">Stock</label>
                        <input id="stock" value={stock} onChange={(e) => setStock(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
                        {errors.stock?._errors?.[0] && <p className="text-xs text-red-400">{errors.stock._errors[0]}</p>}
                    </div>
                    {saveError && <p className="text-xs text-red-400 font-medium">{saveError}</p>}
                    {successMessage && <p className="text-xs text-[#1D9E75] font-medium">{successMessage}</p>}
                    <button type="button" onClick={handleSave} className="self-start bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-lg px-5 py-2 text-sm font-semibold transition-colors">Save</button>
                </div>
            </div>
        </main>
    );
}