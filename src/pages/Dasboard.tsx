import React, { useState } from "react";
// import StatsComponent from "../components/Dashboard/StatsCOmponent";
import BarStats from "../components/Dashboard/BarStats";
import { useQuery } from "@tanstack/react-query";
import type { Agent } from "../types/types";
import { fetchAgents } from "../hooks/useFetch";
import ListTicketsDashboard from "../components/Dashboard/ListTicketsDashboard";

const Dasboard: React.FC = () => {
  const agentConnectString = localStorage.getItem("agent_connect");
  const agent_connect = agentConnectString
    ? JSON.parse(agentConnectString)
    : null; // Déclarez agent_connect avec un type qui accepte null au départ

  // console.log(agent_connect);
  //  utilisatation de useQuery
  const {
    // isLoading,
    // isError,
    data: agents,
  } = useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div className="p-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="relative mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="bg-white rounded-full py-2 pl-10 pr-4 shadow-sm focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Hello, {agent_connect?.nom}
              </h2>
              <p className="text-gray-500 text-sm">
                Bienvenue sur notre plateforme SMART AGENCE.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-6-6C6.91 5 5 6.91 5 9.216m10 8.784l-2-2M15 17h5m-16 0h.01M8 12a4 4 0 01-8 0m0 0c4.97 0 9-3.01 9-7s-4.03-7-9-7m5 14v-3.346a9.001 9.001 0 0115.06-5.812M21 12a4 4 0 01-4 4h-3a4 4 0 01-4-4m0 0c4.97 0 9 3.01 9 7s-4.03 7-9 7"
              />
            </svg>
            {/* User Avatar */}
            <div className="rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
              {agent_connect?.nom[0].toLocaleUpperCase()}
            </div>
            <span className="font-semibold">{agent_connect?.nom}</span>
            {/* Dropdown Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <BarStats agents={agents as Agent[]} />

        {/* Main Dashboard Grid */}

        <ListTicketsDashboard />
      </div>
    </div>
  );
};

export default Dasboard;
