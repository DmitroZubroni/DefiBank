import { useContext, useState } from 'react';
import { Button, Form, FormControl, FormGroup, FormLabel, Card, ButtonGroup } from 'react-bootstrap';
import { AtlantContext } from '../../core/context';
import { ContractService } from '../../service/ContractService';
import { VAULTS } from '../../service/contracts.js';
import Header from "../component/Header.jsx";

const vaultServices = VAULTS.map(v => ({ ...v, service: new ContractService(v.abi, v.address) }));

const ACTIONS = ['deposit', 'withdraw'];

const VaultForm = ({ label, service }) => {
    const { wallet } = useContext(AtlantContext);
    const [amount, setAmount] = useState('');

    const handle = async (action) => {
        try {
            await service[action](amount, wallet);
            alert('success');
        } catch {
            alert('error');
        }
    };

    return (
        <div>

            <Card className="container">
                <Card.Header>{label}</Card.Header>
                    <FormGroup>
                        <FormLabel column={1}>Amount</FormLabel>
                        <FormControl
                            type="number" placeholder="1" min="0"
                            value={amount} onChange={e => setAmount(e.target.value)}
                        />
                    </FormGroup>
                    <ButtonGroup className="mt-2">
                        {ACTIONS.map(a => (
                            <Button key={a} variant="outline-primary" disabled={!amount} onClick={() => handle(a)}>
                                { a.slice(0)}
                            </Button>
                        ))}
                    </ButtonGroup>
            </Card>
        </div>

    );
};

const Lender = () => (
    <div >
        <Header/>
        <h4>Vaults</h4>
        {vaultServices.map(v => <VaultForm key={v.id} {...v} />)}
    </div>
);

export default Lender;