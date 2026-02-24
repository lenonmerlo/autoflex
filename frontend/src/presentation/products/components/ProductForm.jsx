import { useState } from "react";

export default function ProductForm({ onSubmit, loading }) {
    const [form, setForm] = useState({ code: "", name: "", price: ""});

    function handlerChange(field) {
        return (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
    }

    async function submit(e) {
        e.preventDefault();
        await onSubmit(form);
        setForm({ code: "", name: "", price: ""});
    }

    return (
        <form onSubmit={ submit } className="row">
            <input placeholder="Code (P-001)" value={ form.code } onChange={ handlerChange("code") } />
            <input placeholder="Name" value={ form.name } onChange={ handlerChange("name") } />
            <input placeholder="Price" type="number" step="0.01" value={ form.price } onChange={ handlerChange("price") } />
            <button disabled={ loading } type="submit">{ loading ? "Saving..." : "Create" }</button>
        </form>
    );
}