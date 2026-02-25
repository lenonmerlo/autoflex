import { useEffect, useState } from "react";

import PageLayout from "../../shared/components/PageLayout";
import Alert from "../../shared/components/Alert";

import { getProductionSuggestions } from "../../../application/productionSuggestions/usecases/getProductionSuggestions";
import ProductionSuggestionTable from "../components/ProductionSuggestionTable";

export default function ProductionSuggestionsPage() {
  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState(null);

  const totalValue = items.reduce(
    (acc, item) => acc + Number(item.totalValue || 0),
    0
  );

  async function load() {
    try {
      setLoadingList(true);
      setError(null);
      const data = await getProductionSuggestions();
      setItems(data);
    } catch {
      setError("Could not load production suggestions.");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <PageLayout
      title="Production Suggestions"
      subtitle="Products that can be produced with current raw material stock."
    >
      {error && <Alert type="error" message={error} />}

      <div className="summary-card">
        <div>
          <strong>Total Products:</strong> {items.length}
        </div>
        <div>
          <strong>Total Production Value:</strong>{" "}
          {totalValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>

        <button onClick={load} disabled={loadingList}>
          {loadingList ? "Recalculating..." : "Recalculate"}
        </button>
      </div>

      <ProductionSuggestionTable items={items} loading={loadingList} />
    </PageLayout>
  );
}