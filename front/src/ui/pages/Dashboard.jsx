import { useEffect, useState } from 'react';
import { MARKETS, VAULTS } from '../../service/contracts.js';
import { ContractService } from '../../service/ContractService';
import { AtlantContext } from '../../core/context';
import Header from "../component/Header.jsx";

// Создаём сервисы один раз из конфига
const marketServices = MARKETS.map(m => ({
    ...m,
    service: new ContractService(m.abi, m.address),
}));

const vaultServices = VAULTS.map(v => ({
    ...v,
    service: new ContractService(v.abi, v.address),
}));

// --- Карточка маркета ---
const MarketCard = ({ label, service }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        service.getMarket().then(setData).catch(console.error);
    }, [service]);

    if (!data) return <div className="card">Loading {label}...</div>;

    return (
        <div className="card">
            <h3>{data.title}</h3>
            <p>LLTV: {data.lltv.toString()}</p>
            <p>Interest Rate: {data.interestRate.toString()}</p>
            <p>Borrow Index: {data.currentBorrowIndex.toString()}</p>
            <p>Collateral Price: {data.collateralPrice.toString()}</p>
            <p>Borrow Price: {data.borrowPrice.toString()}</p>
        </div>
    );
};

// --- Карточка vault ---
const VaultCard = ({ label, service }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        service.getVault().then(setData).catch(console.error);
    }, [service]);

    if (!data) return <div className="card">Loading {label}...</div>;

    return (
        <div className="card">
            <h3>{data.title}</h3>
            <p>Share: {data.shareName}</p>
            <p>Managed Assets: {data.managedAssets.toString()}</p>
            <p>Total Shares: {data.totalShares.toString()}</p>
            <p>Share Price: {data.sharePrice.toString()}</p>
        </div>
    );
};

// --- Dashboard ---
const Dashboard = () => {
    return (
        <div>
            <Header/>
            <h2>Vaults</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {vaultServices.map(v => (
                    <VaultCard key={v.id} label={v.label} service={v.service} />
                ))}
            </div>

            <h2>Markets</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {marketServices.map(m => (
                    <MarketCard key={m.id} label={m.label} service={m.service} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;