import { productRawMaterialRepository } from "../../../infrastructure/repositories/productRawMaterialRepository";

export async function updateProductRawMaterial(id, input) {
    if (!id) throw new Error("Association id is required.");

    const productId = Number(input.productId);
    const rawMaterialId = Number(input.rawMaterialId);
    const requiredQuantity = Number(input.requiredQuantity);

    if (!productId) throw new Error("Product id is required.");
    if (!rawMaterialId) throw new Error("Raw material id is required.");
    if (Number.isNaN(requiredQuantity)) throw new Error("Required quantity must be a number.");
    if (requiredQuantity <= 0) throw new Error("Required quantity must be greater than zero.");

  return productRawMaterialRepository.update(id, { productId, rawMaterialId, requiredQuantity });
}