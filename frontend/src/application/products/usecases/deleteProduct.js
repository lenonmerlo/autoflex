import { productRepository } from "../../../infrastructure/repositories/productRepository";

export async function deleteProduct(id) {
    if (!id) throw new Error("Product id is required.");
    await productRepository.remove(id);
}