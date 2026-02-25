import { useState } from "react";

export default function RawMaterialForm({
  onSubmit,
  loading,
  initialValues,
  onCancelEdit,
}) {
  const isEditMode = Boolean(initialValues?.id);

  const [code, setCode] = useState(() => initialValues?.code ?? "");
  const [name, setName] = useState(() => initialValues?.name ?? "");
  const [stockQuantity, setStockQuantity] = useState(
    () => initialValues?.stockQuantity ?? "",
  );

  async function handleSubmit(e) {
    e.preventDefault();

    await onSubmit({
      code: code.trim(),
      name: name.trim(),
      stockQuantity: Number(stockQuantity),
    });

    if (!isEditMode) {
      setCode("");
      setName("");
      setStockQuantity("");
    }
  }

  const disabled =
    loading ||
    !code.trim() ||
    !name.trim() ||
    stockQuantity === "" ||
    Number(stockQuantity) < 0;

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="cardHeader">
        <h3 className="cardTitle">
          {isEditMode ? "Edit raw material" : "Create raw material"}
        </h3>
        {isEditMode && onCancelEdit && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>

      <div className="formGrid">
        <label>
          Code
          <input
            data-testid="raw-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>

        <label>
          Name
          <input
            data-testid="raw-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Stock Quantity
          <input
            type="number"
            min="0"
            step="any"
            data-testid="raw-stock"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
          />
        </label>
      </div>

      <div className="actions">
        <button
          data-testid="raw-submit"
          className="btn btn-primary"
          type="submit"
          disabled={disabled}
        >
          {loading ? "Saving..." : isEditMode ? "Save changes" : "Create"}
        </button>
      </div>
    </form>
  );
}
