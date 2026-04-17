import { useContext, useState } from 'react';
import { Button, FormControl, FormGroup, FormLabel, Card, ButtonGroup } from 'react-bootstrap';
import { AtlantContext } from '../../core/context';
import ContractService  from '../../service/ContractService';
import { VAULTS } from '../../service/contracts.js';
import Header from "../component/Header.jsx";

const vaultServices = VAULTS.map(v => ({ ...v, service: new ContractService(v.abi, v.address) }));

const ACTIONS = ['depositVault', 'withdrawVault'];

const VaultForm = ({ label, service }) => {
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
                    <FormControl
                        type="number"
                        placeholder="1"
                        min="0"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
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

const Lender = () => (
    <div>
        <Header />
        <h4>Vaults</h4>
        {vaultServices.map(v => (
            <VaultForm
                key={v.key || v.address}
                label={v.title}
                service={v.service}
            />
        ))}
    </div>
);

export default Lender;