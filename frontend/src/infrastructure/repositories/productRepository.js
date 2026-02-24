import { apiClient } from "../http/apiClient";

export const productRepository = {
  async list() {
    const { data } = await apiClient.get("/products");
    return data;
  },

  async create(product) {
    const { data } = await apiClient.post("/products", product);
    return data;
  },

  async update(id, product) {
    const { data } = await apiClient.put(`/products/${id}`, product);
    return data;
  },

  async patch(id, partial) {
    const { data } = await apiClient.patch(`/products/${id}`, partial);
    return data;
  },

  async remove(id) {
    await apiClient.delete(`/products/${id}`);
  },
};