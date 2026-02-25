import { productRepository } from "../../../infrastructure/repositories/productRepository";

export function listProducts(productRepo = productRepository) {
  if (!productRepo) throw new Error("Product repository is not configured.");
  return productRepo.list();
}
