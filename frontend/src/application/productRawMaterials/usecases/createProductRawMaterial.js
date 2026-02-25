import { productRawMaterialRepository } from "../../../infrastructure/repositories/productRawMaterialRepository";

export async function createProductRawMaterial(input) {
    const productId = Number(input.productId);
    const rawMaterialId = Number(input.rawMaterialId);
    const requiredQuantity = Number(input.requiredQuantity);

    if (!productId) throw new Error("Product id is required.");
    if (!rawMaterialId) throw new Error("Raw material is required.");
    if (Number.isNaN(requiredQuantity)) throw new Error("Required quantity must be a number.");
    if (requiredQuantity <= 0) throw new Error("Required quantity must be greater than zero.");

    return productRawMaterialRepository.create({ productId, rawMaterialId, requiredQuantity });

}
