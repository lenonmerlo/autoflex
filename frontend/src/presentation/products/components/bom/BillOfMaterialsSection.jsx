import { useEffect, useMemo, useState } from "react";
import Alert from "../../../shared/components/Alert";

import { listRawMaterials } from "../../../../application/rawMaterials/usecases/listRawMaterials";
import { listProductRawMaterialsByProduct } from "../../../../application/productRawMaterials/usecases/listProductRawMaterialsByProduct";
import { createProductRawMaterial } from "../../../../application/productRawMaterials/usecases/createProductRawMaterial";
import { updateProductRawMaterial } from "../../../../application/productRawMaterials/usecases/updateProductRawMaterial";
import { deleteProductRawMaterial } from "../../../../application/productRawMaterials/usecases/deleteProductRawMaterial";

export default function BillOfMaterialsSection({ product }) {
  const productId = product?.id;

  const [rawMaterials, setRawMaterials] = useState([]);
  const [items, setItems] = useState([]);

  const [rawMaterialId, setRawMaterialId] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const rawMaterialsMap = useMemo(() => {
    const map = new Map();
    rawMaterials.forEach((rm) => map.set(rm.id, rm));
    return map;
  }, [rawMaterials]);

  async function loadAll() {
    if (!productId) return;
    try {
      setLoading(true);
      setError(null);

      const [rmData, assocData] = await Promise.all([
        listRawMaterials(),
        listProductRawMaterialsByProduct(productId),
      ]);

      setRawMaterials(rmData);
      setItems(assocData);
    } catch (e) {
      setError(e?.message || "Could not load bill of materials.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function handleAdd(e) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const created = await createProductRawMaterial({
        productId,
        rawMaterialId,
        requiredQuantity,
      });

      setItems((prev) => [created, ...prev]);
      setRawMaterialId("");
      setRequiredQuantity("");
      setSuccess("Raw material added to product.");
    } catch (e) {
      setError(e?.message || "Could not add raw material.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateRequired(item, newQty) {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updated = await updateProductRawMaterial(item.id, {
        productId: item.productId,
        rawMaterialId: item.rawMaterialId,
        requiredQuantity: newQty,
      });

      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setSuccess("Required quantity updated.");
    } catch (e) {
      setError(e?.message || "Could not update required quantity.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(item) {
    const rm = rawMaterialsMap.get(item.rawMaterialId);
    const ok = window.confirm(`Remove "${rm?.name ?? "raw material"}" from this product?`);
    if (!ok) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await deleteProductRawMaterial(item.id);
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      setSuccess("Association removed.");
    } catch (e) {
      setError(e?.message || "Could not remove association.");
    } finally {
      setSaving(false);
    }
  }

  if (!productId) return null;

  return (
    <div className="card">
      <div className="card-header">
        <h3>Bill of Materials (BOM)</h3>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <form onSubmit={handleAdd} className="grid">
        <label>
          Raw Material
          <select value={rawMaterialId} onChange={(e) => setRawMaterialId(e.target.value)}>
            <option value="">Select...</option>
            {rawMaterials.map((rm) => (
              <option key={rm.id} value={rm.id}>
                {rm.code} - {rm.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Required Quantity
          <input
            type="number"
            min="0"
            step="0.01"
            value={requiredQuantity}
            onChange={(e) => setRequiredQuantity(e.target.value)}
            placeholder="e.g. 2"
          />
        </label>

        <div className="actions">
          <button
            type="submit"
            disabled={saving || loading || !rawMaterialId || requiredQuantity === "" || Number(requiredQuantity) <= 0}
          >
            {saving ? "Saving..." : "Add"}
          </button>
          <button type="button" className="btn-secondary" onClick={loadAll} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading BOM...</p>
      ) : items.length === 0 ? (
        <p>No raw materials associated with this product.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Raw Material</th>
                <th>Required Quantity</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => {
                const rm = rawMaterialsMap.get(it.rawMaterialId);
                return (
                  <tr key={it.id}>
                    <td>{it.id}</td>
                    <td>
                      {rm ? `${rm.code} - ${rm.name}` : `RawMaterial #${it.rawMaterialId}`}
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={it.requiredQuantity}
                        onBlur={(e) => {
                          const newQty = Number(e.target.value);
                          if (!Number.isNaN(newQty) && newQty > 0 && newQty !== it.requiredQuantity) {
                            handleUpdateRequired(it, newQty);
                          } else {
                            e.target.value = it.requiredQuantity;
                          }
                        }}
                      />
                    </td>
                    <td className="row">
                      <button className="btn-danger" onClick={() => handleRemove(it)} disabled={saving}>
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}