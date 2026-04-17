import { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Header from "../component/Header.jsx";
import ContractService from "../../service/ContractService.jsx";
import { MARKETS, VAULTS } from "../../service/contracts.js";

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

    useEffect(() => {
        (async () => {
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
        })();
    }, []);

    return (
        <>
            <Header />

            <div className="container">
                <h1>Dashboard</h1>

                <h2>Vaults</h2>

                <Row>
                    {vaults.map((vault) => (
                        <Col key={vault.key || vault.address} md={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{vault.title}</Card.Title>
                                    <div>Address: {vault.address}</div>
                                    <div>Title: {vault.data?.[0]?.toString?.() || ""}</div>
                                    <div>Share Name: {vault.data?.[1]?.toString?.() || ""}</div>
                                    <div>Managed Assets: {vault.data?.[2]?.toString?.() || ""}</div>
                                    <div>Total Shares: {vault.data?.[3]?.toString?.() || ""}</div>
                                    <div>Share Price: {vault.data?.[4]?.toString?.() || ""}</div>
                                    <div>Asset: {vault.data?.[5]?.toString?.() || ""}</div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <h2>Markets</h2>

                <Row>
                    {markets.map((market) => (
                        <Col key={market.key || market.address} md={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{market.title}</Card.Title>
                                    <div>Address: {market.address}</div>
                                    <div>Title: {market.data?.[0]?.toString?.() || ""}</div>
                                    <div>LLTV: {market.data?.[1]?.toString?.() || ""}</div>
                                    <div>Interest Rate: {market.data?.[2]?.toString?.() || ""}</div>
                                    <div>Borrow Index: {market.data?.[3]?.toString?.() || ""}</div>
                                    <div>Collateral Price: {market.data?.[4]?.toString?.() || ""}</div>
                                    <div>Borrow Price: {market.data?.[5]?.toString?.() || ""}</div>
                                    <div>Borrow Token: {market.data?.[6]?.toString?.() || ""}</div>
                                    <div>Collateral Token: {market.data?.[7]?.toString?.() || ""}</div>
                                    <div>Borrow Share: {market.data?.[8]?.toString?.() || ""}</div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    );
}