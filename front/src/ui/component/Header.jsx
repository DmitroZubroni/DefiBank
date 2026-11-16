import { useContext } from "react";
import { AtlantContext } from "../../core/context.jsx";
import { NavLink, Link } from "react-router-dom";
import { typograph } from "../../core/typograph";

const Header = () => {
  const { wallet, login, logout } = useContext(AtlantContext);

  const shortAddress = wallet
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : "";

  return (
    <header className="defi-header">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 max-w-7xl mx-auto">
        {/* Brand */}
        <Link to="/dashboard" className="d-flex align-items-center gap-2 text-decoration-none text-white">
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 0 16px rgba(16, 185, 129, 0.4)",
            }}
          >
            <span style={{ fontSize: 18 }}>🏦</span>
          </div>
          <div>
            <div className="fw-bold tracking-tight text-white leading-tight" style={{ fontSize: "1.1rem" }}>
              Atlant DeFi Bank
            </div>
            <div className="text-secondary mono-number" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>
              INSTITUTIONAL LIQUIDITY
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <nav aria-label="Разделы банка" className="d-flex align-items-center gap-1.5 flex-wrap">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `defi-nav-link ${isActive ? "active" : ""}`}
          >
            {typograph("Обзор")}
          </NavLink>
          <NavLink
            to="/lender"
            className={({ isActive }) => `defi-nav-link ${isActive ? "active" : ""}`}
          >
            {typograph("Хранилища")}
          </NavLink>
          <NavLink
            to="/borrow"
            className={({ isActive }) => `defi-nav-link ${isActive ? "active" : ""}`}
          >
            {typograph("Кредитование")}
          </NavLink>
          {wallet && (
            <NavLink
              to="/"
              className={({ isActive }) => `defi-nav-link ${isActive ? "active" : ""}`}
            >
              {typograph("Портфель")}
            </NavLink>
          )}
        </nav>

        {/* Auth / Wallet Status */}
        <div className="d-flex align-items-center gap-2">
          {wallet ? (
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-3"
                style={{
                  background: "#111C44",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#10B981",
                    boxShadow: "0 0 8px #10B981",
                  }}
                />
                <span className="mono-number text-white fw-semibold" style={{ fontSize: "0.85rem" }}>
                  {shortAddress}
                </span>
              </div>
              <button
                onClick={logout}
                className="defi-btn-secondary py-1.5 px-3"
                style={{ minHeight: 38, fontSize: "0.8rem" }}
                title="Отключить кошелек"
              >
                {typograph("Выйти")}
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="defi-btn-primary"
              style={{ minHeight: 40, fontSize: "0.85rem" }}
            >
              <span>{typograph("Подключить кошелек")}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
