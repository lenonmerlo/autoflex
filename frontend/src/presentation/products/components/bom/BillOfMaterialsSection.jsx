import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import Modal from "../../../shared/components/Modal";

import { createProductRawMaterial } from "../../../../application/productRawMaterials/usecases/createProductRawMaterial";
import { deleteProductRawMaterial } from "../../../../application/productRawMaterials/usecases/deleteProductRawMaterial";
import { listProductRawMaterialsByProduct } from "../../../../application/productRawMaterials/usecases/listProductRawMaterialsByProduct";
import { updateProductRawMaterial } from "../../../../application/productRawMaterials/usecases/updateProductRawMaterial";
import { listRawMaterials } from "../../../../application/rawMaterials/usecases/listRawMaterials";

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
  const [confirmRemove, setConfirmRemove] = useState(null);

  const modal = error
    ? { type: "error", title: "Error", message: error }
    : success
      ? { type: "success", title: "Success", message: success }
      : null;

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

  function handleRemove(item) {
    const rm = rawMaterialsMap.get(item.rawMaterialId);
    setConfirmRemove({
      item,
      rawMaterialName: rm?.name ?? "raw material",
    });
  }

  async function confirmRemoveAssociation() {
    if (!confirmRemove?.item) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await deleteProductRawMaterial(confirmRemove.item.id);
      setItems((prev) => prev.filter((x) => x.id !== confirmRemove.item.id));
      setSuccess("Association removed.");
    } catch (e) {
      setError(e?.message || "Could not remove association.");
    } finally {
      setSaving(false);
      setConfirmRemove(null);
    }
  }

  if (!productId) return null;

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">Bill of Materials (BOM)</h3>
      </div>

      <ConfirmModal
        open={Boolean(confirmRemove)}
        title="Confirm removal"
        message={
          confirmRemove
            ? `Remove "${confirmRemove.rawMaterialName}" from this product?`
            : "Remove raw material from this product?"
        }
        confirmLabel="Remove"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={confirmRemoveAssociation}
        onClose={() => setConfirmRemove(null)}
      />

      <Modal
        open={Boolean(modal)}
        title={modal?.title}
        onClose={() => {
          setError(null);
          setSuccess(null);
        }}
      >
        {modal ? (
          <div className={`modalMessage modalMessage--${modal.type}`}>
            {modal.message}
          </div>
        ) : null}
      </Modal>

      <form onSubmit={handleAdd}>
        <div className="formGrid">
          <label>
            Raw Material
            <select
              value={rawMaterialId}
              onChange={(e) => setRawMaterialId(e.target.value)}
            >
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
        </div>

        <div className="actions">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={
              saving ||
              loading ||
              !rawMaterialId ||
              requiredQuantity === "" ||
              Number(requiredQuantity) <= 0
            }
          >
            {saving ? "Saving..." : "Add"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadAll}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading BOM...</p>
      ) : items.length === 0 ? (
        <p>No raw materials associated with this product.</p>
      ) : (
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Raw Material</th>
                <th>Required Quantity</th>
                <th className="colActions">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => {
                const rm = rawMaterialsMap.get(it.rawMaterialId);
                return (
                  <tr key={it.id}>
                    <td>{it.id}</td>
                    <td>
                      {rm
                        ? `${rm.code} - ${rm.name}`
                        : `RawMaterial #${it.rawMaterialId}`}
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={it.requiredQuantity}
                        onBlur={(e) => {
                          const newQty = Number(e.target.value);
                          if (
                            !Number.isNaN(newQty) &&
                            newQty > 0 &&
                            newQty !== it.requiredQuantity
                          ) {
                            handleUpdateRequired(it, newQty);
                          } else {
                            e.target.value = it.requiredQuantity;
                          }
                        }}
                      />
                    </td>
                    <td className="colActions">
                      <div className="rowActions">
                        <button
                          type="button"
                          className="iconBtn iconBtn--danger"
                          onClick={() => handleRemove(it)}
                          disabled={saving}
                          aria-label={`Remove raw material from product`}
                          title="Remove"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                          </svg>
                        </button>
                      </div>
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
