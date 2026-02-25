import { productionSuggestionRepository } from "../../../infrastructure/repositories/productionSuggestionRepository";

export async function getProductionSuggestions() {
    return productionSuggestionRepository.list();
    
}