import { useContext, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { AtlantContext } from "../../core/context";
import ContractService from "../../service/ContractService";
import { MARKETS } from "../../service/contracts.js";
import Header from "../component/Header.jsx";
import { typograph } from "../../core/typograph";
import { EmptyState, LoadingSkeleton } from "../component/States.jsx";

const marketServices = MARKETS.map((v) => ({
  ...v,
  service: new ContractService(v.abi, v.address),
}));

const User = () => {
  const { wallet, login } = useContext(AtlantContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!wallet) return;
    setLoading(true);
    (async () => {
      try {
        const usersData = await Promise.all(
          marketServices.map(async (item) => {
            const data = await item.service.getUserInfo(wallet);
            return { ...item, data };
          })
        );
        setUsers(usersData);
      } catch (err) {
        console.error("Failed to load user positions:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [wallet]);

  if (!wallet) {
    return (
      <div style={{ minHeight: "100vh", background: "#030712" }}>
        <Header />
        <main className="container mt-5">
          <EmptyState
            title="Кошелек не подключен"
            description="Авторизуйтесь с помощью Web3-кошелька, чтобы просмотреть состояние вашего портфеля, залоги и задолженность."
            actionLabel="Подключить Web3-кошелек"
            onAction={login}
          />
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#030712" }}>
      <Header />

      <main className="container">
        {/* Wallet Overview Card */}
        <section
          className="defi-card p-4 mb-4"
          style={{
            background: "linear-gradient(135deg, #0B132B 0%, #111C44 100%)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <div className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                {typograph("ПОДКЛЮЧЕННЫЙ КОШЕЛЕК")}
              </div>
              <h1 className="fs-4 fw-bold text-white mono-number text-truncate mb-0">
                {wallet}
              </h1>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="defi-badge-emerald">● Web3 Connected</span>
              <span className="defi-badge-gold">Mainnet Node</span>
            </div>
          </div>
        </section>

        {/* User Market Positions */}
        <section>
          <h2 className="fs-5 fw-bold text-white mb-3">
            {typograph("Активные позиции на кредитных рынках")}
          </h2>

          {loading ? (
            <LoadingSkeleton count={2} />
          ) : users.length === 0 ? (
            <EmptyState
              title="Нет открытых кредитных позиций"
              description="Вы еще не предоставили залог и не брали займы в активных рынках ликвидности."
            />
          ) : (
            <Row className="g-4">
              {users.map((u) => (
                <Col key={u.key || u.address} md={6}>
                  <div className="defi-card p-4 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <h3 className="fs-5 fw-bold text-white mb-0">{u.title}</h3>
                        <div className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                          {u.address}
                        </div>
                      </div>
                      <span className="defi-badge-gold">
                        LTV: {u.data?.[4]?.toString?.() || "0%"}
                      </span>
                    </div>

                    <div
                      className="p-3 rounded-3"
                      style={{ background: "#0B132B", border: "1px solid rgba(255, 255, 255, 0.05)" }}
                    >
                      <div className="row g-2">
                        <div className="col-6">
                          <span className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                            {typograph("Доли займа")}
                          </span>
                          <div className="fs-6 fw-bold text-white mono-number">
                            {u.data?.[0]?.toString?.() || "0"}
                          </div>
                        </div>
                        <div className="col-6">
                          <span className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                            {typograph("Доли залога")}
                          </span>
                          <div className="fs-6 fw-bold mono-number" style={{ color: "#10B981" }}>
                            {u.data?.[1]?.toString?.() || "0"}
                          </div>
                        </div>
                        <div className="col-6 mt-2 pt-2 border-top border-white-5">
                          <span className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                            {typograph("Индекс пользователя")}
                          </span>
                          <div className="fs-6 fw-bold text-white mono-number">
                            {u.data?.[2]?.toString?.() || "1.000"}
                          </div>
                        </div>
                        <div className="col-6 mt-2 pt-2 border-top border-white-5">
                          <span className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                            {typograph("Текущий долг")}
                          </span>
                          <div className="fs-6 fw-bold mono-number" style={{ color: "#F59E0B" }}>
                            {u.data?.[3]?.toString?.() || "0.00"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </section>
      </main>
    </div>
  );
};

export default User;
