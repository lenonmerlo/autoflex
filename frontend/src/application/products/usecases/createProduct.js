function validate(payload) {
    if (!payload.code?.trim()) throw new Error("Code is required.");
    if (!payload.name?.trim()) throw new Error("Name is required.");
    if (payload.price === "" || payload.price === null || payload.price === undefined)
        throw new Error("Price is required.");
    if (Number.isNaN(Number(payload.price))) throw new Error("Price must be a number.");
    if (Number(payload.price) < 0) throw new Error("Price must be >= 0.");
}

export async function createProduct(productRepo, payload) {
    validate(payload);

    const dto = {
        id: null,
        code: payload.code.trim(),
        name: payload.name.trim(),
        price: Number(payload.price),
    };

    return productRepo.create(dto);
}