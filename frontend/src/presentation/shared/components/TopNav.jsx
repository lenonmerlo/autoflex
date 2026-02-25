import { NavLink } from "react-router-dom";

function IconBox(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 8.5V15.5a2 2 0 0 1-1.1 1.8l-7 3.5a2 2 0 0 1-1.8 0l-7-3.5A2 2 0 0 1 3 15.5V8.5a2 2 0 0 1 1.1-1.8l7-3.5a2 2 0 0 1 1.8 0l7 3.5A2 2 0 0 1 21 8.5Z" />
      <path d="M3.3 7.7 12 12l8.7-4.3" />
      <path d="M12 12v9" />
    </svg>
  );
}

function IconSettings(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a7.9 7.9 0 0 0 .1-1l2-1.5-2-3.5-2.4 1a8.2 8.2 0 0 0-1.7-1l-.4-2.6H9l-.4 2.6a8.2 8.2 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7.9 7.9 0 0 0 .1 1 7.9 7.9 0 0 0-.1 1l-2 1.5 2 3.5 2.4-1a8.2 8.2 0 0 0 1.7 1l.4 2.6h6l.4-2.6a8.2 8.2 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5a7.9 7.9 0 0 0-.1-1Z" />
    </svg>
  );
}

function IconBulb(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8.5 14.5A6 6 0 1 1 15.5 14.5c-.8.7-1.2 1.4-1.5 2.5h-4c-.3-1.1-.7-1.8-1.5-2.5Z" />
    </svg>
  );
}

function IconLink(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l1.77-1.77a5 5 0 1 0-7.07-7.07L10.7 5.23" />
      <path d="M14 11a5 5 0 0 0-7.07 0L5.16 12.77a5 5 0 0 0 7.07 7.07L13.3 18.77" />
    </svg>
  );
}

const navItems = [
  { to: "/products", label: "Products", Icon: IconBox },
  { to: "/raw-materials", label: "Raw Materials", Icon: IconSettings },
  {
    to: "/production-suggestions",
    label: "Production Suggestions",
    Icon: IconBulb,
  },
  {
    to: "/product-raw-materials",
    label: "Product–Raw Material",
    Icon: IconLink,
  },
];

export default function TopNav() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <div className="topbar__title">Inventory Management System</div>

        <nav className="tabs" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                ["tabs__item", isActive ? "tabs__item--active" : ""]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <span className="tabs__icon">
                <item.Icon />
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
