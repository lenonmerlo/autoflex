import { apiClient } from "../http/apiClient";

export const productionSuggestionRepository = {
    async list() {
        const { data } = await apiClient.get("/production-suggestions");
        return data;
    }
}