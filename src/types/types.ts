type CATEGORIE =
  | "TRANSACTION"
  | "CREDIT"
  | "CONSEIL"
  | "CONFORMITE"
  | "SERVICE_CLIENT";
export interface Agent {
  agent_id: string;
  nom: string;
  categorie: string;
  prenoms: string;
  email: string;
  telephone: string;
  annee_de_naissance: string;
}

export interface AgentData {
  nom: string;
  prenoms: string;
  email: string;
  telephone: string;
  annee_de_naissance: string;
}

export interface AgentUpdateData {
  agent_id?: string;
  nom: string;
  prenoms: string;
  email: string;
  telephone: string;
  categorie: string;
  annee_de_naissance: string;
}

export interface Ticket {
  categorie_service_concernee: string;
  description?: string;
  numero_ticket: string;
}

export interface TicketFecth {
  id: string;
  agent_id?: string;
  date_heure_creation: Date;
  categorie_service_concernee: string;
  description?: string;
}

interface Status {
  date: Date;
  updated_date: Date;
  statut: "EN_ATTENTE" | "EN_COURS" | "VALIDE" | "ECHEC"; // Assuming these are the possible enum values
  numero_ticket: string;
}

export interface AgentResponse {
  agent_id: string | null;
  nom?: string;
  prenoms?: string;
  annee_de_naissance?: string;
  categorie?: CATEGORIE; // Assuming these are the possible enum values
  date_enregistrement?: string;
  email?: string;
  telephone?: string;
  role?: string;
  // You might have other agent properties
}

interface TicketRes {
  id: string;
  agent_id: string | null;
  date_heure_creation: string;
  categorie_service_concernee: CATEGORIE; // Assuming these are the possible enum values
  description: string | null;
  agent: AgentResponse | null;
  status: Status;
}

export type TicketResponse = TicketRes;

export interface TicketStatusData {
  agent_id: string;
  numero_ticket: string;
  status: string;
}
