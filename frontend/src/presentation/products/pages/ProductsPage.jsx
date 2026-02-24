import { useEffect, useState } from "react";
import PageLayout from "../../shared/components/PageLayout";
import Alert from "../../shared/components/Alert";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";

import { productRepository } from "../../../infrastructure/repositories/productRepository";
import { listProducts } from "../../../application/products/usecases/listProducts";
import { createProduct } from "../../../application/products/usecases/createProduct";

export default function ProductPage() {
    const [items, setItems] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [error, setError] = useState("");

    async function load() {
        setError("");
        setLoadingList(true);
        try {
            const data = await listProducts(productRepository);
            setItems(data);
        } catch {
            setError("Failed to load products.");
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleCreate(form) {
        setError("");
        setLoadingCreate(true);
        try {
            await createProduct(productRepository, form);
            await load();
        } catch (e) {
            setError(e?.message || "Failed to create product.");
        } finally {
            setLoadingCreate(false);
        }        
    }

    return (
        <PageLayout title="Products">
            <ProductForm onSubmit={handleCreate} loading={loadingCreate} />
            {error && <Alert type="error">{error}</Alert>}
            {loadingList ? <p>Loading...</p> : <ProductTable items={items} />}
        </PageLayout>
    );
}