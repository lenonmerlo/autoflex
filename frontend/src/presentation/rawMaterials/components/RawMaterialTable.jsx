export default function RawMaterialTable({
    items, onEdit, onDelete, loading
}) {
    if (loading) return <p>Loading raw materials...</p>;
    if (!items?.length) return <p>No raw materials found.</p>;

    return (
        <div className="card">
            <div className="card-header">
                <h3>Raw Materials</h3>
            </div>

            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Stock</th>
                            <th style={{ width: 180 }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((rm) => (
                            <tr key={rm.id}>
                                <td>{rm.id}</td>
                                <td>{rm.code}</td>
                                <td>{rm.name}</td>
                                <td>{rm.stockQuantity}</td>
                                <td className="row">
                                    <button onClick={() => onEdit(rm)} className="btn-secondary">
                                        Edit
                                    </button>
                                    <button onClick={() => onDelete(rm)} className="btn-danger">
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