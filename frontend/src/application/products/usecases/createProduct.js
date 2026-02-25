import { productRepository } from "../../../infrastructure/repositories/productRepository";

function validate(payload) {
  if (!payload.code?.trim()) throw new Error("Code is required.");
  if (!payload.name?.trim()) throw new Error("Name is required.");
  if (
    payload.price === "" ||
    payload.price === null ||
    payload.price === undefined
  )
    throw new Error("Price is required.");
  if (Number.isNaN(Number(payload.price)))
    throw new Error("Price must be a number.");
  if (Number(payload.price) < 0) throw new Error("Price must be >= 0.");
}

export async function createProduct(productRepo = productRepository, payload) {
  const isOverloadCall = payload === undefined;
  const repo = isOverloadCall ? productRepository : productRepo;
  const input = isOverloadCall ? productRepo : payload;

  if (!repo) throw new Error("Product repository is not configured.");
  validate(input);

  const dto = {
    id: null,
    code: input.code.trim(),
    name: input.name.trim(),
    price: Number(input.price),
  };

  return repo.create(dto);
}
