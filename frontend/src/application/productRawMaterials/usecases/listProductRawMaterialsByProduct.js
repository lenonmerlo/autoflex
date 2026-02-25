import { productRawMaterialRepository } from "../../../infrastructure/repositories/productRawMaterialRepository";

export async function listProductRawMaterialsByProduct(productId) {
    if (!productId) throw new Error("Product id is required.");
    return productRawMaterialRepository.listByProduct(productId);
}