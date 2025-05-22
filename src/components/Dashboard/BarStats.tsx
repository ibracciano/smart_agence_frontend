import React, { useState, useEffect } from "react";
import { format, startOfWeek } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import type { Agent, TicketResponse } from "../../types/types";
import { useQuery } from "@tanstack/react-query";
import { fetchTickets } from "../../hooks/useFetch";

interface PropsTypes {
  agents: Agent[];
}

const BarStats: React.FC<PropsTypes> = ({ agents }: PropsTypes) => {
  const [ticketsParJour, setTicketsParJour] = useState<{
    [date: string]: number;
  }>({});
  const [ticketsParSemaine, setTicketsParSemaine] = useState<{
    [date: string]: number;
  }>({});

  const { data } = useQuery<TicketResponse[]>({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  });
  // Calcul du nombre de tickets avec des status spécifiques
  const createdTickets = data?.length;
  const handledTickets = data?.filter(
    (ticket) =>
      ticket.status?.statut === "VALIDE" || ticket.status?.statut === "ECHEC"
  ).length;
  const pendingTickets = data?.filter(
    (ticket) => ticket.status?.statut === "EN_ATTENTE"
  ).length;
  const failedTickets = data?.filter(
    (ticket) => ticket.status?.statut === "ECHEC"
  ).length;

  // Utilisation de useEffect pour simuler une requête API (si nécessaire)
  useEffect(() => {
    // Dans une application réelle, vous feriez un appel API ici pour récupérer les données.
    // Exemple:
    // const fetchData = async () => {
    //   const agentsData = await fetch('/api/agents').then(res => res.json());
    //   const ticketsData = await fetch('/api/tickets').then(res => res.json());
    //   setAgents(agentsData);
    //   setTickets(ticketsData);
    // };
    // fetchData();

    //Calculer les tickets par jour et par semaine
    const ticketsParJourMap: { [date: string]: number } = {};
    const ticketsParSemaineMap: { [date: string]: number } = {};

    data?.forEach((ticket) => {
      const jour = format(ticket.date_heure_creation, "yyyy-MM-dd");
      const debutSemaine = format(
        startOfWeek(ticket.date_heure_creation),
        "yyyy-MM-dd"
      );

      ticketsParJourMap[jour] = (ticketsParJourMap[jour] || 0) + 1;
      ticketsParSemaineMap[debutSemaine] =
        (ticketsParSemaineMap[debutSemaine] || 0) + 1;
    });

    setTicketsParJour(ticketsParJourMap);
    setTicketsParSemaine(ticketsParSemaineMap);
  }, [data]);

  const ticketsParAgent = data?.reduce(
    (acc: { [agentId: string]: number }, ticket) => {
      const agentId = "A" + ticket.agent_id?.slice(-2) || "Unknown"; // Pour gérer les tickets sans agentId
      acc[agentId] = (acc[agentId] || 0) + 1;
      return acc;
    },
    {}
  );

  const ticketsParCategorie = data?.reduce(
    (acc: { [categorie: string]: number }, ticket) => {
      acc[ticket.categorie_service_concernee] =
        (acc[ticket.categorie_service_concernee] || 0) + 1;
      return acc;
    },
    {}
  );

  let agentChartData;
  let categorieChartData;
  if (ticketsParAgent) {
    // Créer des données pour les graphiques
    agentChartData = Object.entries(ticketsParAgent).map(
      ([agentId, count]) => ({
        agentId,
        count,
      })
    );
  }

  if (ticketsParCategorie) {
    categorieChartData = Object.entries(ticketsParCategorie).map(
      ([categorie, count]) => ({
        categorie,
        count,
      })
    );
  }

  const jourChartData = Object.entries(ticketsParJour).map(([jour, count]) => ({
    jour,
    count,
  }));
  const semaineChartData = Object.entries(ticketsParSemaine).map(
    ([debutSemaine, count]) => ({ debutSemaine, count })
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-md bg-gray-100">
          <h3 className="text-sm font-medium">Total d'agents</h3>
          <p className="text-2xl font-bold text-blue-600">{agents?.length}</p>
        </div>
        <div className="p-4 rounded-md bg-gray-100">
          <h3 className="text-sm font-medium">Tickets créés</h3>
          <p className="text-2xl font-bold text-green-600">{createdTickets}</p>
        </div>
        <div className="p-4 rounded-md bg-gray-100">
          <h3 className="text-sm font-medium">Tickets traités</h3>
          <p className="text-2xl font-bold text-purple-600">{handledTickets}</p>
        </div>
        <div className="p-4 rounded-md bg-gray-100">
          <h3 className="text-sm font-medium">Tickets en attente</h3>
          <p className="text-2xl font-bold text-orange-600">{pendingTickets}</p>
        </div>
        <div className="p-4 rounded-md bg-gray-100">
          <h3 className="text-sm font-medium">Tickets échoués</h3>
          <p className="text-2xl font-bold text-red-600">{failedTickets}</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Tickets traités par agent */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Tickets traités par agent
          </h3>
          <div className="bg-gray-100 rounded-md p-4">
            {agentChartData && agentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={agentChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="agentId" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>Aucun agent à afficher</p>
            )}
          </div>
        </div>

        {/* Tickets par catégorie de service */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Tickets par catégorie de service
          </h3>
          <div className="bg-gray-100 rounded-md p-4">
            {categorieChartData && categorieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={categorieChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categorie" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>Aucune catégorie à afficher</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Evolution quotidienne des tickets traités */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Evolution quotidienne des tickets
          </h3>
          <div className="bg-gray-100 rounded-md p-4">
            {jourChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={jourChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="jour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>Aucune donnée quotidienne</p>
            )}
          </div>
        </div>

        {/* Evolution hebdomadaire des tickets traités */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Evolution hebdomadaire des tickets
          </h3>
          <div className="bg-gray-100 rounded-md p-4">
            {semaineChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={semaineChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="debutSemaine" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>Aucune donnée hebdomadaire</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// function handleStartOfWeek(date: Date): Date {
//   const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
//   return new Date(date.setDate(diff));
// }

export default BarStats;
