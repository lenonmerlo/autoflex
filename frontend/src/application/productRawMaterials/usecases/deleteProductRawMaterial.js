import { productRawMaterialRepository } from "../../../infrastructure/repositories/productRawMaterialRepository";

export async function deleteProductRawMaterial(id) {
  if (!id) throw new Error("Association id is required.");
  await productRawMaterialRepository.remove(id);
}