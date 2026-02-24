import { useState } from "react";

export default function ProductForm({
  onSubmit,
  loading,
  initialValues,
  onCancelEdit,
}) {
  const isEditMode = Boolean(initialValues?.id);

  const [code, setCode] = useState(() => initialValues?.code ?? "");
  const [name, setName] = useState(() => initialValues?.name ?? "");
  const [price, setPrice] = useState(() => initialValues?.price ?? "");

  async function handleSubmit(e) {
    e.preventDefault();

    await onSubmit({
      code: code.trim(),
      name: name.trim(),
      price: price === "" ? "" : Number(price),
    });

    if (!isEditMode) {
      setCode("");
      setName("");
      setPrice("");
    }
  }

  const disabled =
    loading ||
    !code.trim() ||
    !name.trim() ||
    price === "" ||
    Number(price) < 0;

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="card-header">
        <h3>{isEditMode ? "Edit product" : "Create product"}</h3>
        {isEditMode && onCancelEdit && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancelEdit}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid">
        <label>
          Code
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="PRD-001"
          />
        </label>

        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
          />
        </label>

        <label>
          Price
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
          />
        </label>
      </div>

      <div className="actions">
        <button type="submit" disabled={disabled}>
          {loading ? "Saving..." : isEditMode ? "Save changes" : "Create"}
        </button>
      </div>
    </form>
  );
}
