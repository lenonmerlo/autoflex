import { useEffect, useState } from "react";

import ConfirmModal from "../../shared/components/ConfirmModal";
import Modal from "../../shared/components/Modal";
import PageLayout from "../../shared/components/PageLayout";

import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";

import { createProduct } from "../../../application/products/usecases/createProduct";
import { deleteProduct } from "../../../application/products/usecases/deleteProduct";
import { listProducts } from "../../../application/products/usecases/listProducts";
import { updateProduct } from "../../../application/products/usecases/updateProduct";

import BillOfMaterialsSection from "../components/bom/BillOfMaterialsSection";

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function load() {
    try {
      setLoadingList(true);
      setError(null);
      const data = await listProducts();
      setItems(data);
    } catch {
      setError("Could not load products.");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(formData) {
    try {
      setLoadingSave(true);
      setError(null);
      setSuccess(null);

      if (selected?.id) {
        const updated = await updateProduct(selected.id, formData);
        setItems((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        );
        setSelected(null);
        setSuccess("Product updated successfully.");
      } else {
        const created = await createProduct(formData);
        setItems((prev) => [created, ...prev]);
        setSuccess("Product created successfully.");
      }
    } catch (e) {
      setError(e?.message || "Operation failed.");
    } finally {
      setLoadingSave(false);
    }
  }

  async function handleDelete(product) {
    setConfirmDelete(product);
  }

  async function confirmDeleteProduct() {
    if (!confirmDelete) return;

    try {
      setError(null);
      setSuccess(null);

      await deleteProduct(confirmDelete.id);
      setItems((prev) => prev.filter((p) => p.id !== confirmDelete.id));

      if (selected?.id === confirmDelete.id) setSelected(null);
      setSuccess("Product deleted successfully.");
    } catch (e) {
      setError(e?.message || "Could not delete product.");
    } finally {
      setConfirmDelete(null);
    }
  }

  function handleEdit(product) {
    setSuccess(null);
    setError(null);
    setSelected(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setSelected(null);
  }

  const modal = error
    ? { type: "error", title: "Error", message: error }
    : success
      ? { type: "success", title: "Success", message: success }
      : null;

  return (
    <PageLayout title="Products" subtitle="Manage your registered products.">
      <ConfirmModal
        open={Boolean(confirmDelete)}
        title="Confirm deletion"
        message={
          confirmDelete
            ? `Delete product "${confirmDelete.name}"?`
            : "Delete product?"
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDeleteProduct}
        onClose={() => setConfirmDelete(null)}
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

      <ProductForm
        key={selected?.id ?? "new"}
        onSubmit={handleSubmit}
        loading={loadingSave}
        initialValues={selected}
        onCancelEdit={handleCancelEdit}
      />
      {selected?.id && <BillOfMaterialsSection product={selected} />}
      <ProductTable
        items={items}
        loading={loadingList}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </PageLayout>
  );
}
