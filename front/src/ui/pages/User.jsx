import { useContext, useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { AtlantContext } from '../../core/context';
import  ContractService  from '../../service/ContractService';
import { MARKETS } from '../../service/contracts.js';
import Header from "../component/Header.jsx";

const marketServices = MARKETS.map(v => ({ ...v, service: new ContractService(v.abi, v.address) }));

const User = () => {
    const { wallet, login } = useContext(AtlantContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!wallet) return;
        (async () => {
            const usersData = await Promise.all(
                marketServices.map(async (item) => {
                    const data = await item.service.getUserInfo(wallet);
                    return { ...item, data };
                })
            );

            setUsers(usersData);
        })();
    }, [wallet]);

    if (!wallet) {
        return (
            <>
                <Header />
                <div className="container">
                    <Button onClick={login}>Авторизация</Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            {
                !wallet ?
                    <Button onClick={login}>Авторизация</Button> :

                        <div className="container">
                            <h1>User</h1>

                            <div>{wallet}</div>

                            {users.map((user) => (
                                <Card key={user.key || user.address}>
                                    <Card.Body>
                                        <Card.Title>{user.title}</Card.Title>
                                        <div>Address: {user.address}</div>
                                        <div>Borrow Shares: {user.data?.[0]?.toString?.() || ""}</div>
                                        <div>Collateral Shares: {user.data?.[1]?.toString?.() || ""}</div>
                                        <div>User Borrow Index: {user.data?.[2]?.toString?.() || ""}</div>
                                        <div>Current Debt: {user.data?.[3]?.toString?.() || ""}</div>
                                        <div>Current LTV: {user.data?.[4]?.toString?.() || ""}</div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>

            }


        </>
    );
};

export default User;