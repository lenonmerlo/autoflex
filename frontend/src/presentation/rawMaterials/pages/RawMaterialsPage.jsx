import { useEffect, useState } from "react";

import ConfirmModal from "../../shared/components/ConfirmModal";
import Modal from "../../shared/components/Modal";
import PageLayout from "../../shared/components/PageLayout";

import RawMaterialForm from "../components/RawMaterialForm";
import RawMaterialTable from "../components/RawMaterialTable";

import { createRawMaterial } from "../../../application/rawMaterials/usecases/createRawMaterial";
import { deleteRawMaterial } from "../../../application/rawMaterials/usecases/deleteRawMaterial";
import { listRawMaterials } from "../../../application/rawMaterials/usecases/listRawMaterials";
import { updateRawMaterial } from "../../../application/rawMaterials/usecases/updateRawMaterial";

export default function RawMaterialsPage() {
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
      const data = await listRawMaterials();
      setItems(data);
    } catch {
      setError("Could not load raw materials.");
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
        const updated = await updateRawMaterial(selected.id, formData);
        setItems((prev) =>
          prev.map((rm) => (rm.id === updated.id ? updated : rm)),
        );
        setSelected(null);
        setSuccess("Raw material updated successfully.");
      } else {
        const created = await createRawMaterial(formData);
        setItems((prev) => [created, ...prev]);
        setSuccess("Raw material created successfully.");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingSave(false);
    }
  }

  async function handleDelete(rawMaterial) {
    setConfirmDelete(rawMaterial);
  }

  async function confirmDeleteRawMaterial() {
    if (!confirmDelete) return;

    try {
      await deleteRawMaterial(confirmDelete.id);
      setItems((prev) => prev.filter((rm) => rm.id !== confirmDelete.id));
      setSuccess("Raw material deleted successfully.");
    } catch (e) {
      setError(e.message);
    } finally {
      setConfirmDelete(null);
    }
  }

  function handleEdit(rawMaterial) {
    setError(null);
    setSuccess(null);
    setSelected(rawMaterial);
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
    <PageLayout title="Raw Materials" subtitle="Manage raw material stock.">
      <ConfirmModal
        open={Boolean(confirmDelete)}
        title="Confirm deletion"
        message={
          confirmDelete
            ? `Delete raw material "${confirmDelete.name}"?`
            : "Delete raw material?"
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDeleteRawMaterial}
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

      <RawMaterialForm
        key={selected?.id ?? "new"}
        onSubmit={handleSubmit}
        loading={loadingSave}
        initialValues={selected}
        onCancelEdit={handleCancelEdit}
      />

      <RawMaterialTable
        items={items}
        loading={loadingList}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </PageLayout>
  );
}
