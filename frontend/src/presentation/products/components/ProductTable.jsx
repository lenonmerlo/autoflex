export default function ProductTable({ items, onEdit, onDelete, loading }) {
  if (loading) return <p>Loading products...</p>;
  if (!items?.length) return <p>No products found.</p>;

  const formatCurrency = (value) =>
    Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="card">
      <div className="card-header">
        <h3>Products</h3>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Price</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.code}</td>
                <td>{p.name}</td>
                <td>{formatCurrency(p.price)}</td>
                <td className="row">
                  <button onClick={() => onEdit(p)} className="btn-secondary">
                    Edit
                  </button>
                  <button onClick={() => onDelete(p)} className="btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}