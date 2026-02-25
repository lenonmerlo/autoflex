import { useEffect, useState } from "react";

import Modal from "../../shared/components/Modal";
import PageLayout from "../../shared/components/PageLayout";

import { getProductionSuggestions } from "../../../application/productionSuggestions/usecases/getProductionSuggestions";
import ProductionSuggestionTable from "../components/ProductionSuggestionTable";

export default function ProductionSuggestionsPage() {
  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState(null);

  const totalValue = items.reduce(
    (acc, item) => acc + Number(item.totalValue || 0),
    0,
  );
  const feasibleCount = items.filter(
    (item) => Number(item.producibleQuantity || 0) > 0,
  ).length;

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  });

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
      action={
        <button
          className="btn btn-secondary"
          onClick={load}
          disabled={loadingList}
        >
          {loadingList ? "Recalculating..." : "Recalculate"}
        </button>
      }
    >
      <Modal open={Boolean(error)} title="Error" onClose={() => setError(null)}>
        {error ? (
          <div className="modalMessage modalMessage--error">{error}</div>
        ) : null}
      </Modal>

      <div className="statsGrid">
        <div className="card">
          <div className="statLabel">Total products</div>
          <div className="statValue">{items.length}</div>
          <div className="statHint">Based on current stock snapshot</div>
        </div>

        <div className="card">
          <div className="statLabel">Feasible suggestions</div>
          <div className="statValue">{feasibleCount}</div>
          <div className="statHint">With producible quantity above 0</div>
        </div>

        <div className="card">
          <div className="statLabel">Total production value</div>
          <div className="statValue">{currency.format(totalValue)}</div>
          <div className="statHint">Sum of all suggestion totals</div>
        </div>
      </div>

      <ProductionSuggestionTable items={items} loading={loadingList} />
    </PageLayout>
  );
}
