export default function ProductionSuggestionTable({ items, loading }) {
    if (loading) return <p>Loading production suggestions...</p>;
    if (!items?.length) return <p>No producible products found.</p>;

    const formatCurrency = (value) =>
        Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const total = items.reduce((acc, item) => acc + Number(item.totalValue || 0), 0);

    return (
        <div className="card">
            <div className="card-header">
                <h3>Production Suggestions</h3>
            </div>

            <div className="table-wrap">
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
                            <td colSpan={5} style={{ textAlign: "right", fontWeight: 700 }}>Total</td>
                            <td style={{ fontWeight: 700 }}>{formatCurrency(total)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

        </div>
    );
}