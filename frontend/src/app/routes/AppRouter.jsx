import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProductionSuggestionsPage from "../../presentation/productionSuggestions/pages/ProductionSuggestionsPage";
import ProductRawMaterialsPage from "../../presentation/productRawMaterials/pages/ProductRawMaterialsPage";
import ProductsPage from "../../presentation/products/pages/ProductsPage";
import RawMaterialsPage from "../../presentation/rawMaterials/pages/RawMaterialsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/raw-materials" element={<RawMaterialsPage />} />
        <Route
          path="/production-suggestions"
          element={<ProductionSuggestionsPage />}
        />
        <Route
          path="/product-raw-materials"
          element={<ProductRawMaterialsPage />}
        />
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
