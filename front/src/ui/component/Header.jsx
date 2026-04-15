import {useContext} from "react";
import {AtlantContext} from "../../core/context.jsx";
import {Link} from "react-router-dom";

const Header = () => {

    const {wallet, logout} = useContext(AtlantContext);

    return (
        <div className='navbar' style={{background: '#ac6aee', color: "white"}}>
            <h2> Defi Bank </h2>
            {
                wallet === "" ?
                    <>
                        <Link to="/" className="btn" style={{color:"whitesmoke"}}>авторизоваться </Link>
                        <Link to="/dashboard" className="btn" style={{color:"whitesmoke"}}> Dashboard </Link>
                    </> :
                    <>
                        <Link to="/" className="btn" style={{color:"whitesmoke"}}>личный кабинет</Link>
                        <Link to="/dashboard" className="btn" style={{color:"whitesmoke"}}> dashboard </Link>
                        <Link to="/lender" className="btn" style={{color:"whitesmoke"}}> инвестировать </Link>
                        <Link to="/borrow" className="btn" style={{color:"whitesmoke"}}> взять займ </Link>
                        <Link to="/" className="btn" style={{color:"whitesmoke"}} onClick={logout}> выйти</Link>
                    </>
            }

        </div>
    )
}
export default Header;