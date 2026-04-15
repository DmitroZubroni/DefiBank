// ui/pages/Borrow.jsx
import { useContext, useState } from 'react';
import { AtlantContext } from '../../core/context';
import { ContractService } from '../../service/ContractService';
import { MARKETS } from '../../service/contracts.js';
import Header from "../component/Header.jsx";

const marketServices = MARKETS.map(m => ({
    ...m,
    service: new ContractService(m.abi, m.address),
}));

// --- Одна форма для одного маркета ---
const MarketBorrowForm = ({ label, service }) => {
    const { wallet } = useContext(AtlantContext);
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState(null); // null | 'loading' | 'ok' | 'error'

    const handleAction = async (action) => {
        if (!amount || !wallet) return;
        setStatus('loading');
        try {
            await service[action](amount, wallet);
            setStatus('ok');
            setAmount('');
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    return (
        <div className="container">
            <h4>{label}</h4>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                    type="number"
                    min="0"
                    placeholder="Amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    style={{ flex: 1, padding: '0.4rem' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => handleAction('depositMarket')}   disabled={status === 'loading'}>Supply</button>
                <button onClick={() => handleAction('borrow')}   disabled={status === 'loading'}>Borrow</button>
                <button onClick={() => handleAction('repay')}    disabled={status === 'loading'}>Repay</button>
                <button onClick={() => handleAction('withdrawMarket')} disabled={status === 'loading'}>Withdraw</button>
            </div>

            {status === 'loading' && <p style={{ color: 'gray' }}>Отправка транзакции...</p>}
            {status === 'ok'      && <p style={{ color: 'green' }}>✓ Успешно</p>}
            {status === 'error'   && <p style={{ color: 'red' }}>✗ Ошибка. Проверь кошелёк и сумму.</p>}
        </div>
    );
};

// --- Страница ---
const BorrowPage = () => (
    <div >
        <Header/>
        <h2>Markets — Borrow / Supply</h2>
        {marketServices.map(m => (
            <MarketBorrowForm key={m.id} label={m.label} service={m.service} />
        ))}
    </div>
);

export default BorrowPage;