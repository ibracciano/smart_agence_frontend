import React, { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fecthStatus, fetchTickets } from "../../hooks/useFetch";
import type { TicketResponse } from "../../types/types";
import { convertInDate, getHour, getTimes } from "../../utils/utils";
// import ConnectionErrorPage from "../utils/ConnectionErrorPage";
import LoadingPage from "../utils/LoadingPage";
import NoDataPage from "../utils/NoDataPage";
import { EyeIcon, X } from "lucide-react";

interface Ticket {
  numero: string;
  categorie: string;
  status: "EN_ATTENTE" | "EN_COURS" | "VALIDE" | "ECHEC";
  dateAjout: Date;
}

const ListTicketsDashboard: React.FC = () => {
  const [isModalDescriptionOpen, setIsModalDescriptionOpen] = useState(false);
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();
  const agentConnectString = localStorage.getItem("agent_connect");
  const agent_connect = agentConnectString
    ? JSON.parse(agentConnectString)
    : null; // Déclarez agent_connect avec un type qui accepte null au départ

  //  utilisatation de useQuery
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketResponse | null>(
    null
  );
  const [newStatus, setNewStatus] = useState<string>("EN_ATTENTE");

  const { isLoading, isError, data } = useQuery<TicketResponse[]>({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  });
  // console.log("agent", agent_connect);

  const mutationStatus = useMutation({
    mutationFn: fecthStatus,
    onSuccess: () => {
      // Invalider le cache de la requête 'todos' pour forcer une refetch
      queryClient.invalidateQueries({ queryKey: ["status"] });
      // Optionnellement, vous pouvez également invalider une requête spécifique au todo supprimé
      // queryClient.invalidateQueries({ queryKey: ['todo', todo.id] });
    },
  });

  const filteredTickets = data?.filter((ticket) => {
    const statusMatch = !statusFilter || ticket.status?.statut === statusFilter;
    return statusMatch;
  });

  const handleModalDescription = (information: string) => {
    setIsModalDescriptionOpen(true);
    setDescription(information);
  };

  // console.log("status", newStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EN_ATTENTE":
        return "text-yellow-500";
      case "EN_COURS":
        return "text-blue-500";
      case "VALIDE":
        return "text-green-500";
      case "ECHEC":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const handleStatusClick = (ticket: TicketResponse) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status.statut); // Initialise le statut de la modal avec la valeur actuelle
    setIsModalOpen(true);
  };

  const handleSaveStatus = () => {
    if (
      newStatus &&
      selectedTicket &&
      agent_connect.role === "ADMINISTRATEUR"
    ) {
      mutationStatus.mutate({
        agent_id: agent_connect?.agent_id as string,
        status: newStatus,
        numero_ticket: selectedTicket.status?.numero_ticket,
      });
      if (mutationStatus.isSuccess) {
        setIsModalOpen(false);
        setSelectedTicket(null);
      }
    }
  };

  const subString = (word: string, nb: number = 10) => {
    return word.substring(0, nb) + "...";
  };

  if (isLoading) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        {/* <p>Aucune donnée disponible.</p> */}
        <NoDataPage />
      </div>
    );
  }

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Tickets</h1>

      <div className="flex gap-4 mb-4">
        <div className="relative">
          <select
            className="w-[180px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter || ""}
            onChange={(e) =>
              setStatusFilter(e.target.value as Ticket["status"] | undefined)
            }
          >
            <option value="">Filtrer par Statut</option>
            <option value="EN_ATTENTE">EN ATTENTE</option>
            <option value="EN_COURS">EN COURS</option>
            <option value="VALIDE">VALIDE</option>
            <option value="ECHEC">ECHEC</option>
          </select>
        </div>
      </div>

      <div className="shadow-md rounded-md">
        <table className="bg-white overflow-x-auto rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Numéro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Date d'ajout
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Heure d'ajout
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Agent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Temps Traitement
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTickets && filteredTickets?.length > 0 ? (
              filteredTickets?.reverse().map((ticket, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.status?.numero_ticket}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.categorie_service_concernee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      onClick={() =>
                        handleStatusClick(ticket as TicketResponse)
                      }
                      className={`cursor-pointer ${getStatusColor(
                        ticket.status?.statut
                      )}`}
                    >
                      {ticket.status?.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {convertInDate(ticket.date_heure_creation)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getHour(ticket.date_heure_creation)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <span>
                        {ticket.description
                          ? subString(ticket.description)
                          : "Aucune"}
                      </span>
                      <button className="cursor-pointer">
                        <EyeIcon
                          size={15}
                          onClick={() =>
                            handleModalDescription(
                              ticket?.description as string
                            )
                          }
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.agent ? ticket.agent.nom : "Aucun"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getTimes(
                      ticket.date_heure_creation,
                      ticket.status.updated_date.toString()
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center w-full text-sm p-2 flex justify-center">
                Aucun Ticket
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de modification du statut */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Modifier le statut du ticket{" "}
              {selectedTicket.status?.numero_ticket}
            </h2>
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Nouveau statut
              </label>
              <select
                id="status"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="EN_ATTENTE">EN ATTENTE</option>
                <option value="EN_COURS">EN COURS</option>
                <option value="VALIDE">VALIDE</option>
                <option value="ECHEC">ECHEC</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedTicket(null);
                }}
              >
                Annuler
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                onClick={handleSaveStatus}
              >
                {mutationStatus.isPending ? "En cours..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalDescriptionOpen && description && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-md">
            <h2 className="text-lg font-semibold mb-4">
              Description du ticket
            </h2>
            <p>{description}</p>
            <button
              onClick={() => setIsModalDescriptionOpen(false)}
              className="absolute cursor-pointer top-1/3 right-[40%] bg-red-500 text-white rounded-md"
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListTicketsDashboard;
