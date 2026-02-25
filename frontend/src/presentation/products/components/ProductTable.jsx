export default function ProductTable({ items, onEdit, onDelete, loading }) {
  if (loading) return <p>Loading products...</p>;
  if (!items?.length) return <p>No products found.</p>;

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  });
  const formatCurrency = (value) => currency.format(Number(value) || 0);

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">Products</h3>
      </div>

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Price</th>
              <th className="colActions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.code}</td>
                <td>{p.name}</td>
                <td>{formatCurrency(p.price)}</td>
                <td className="colActions">
                  <div className="rowActions">
                    <button
                      type="button"
                      className="iconBtn"
                      onClick={() => onEdit(p)}
                      aria-label={`Edit product ${p.name}`}
                      title="Edit"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="iconBtn iconBtn--danger"
                      onClick={() => onDelete(p)}
                      aria-label={`Delete product ${p.name}`}
                      title="Delete"
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
