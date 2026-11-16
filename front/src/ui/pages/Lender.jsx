import { useContext, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { AtlantContext } from "../../core/context";
import ContractService from "../../service/ContractService";
import { VAULTS } from "../../service/contracts.js";
import Header from "../component/Header.jsx";
import { typograph } from "../../core/typograph";

const vaultServices = VAULTS.map((v) => ({
  ...v,
  service: new ContractService(v.abi, v.address),
}));

const VaultForm = ({ label, service, address }) => {
  const { wallet } = useContext(AtlantContext);
  const [amount, setAmount] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const handle = async (action) => {
    if (!wallet) {
      setStatusMessage("Подключите кошелек для совершения транзакции");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setStatusMessage("Укажите сумму больше нуля");
      return;
    }
    setPendingAction(action);
    setStatusMessage(null);
    try {
      await service[action](amount, wallet);
      setStatusMessage(`Транзакция ${action === "depositVault" ? "депозита" : "вывода"} успешно отправлена`);
      setAmount("");
    } catch (err) {
      console.error(err);
      setStatusMessage("Ошибка выполнения транзакции: проверьте доступный баланс");
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="defi-card p-4 h-100 d-flex flex-col justify-content-between">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h3 className="fs-5 fw-bold text-white mb-0">{label}</h3>
            <div className="text-secondary mono-number text-truncate" style={{ fontSize: "0.75rem", maxWidth: 220 }}>
              {address}
            </div>
          </div>
          <span className="defi-badge-emerald">ERC-4626</span>
        </div>

        <div className="mb-3">
          <label className="text-secondary mono-number d-block mb-1.5" style={{ fontSize: "0.8rem" }}>
            {typograph("Сумма депозита / вывода")}
          </label>
          <input
            type="number"
            className="defi-input mono-number"
            placeholder="0.00"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {statusMessage && (
          <div
            className="p-2.5 rounded-2 mb-3 mono-number"
            style={{
              fontSize: "0.8rem",
              background: statusMessage.includes("Ошибка") ? "rgba(244, 63, 94, 0.15)" : "rgba(16, 185, 129, 0.15)",
              color: statusMessage.includes("Ошибка") ? "#FDA4AF" : "#6EE7B7",
              border: `1px solid ${statusMessage.includes("Ошибка") ? "rgba(244, 63, 94, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
            }}
          >
            {typograph(statusMessage)}
          </div>
        )}
      </div>

      <div className="d-flex gap-2 pt-2">
        <button
          onClick={() => handle("depositVault")}
          disabled={pendingAction !== null}
          className="defi-btn-primary flex-1 text-xs"
        >
          {pendingAction === "depositVault" ? "Отправка..." : typograph("Внести депозит")}
        </button>
        <button
          onClick={() => handle("withdrawVault")}
          disabled={pendingAction !== null}
          className="defi-btn-secondary flex-1 text-xs"
        >
          {pendingAction === "withdrawVault" ? "Отправка..." : typograph("Вывести средства")}
        </button>
      </div>
    </div>
  );
};

const Lender = () => (
  <div style={{ minHeight: "100vh", background: "#030712" }}>
    <Header />
    <main className="container">
      <div className="mb-4">
        <h1 className="fs-3 fw-bold text-white mb-1">
          {typograph("Инвестиции в хранилища доходности")}
        </h1>
        <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
          {typograph("Предоставляйте ликвидность в смарт-контракты хранилищ ERC-4626 и получайте непрерывную доходность.")}
        </p>
      </div>

      <Row className="g-4">
        {vaultServices.map((v) => (
          <Col key={v.key || v.address} md={6}>
            <VaultForm label={v.title} service={v.service} address={v.address} />
          </Col>
        ))}
      </Row>
    </main>
  </div>
);

export default Lender;
