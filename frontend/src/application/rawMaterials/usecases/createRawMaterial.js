import { rawMaterialRepository } from "../../../infrastructure/repositories/rawMaterialRepository";

export async function createRawMaterial(input) {
  const code = (input.code ?? "").trim();
  const name = (input.name ?? "").trim();
  const stockQuantity = Number(input.stockQuantity);

  if (!code) throw new Error("Raw material code is required.");
  if (!name) throw new Error("Raw material name is required.");
  if (Number.isNaN(stockQuantity))
    throw new Error("Stock quantity must be a number.");
  if (stockQuantity < 0) throw new Error("Stock quantity cannot be negative.");

  return rawMaterialRepository.create({
    code,
    name,
    stockQuantity,
  });
}
