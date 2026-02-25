import { useEffect, useState } from "react";

import Alert from "../../shared/components/Alert";
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
    const ok = window.confirm(`Delete raw material "${rawMaterial.name}"?`);
    if (!ok) return;

    try {
      await deleteRawMaterial(rawMaterial.id);
      setItems((prev) => prev.filter((rm) => rm.id !== rawMaterial.id));
      setSuccess("Raw material deleted successfully.");
    } catch (e) {
      setError(e.message);
    }
  }

  function handleEdit(rawMaterial) {
    setSelected(rawMaterial);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setSelected(null);
  }

  return (
    <PageLayout title="Raw Materials">
      <p>Manage raw materials stock.</p>

      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <RawMaterialForm
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
