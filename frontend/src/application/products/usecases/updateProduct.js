import { productRepository } from "../../../infrastructure/repositories/productRepository";

export async function updateProduct(id, input) {
    if (!id) throw new Error("product id is required.");

    const code = (input.code ?? "").trim();
    const name = (input.name ?? "").trim();
    const price = Number(input.price);

    if(!code) throw new Error("Product code is required.");
    if(!name) throw new Error("Product name is required.");
    if(Number.isNaN(price)) throw new Error("Product price must be a number.");
    if (price < 0) throw new Error("Product price cannot be negative.");

    return productRepository.update(id, { code, name, price });
    
}