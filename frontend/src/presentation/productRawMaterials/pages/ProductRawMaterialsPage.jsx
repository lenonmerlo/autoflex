import { useCallback, useEffect, useMemo, useState } from "react";

import Modal from "../../shared/components/Modal";
import PageLayout from "../../shared/components/PageLayout";

import { listProducts } from "../../../application/products/usecases/listProducts";
import BillOfMaterialsSection from "../../products/components/bom/BillOfMaterialsSection";

export default function ProductRawMaterialsPage() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedProduct = useMemo(() => {
    const id = Number(productId);
    if (!id) return null;
    return products.find((p) => p.id === id) ?? null;
  }, [productId, products]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listProducts();
      setProducts(data);

      if (data.length > 0) {
        setProductId((prev) => prev || String(data[0].id));
      }
    } catch {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PageLayout
      title="Product–Raw Material"
      subtitle="Select a product to manage its bill of materials."
    >
      <Modal open={Boolean(error)} title="Error" onClose={() => setError(null)}>
        {error ? (
          <div className="modalMessage modalMessage--error">{error}</div>
        ) : null}
      </Modal>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Product</h3>
          <button
            className="btn btn-secondary"
            onClick={load}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="formGrid">
            <label>
              Select product
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {selectedProduct ? (
        <BillOfMaterialsSection product={selectedProduct} />
      ) : null}
    </PageLayout>
  );
}
