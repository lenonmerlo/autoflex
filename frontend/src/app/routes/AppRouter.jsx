import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductsPage from "../../presentation/products/pages/ProductsPage";

export default function AppRouter() {
    return (
       <BrowserRouter>
            <Routes>
                <Route path="/products" element={<ProductsPage />} />
                <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
    
       </BrowserRouter>
    )
}