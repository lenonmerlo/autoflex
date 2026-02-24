import { apiClient } from "../http/apiClient";

export const rawMaterialRepository = {
    async list() {
        const { data } = await apiClient.get("/raw-materials");
        return data;
    },

    async create(rawMaterial) {
        const { data } = await apiClient.post("/raw-materials", rawMaterial);
        return data;
    },

    async update(id, rawMaterial) {
        const { data } = await apiClient.put(`/raw-materials/${id}`, rawMaterial);
        return data;
    },

    async remove(id) {
        await apiClient.delete(`/raw-materials/${id}`);
    }
};