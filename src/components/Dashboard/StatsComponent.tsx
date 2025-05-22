import { useQuery } from "@tanstack/react-query";

import { fetchTickets } from "../../hooks/useFetch";
import type { TicketResponse } from "../../types/types";

const StatsComponent = () => {
  const { data } = useQuery<TicketResponse[]>({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  });

  // Calcul du nombre de tickets avec des status spécifiques
  const createdTickets = data?.length;
  const handledTickets = data?.filter(
    (ticket) =>
      ticket.status.statut === "VALIDE" || ticket.status.statut === "ECHEC"
  ).length;

  const pendingTickets = data?.filter(
    (ticket) => ticket.status.statut === "EN_ATTENTE"
  ).length;
  const failedTickets = data?.filter(
    (ticket) => ticket.status.statut === "ECHEC"
  ).length;

  console.log("pendingTicket", data);
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-md bg-gray-100">
          <h3 className="text-sm font-medium">Total agents</h3>
          <p className="text-2xl font-bold text-blue-600">{data?.length}</p>
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
    </div>
  );
};

export default StatsComponent;
