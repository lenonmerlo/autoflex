import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductsPage from "../../presentation/products/pages/ProductsPage";
import RawMaterialsPage from "../../presentation/rawMaterials/pages/RawMaterialsPage";

export default function AppRouter() {
    return (
       <BrowserRouter>
            <Routes>
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/raw-materials" element={<RawMaterialsPage />} />
                <Route path="*" element={<Navigate to="/products" replace />} />
                <Route path="/" element={<Navigate to="/products" replace />} />
            </Routes>
    
       </BrowserRouter>
    )
}