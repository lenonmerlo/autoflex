import { rawMaterialRepository } from "../../../infrastructure/repositories/rawMaterialRepository";

export async function listRawMaterials() {
    return rawMaterialRepository.list();
}