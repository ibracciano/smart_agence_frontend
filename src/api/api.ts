const BASE_URL = "http://127.0.0.1:8000/api/v1";

// api pour les agents
export const API_GET_ALL_AGENTS = `${BASE_URL}/agents/`;

// api pour creer un agent
export const API_CREATE_AGENT = `${BASE_URL}/agents/`;

// api pour creer un ticket
export const API_CREATE_TICKET = `${BASE_URL}/tickets/`;

export const API_UPDATE_TICKET = `${BASE_URL}/tickets/update/`;

// api pour connecter un agent
export const API_SIGNIN_AGENT = `${BASE_URL}/agents/signin`;
