import {
  API_CREATE_AGENT,
  API_CREATE_TICKET,
  API_GET_ALL_AGENTS,
  API_SIGNIN_AGENT,
  API_UPDATE_TICKET,
} from "../api/api";
import type {
  AgentData,
  AgentUpdateData,
  Ticket,
  TicketStatusData,
} from "../types/types";

// hook pour recuperer les agents
const fetchAgents = async () => {
  const response = await fetch(API_GET_ALL_AGENTS); // Remplacez par votre endpoint API
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des agents");
  }
  return response.json();
};

const addAgent = async (agent: AgentData) => {
  const response = await fetch(API_CREATE_AGENT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agent),
  });
  //   console.log(response);
  if (response.status === 500) {
    throw new Error("Verifiez votre connexion");
  } else if (response.status === 404) {
    throw new Error("Agent existe déjà");
  }
  return response.json();
};

const updateAgent = async (agent: AgentUpdateData) => {
  const response = await fetch(`${API_CREATE_AGENT}${agent.agent_id}`, {
    method: "PUT", // ou 'PATCH' selon votre API
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agent),
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour du todo");
  }
  return response.json(); // Ou toute autre donnée renvoyée par votre API
};

const deleteTodo = async (id: string) => {
  const response = await fetch(`${API_CREATE_AGENT}${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du todo");
  }
  // La réponse d'une suppression réussie peut être vide ou contenir des données.
  return response.json(); // Ou potentiellement rien si l'API ne renvoie rien
};

// pour les tickets
const addTicket = async (ticket: Ticket) => {
  const response = await fetch(API_CREATE_TICKET, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  });
  //   console.log(response);
  if (response.status === 500) {
    throw new Error("Verifiez votre connexion");
  } else if (response.status === 404) {
    throw new Error("Un souci avec le ticket");
  }
  return response.json();
};

// hook pour recuperer les tickets
const fetchTickets = async () => {
  const response = await fetch(API_CREATE_TICKET); // Remplacez par votre endpoint API
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des tickets");
  }
  return response.json();
};

// hook pour connecter un agen
const fetchAgentConnect = async (email: string) => {
  const response = await fetch(`${API_SIGNIN_AGENT}/${email}`);
  //   console.log(response);
  if (response.status === 500) {
    throw new Error("Verifiez votre connexion");
  } else if (response.status === 404) {
    throw new Error("Un souci avec le ticket");
  } else if (response.status === 405) throw new Error("Problème de méthode");

  return response.json();
};

// hook pour modifier le status d'un ticket
const fecthStatus = async (data: TicketStatusData) => {
  const response = await fetch(`${API_UPDATE_TICKET}${data.agent_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export {
  fetchAgents,
  addAgent,
  updateAgent,
  deleteTodo,
  addTicket,
  fetchTickets,
  fetchAgentConnect,
  fecthStatus,
};
