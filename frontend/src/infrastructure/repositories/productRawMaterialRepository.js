import { apiClient } from "../http/apiClient";

export const productRawMaterialRepository = {
    async listByProduct(productId) {
        const { data } = await apiClient.get(`/product-raw-materials/by-product/${productId}`);
        return data;
    },

    async create(input) {
        const { data } = await apiClient.post("/product-raw-materials", input);
        return data;
    },

    async update(id, input) {
        const { data } = await apiClient.put(`/product-raw-materials/${id}`, input);
        return data;
    },

    async remove(id) {
        await apiClient.delete(`/product-raw-materials/${id}`);
    },
}