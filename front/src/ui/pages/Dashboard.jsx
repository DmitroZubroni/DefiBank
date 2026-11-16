import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Header from "../component/Header.jsx";
import ContractService from "../../service/ContractService.jsx";
import { MARKETS, VAULTS } from "../../service/contracts.js";
import { typograph } from "../../core/typograph";
import DefiVaultHeroArt from "../component/DefiVaultHeroArt.jsx";
import { LoadingSkeleton, EmptyState } from "../component/States.jsx";

const marketServices = MARKETS.map((item) => ({
  ...item,
  service: new ContractService(item.abi, item.address),
}));

const vaultServices = VAULTS.map((item) => ({
  ...item,
  service: new ContractService(item.abi, item.address),
}));

export default function Dashboard() {
  const [markets, setMarkets] = useState([]);
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const marketsData = await Promise.all(
          marketServices.map(async (item) => {
            const data = await item.service.getMarket();
            return { ...item, data };
          })
        );

        const vaultsData = await Promise.all(
          vaultServices.map(async (item) => {
            const data = await item.service.getVault();
            return { ...item, data };
          })
        );

        setMarkets(marketsData);
        setVaults(vaultsData);
      } catch (err) {
        console.error("Failed to load DeFi contracts:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#030712" }}>
      <Header />

      <main className="container">
        {/* Institutional Hero Banner */}
        <section
          className="defi-card p-4 p-md-5 mb-5"
          style={{
            background: "linear-gradient(135deg, #0B132B 0%, #111C44 60%, #030712 100%)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
          }}
        >
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="defi-badge-emerald mb-3">
                <span>●</span>
                <span>{typograph("Институциональный протокол")}</span>
              </div>
              <h1 className="fw-bold text-white mb-2" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
                {typograph("Децентрализованные хранилища и рынок ликвидности")}
              </h1>
              <p className="text-slate-300 fs-6 mb-4" style={{ color: "#94A3B8", lineHeight: 1.6 }}>
                {typograph(
                  "Автоматизированное управление залоговыми активами, динамические пулы доходности и безопасное кредитование на базе смарт-контрактов нового поколения."
                )}
              </p>

              {/* Bento Metric Pills */}
              <div className="d-flex flex-wrap gap-3">
                <div
                  className="px-3.5 py-2.5 rounded-3"
                  style={{ background: "rgba(11, 19, 43, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                >
                  <div className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                    {typograph("АКТИВНЫХ ХРАНИЛИЩ")}
                  </div>
                  <div className="fs-5 fw-bold text-white mono-number">
                    {vaults.length || VAULTS.length}
                  </div>
                </div>

                <div
                  className="px-3.5 py-2.5 rounded-3"
                  style={{ background: "rgba(11, 19, 43, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                >
                  <div className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                    {typograph("РЫНКОВ ЗАЙМОВ")}
                  </div>
                  <div className="fs-5 fw-bold text-white mono-number" style={{ color: "#10B981" }}>
                    {markets.length || MARKETS.length}
                  </div>
                </div>

                <div
                  className="px-3.5 py-2.5 rounded-3"
                  style={{ background: "rgba(11, 19, 43, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                >
                  <div className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                    {typograph("СТАНДАРТ БЕЗОПАСНОСТИ")}
                  </div>
                  <div className="fs-5 fw-bold mono-number" style={{ color: "#F59E0B" }}>
                    ERC-4626
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5 text-center">
              <DefiVaultHeroArt width={340} height={200} className="w-100 h-auto" />
            </div>
          </div>
        </section>

        {/* Section 1: Vaults (Хранилища) */}
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h2 className="fs-4 fw-bold text-white mb-0">{typograph("Инвестиционные хранилища (Vaults)")}</h2>
              <p className="text-secondary mb-0" style={{ fontSize: "0.85rem" }}>
                {typograph("Стандарт ERC-4626 с непрерывным реинвестированием дохода")}
              </p>
            </div>
            <span className="defi-badge-emerald">{vaults.length} {typograph("пула")}</span>
          </div>

          {loading ? (
            <LoadingSkeleton count={2} />
          ) : vaults.length === 0 ? (
            <EmptyState
              title="Хранилища временно недоступны"
              description="Проверьте соединение с нодой блокчейна или повторите запрос."
            />
          ) : (
            <Row className="g-4">
              {vaults.map((vault) => (
                <Col key={vault.key || vault.address} md={6}>
                  <div className="defi-card p-4 h-100 d-flex flex-col justify-content-between">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-2.5">
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: "rgba(16, 185, 129, 0.15)",
                              display: "grid",
                              placeItems: "center",
                              color: "#10B981",
                              fontSize: 18,
                            }}
                          >
                            💎
                          </div>
                          <div>
                            <h3 className="fs-5 fw-bold text-white mb-0">{vault.title}</h3>
                            <div className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                              {vault.data?.[1]?.toString?.() || "VAULT SHARE"}
                            </div>
                          </div>
                        </div>
                        <span className="defi-badge-gold">{typograph("АКТИВНО")}</span>
                      </div>

                      <div
                        className="p-3 rounded-3 mb-3"
                        style={{ background: "#0B132B", border: "1px solid rgba(255, 255, 255, 0.05)" }}
                      >
                        <div className="row g-2">
                          <div className="col-6">
                            <span className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                              {typograph("Управляемые активы")}
                            </span>
                            <div className="fs-6 fw-bold text-white mono-number">
                              {vault.data?.[2]?.toString?.() || "0.00"}
                            </div>
                          </div>
                          <div className="col-6">
                            <span className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                              {typograph("Цена доли")}
                            </span>
                            <div className="fs-6 fw-bold mono-number" style={{ color: "#10B981" }}>
                              {vault.data?.[4]?.toString?.() || "1.0000"}
                            </div>
                          </div>
                          <div className="col-12 mt-2 pt-2 border-top border-white-5">
                            <span className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                              {typograph("Адрес контракта")}
                            </span>
                            <div
                              className="mono-number text-truncate"
                              style={{ fontSize: "0.75rem", color: "#64748B" }}
                            >
                              {vault.address}
                            </div>
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

        {/* Section 2: Lending Markets (Рынки займов) */}
        <section>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h2 className="fs-4 fw-bold text-white mb-0">{typograph("Кредитные рынки (Lending Markets)")}</h2>
              <p className="text-secondary mb-0" style={{ fontSize: "0.85rem" }}>
                {typograph("Изолированные пулы залогового кредитования и управления рисками")}
              </p>
            </div>
            <span className="defi-badge-emerald">{markets.length} {typograph("рынка")}</span>
          </div>

          {loading ? (
            <LoadingSkeleton count={2} />
          ) : markets.length === 0 ? (
            <EmptyState
              title="Рынки временно недоступны"
              description="Подключение к смарт-контрактам рынков займов не установлено."
            />
          ) : (
            <Row className="g-4">
              {markets.map((market) => (
                <Col key={market.key || market.address} md={6}>
                  <div className="defi-card p-4 h-100 d-flex flex-col justify-content-between">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-2.5">
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: "rgba(6, 182, 212, 0.15)",
                              display: "grid",
                              placeItems: "center",
                              color: "#06B6D4",
                              fontSize: 18,
                            }}
                          >
                            ⚡
                          </div>
                          <div>
                            <h3 className="fs-5 fw-bold text-white mb-0">{market.title}</h3>
                            <div className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                              {market.data?.[7]?.toString?.() || "COLLATERAL"} / {market.data?.[6]?.toString?.() || "BORROW"}
                            </div>
                          </div>
                        </div>
                        <span className="defi-badge-gold">
                          LLTV: {market.data?.[1]?.toString?.() || "85%"}
                        </span>
                      </div>

                      <div
                        className="p-3 rounded-3 mb-3"
                        style={{ background: "#0B132B", border: "1px solid rgba(255, 255, 255, 0.05)" }}
                      >
                        <div className="row g-2">
                          <div className="col-6">
                            <span className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                              {typograph("Ставка займа")}
                            </span>
                            <div className="fs-6 fw-bold mono-number" style={{ color: "#F59E0B" }}>
                              {market.data?.[2]?.toString?.() || "4.50%"}
                            </div>
                          </div>
                          <div className="col-6">
                            <span className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                              {typograph("Индекс заимствования")}
                            </span>
                            <div className="fs-6 fw-bold text-white mono-number">
                              {market.data?.[3]?.toString?.() || "1.000"}
                            </div>
                          </div>
                          <div className="col-12 mt-2 pt-2 border-top border-white-5">
                            <span className="text-secondary mono-number" style={{ fontSize: "0.75rem" }}>
                              {typograph("Адрес рынка")}
                            </span>
                            <div
                              className="mono-number text-truncate"
                              style={{ fontSize: "0.75rem", color: "#64748B" }}
                            >
                              {market.address}
                            </div>
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
}
