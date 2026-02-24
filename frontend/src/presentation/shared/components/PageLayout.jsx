export default function PageLayout({ title, children }) {
  return (
    <div className="container">
      <header className="header">
        <h1>{title}</h1>
      </header>
      <main className="card">{children}</main>
    </div>
  );
}