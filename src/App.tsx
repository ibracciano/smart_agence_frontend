import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./models/Layout";
import Dasboard from "./pages/Dasboard";
import Tickets from "./pages/Tickets";
import Agents from "./pages/Agents";
import ErrorPage from "./pages/ErrorPage";
import Signin from "./pages/Signin";
import HomeUser from "./pages/HomeUser";
import UnauthorizedPage from "./components/utils/UnauthorizedPage";

const App: React.FC = () => {
  const agentConnectString = localStorage.getItem("agent_connect");
  const agent_connect = agentConnectString
    ? JSON.parse(agentConnectString)
    : null; // Déclarez agent_connect avec un type qui accepte null au départ

  // console.log("agent", agent_connect);
  const verify = () => {
    if (!agent_connect) {
      return (window.location.href = "/non_autorise");
    }
    return null;
  };
  const router = createBrowserRouter([
    {
      path: "/administrateurs",
      element: <Layout />,
      loader: verify,
      errorElement: <ErrorPage />,
      children: [
        { path: "", element: <Dasboard /> },
        { path: "tickets", element: <Tickets /> },
        { path: "agents", element: <Agents /> },
      ],
    },
    {
      path: "connexion",
      element: <Signin />,
    },
    {
      path: "",
      element: <HomeUser />,
    },
    {
      path: "non_autorise",
      element: <UnauthorizedPage />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
