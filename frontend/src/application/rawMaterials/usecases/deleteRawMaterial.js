import { rawMaterialRepository } from "../../../infrastructure/repositories/rawMaterialRepository";

export async function deleteRawMaterial(id) {
    if (!id) throw new Error("Raw material id is required.");
    await rawMaterialRepository.remove(id);
}