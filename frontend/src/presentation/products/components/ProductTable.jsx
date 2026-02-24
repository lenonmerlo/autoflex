export default function ProductTable({ items }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th><th>Code</th><th>Name</th><th>Price</th>
                </tr>
            </thead>
            <tbody>
                { items.map((p) => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.code}</td>
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                    </tr>
                )) }
            </tbody>
        </table>
    );
}