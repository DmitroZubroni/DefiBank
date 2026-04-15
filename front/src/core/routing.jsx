import {createBrowserRouter} from "react-router-dom";
import Borrow from "../ui/pages/Borrow.jsx";
import Lender from "../ui/pages/Lender.jsx";
import User from "../ui/pages/User.jsx";
import Dashboard from "../ui/pages/Dashboard.jsx";

const routes = [
    {
        path: "/",
        element: <User/>
    },
    {
        path: "/dashboard",
        element: <Dashboard/>
    },
    {
        path: "/lender",
        element: <Lender/>
    },
    {
        path: "/borrow",
        element: <Borrow/>
    }
]
const routing = createBrowserRouter(routes)
export default routing