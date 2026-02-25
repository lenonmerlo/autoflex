import TopNav from "./TopNav";

export default function PageLayout({ title, subtitle, action, children }) {
  return (
    <div className="app">
      <TopNav />

      <div className="page">
        <div className="page__inner">
          <header className="pageHeader">
            <div className="pageHeader__titles">
              <h1 className="pageHeader__title">{title}</h1>
              {subtitle ? (
                <p className="pageHeader__subtitle">{subtitle}</p>
              ) : null}
            </div>

            {action ? <div className="pageHeader__action">{action}</div> : null}
          </header>

          <main className="content">{children}</main>
        </div>
      </div>
    </div>
  );
}
