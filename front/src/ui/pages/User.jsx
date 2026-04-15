import { useContext, useEffect, useState } from 'react';
import {Table, Spinner, Card, Button} from 'react-bootstrap';
import { AtlantContext } from '../../core/context';
import { ContractService } from '../../service/ContractService';
import { MARKETS } from '../../service/contracts.js';
import Header from "../component/Header.jsx";

const marketServices = MARKETS.map(m => ({ ...m, service: new ContractService(m.abi, m.address) }));


const USER_COLS = [
    { key: 'market',          label: 'Market' },
    { key: 'borrowShares',    label: 'Borrow Shares' },
    { key: 'collateralShares',label: 'Collateral Shares' },
    { key: 'userBorrowIdx',   label: 'Borrow Index' },
    { key: 'currentDebt_',   label: 'Current Debt' },
    { key: 'currentLtv',      label: 'LTV' },
];

const User = () => {
    const { wallet, login } = useContext(AtlantContext);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (!wallet) return;
        Promise.all(
            marketServices.map(m =>
                m.service.getUserInfo(wallet)
                    .then(data => ({ market: m.label, ...data }))
                    .catch(() => ({ market: m.label, error: true }))
            )
        ).then(setRows);
    }, [wallet]);

    if (!wallet) return <> <Header/> <Button onClick={login} className="container"> авторизоваться</Button>  </>;

    return (

        <div >
            <Header/>
            <h4>User Info</h4>
            <Card className="mb-2 p-2 text-muted"><small>{wallet}</small></Card>
            <Table striped bordered hover size="sm">
                <thead><tr>{USER_COLS.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead>
                <tbody>
                {rows.map((row, i) => (
                    <tr key={i}>
                        {row.error
                            ? <td colSpan={USER_COLS.length} className="text-danger">Ошибка {row.market}</td>
                            : USER_COLS.map(c => <td key={c.key}>{row[c.key]?.toString()}</td>)
                        }
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default User;