import { useContext, useState } from 'react';
import { Button, FormControl, FormGroup, FormLabel, Card, ButtonGroup } from 'react-bootstrap';
import { AtlantContext } from '../../core/context';
import  ContractService  from '../../service/ContractService';
import { MARKETS } from '../../service/contracts.js';
import Header from "../component/Header.jsx";

const marketServices = MARKETS.map(v => ({ ...v, service: new ContractService(v.abi, v.address) }));

const ACTIONS = ['depositMarket', 'withdrawMarket', 'borrow', 'repay'];

const MarketForm = ({ label, service }) => {
    const { wallet } = useContext(AtlantContext);
    const [amount, setAmount] = useState('');

    const handle = async (action) => {
        await service[action](amount, wallet);
    };

    return (
        <div>
            <Card className="container">
                <Card.Header>{label}</Card.Header>

                <FormGroup>
                    <FormLabel column={1}>Amount</FormLabel>
                    <FormControl type="number" placeholder="1" min="0"
                        onChange={e => setAmount(e.target.value)}/>
                </FormGroup>

                <ButtonGroup>
                    {ACTIONS.map(a => (
                        <Button key={a} onClick={() => handle(a)}>
                            {a}
                        </Button>
                    ))}
                </ButtonGroup>
            </Card>
        </div>
    );
};

const Borrow = () => (
    <div>
        <Header />
        <h4>Markets</h4>
        {marketServices.map(v => (
            <MarketForm
                key={v.key || v.address}
                label={v.title}
                service={v.service}
            />
        ))}
    </div>
);

export default Borrow;