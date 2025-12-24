import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Tickets from "../pages/Tickets";
import TicketDetails from "../pages/TicketDetails";
import CreateTicket from "../pages/CreateTicket";
import Admin from "../pages/Admin";
import Roles from "../components/Roles";
import NotFound from "../pages/NotFound";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "admin", element: <Roles roles={["admin"]}><Admin /></Roles> },
      { path: "dashboard", element: <Roles roles={["admin", "agent", "customer"]}><Dashboard /></Roles> },
      { path: "tickets", element: <Roles roles={["admin", "agent", "customer"]}><Tickets /></Roles> },
      { path: "tickets/new", element: <Roles roles={["customer"]}><CreateTicket /></Roles> },
      { path: "tickets/:id", element: <Roles roles={["admin", "agent", "customer"]}><TicketDetails /></Roles> },
      { path: "*", element: <NotFound /> }
    ],
  }
]);

export default Routes;