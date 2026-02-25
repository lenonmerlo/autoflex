export default function ProductionSuggestionTable({ items, loading }) {
  if (loading) return <p>Loading production suggestions...</p>;
  if (!items?.length) return <p>No producible products found.</p>;

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  });
  const formatCurrency = (value) => currency.format(Number(value) || 0);

  const total = items.reduce(
    (acc, item) => acc + Number(item.totalValue || 0),
    0,
  );

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">Production Suggestions</h3>
      </div>

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Unit Price</th>
              <th>Producible Qty</th>
              <th>Total Value</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p) => (
              <tr key={p.productId}>
                <td>{p.productId}</td>
                <td>{p.productCode}</td>
                <td>{p.productName}</td>
                <td>{formatCurrency(p.unitPrice)}</td>
                <td>{p.producibleQuantity}</td>
                <td>{formatCurrency(p.totalValue)}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={5} className="tableFooterLabel">
                Total
              </td>
              <td className="tableFooterValue">{formatCurrency(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
