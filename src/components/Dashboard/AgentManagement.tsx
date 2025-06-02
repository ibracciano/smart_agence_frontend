import { useState } from "react";
import { Trash2, Edit, Plus, User, Users, XCircle } from "lucide-react";
import ConnectionErrorPage from "../utils/ConnectionErrorPage";
import LoadingPage from "../utils/LoadingPage";
import type { Agent, AgentData, AgentUpdateData } from "../../types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAgent,
  deleteTodo,
  fetchAgents,
  updateAgent,
} from "../../hooks/useFetch";
import toast from "react-hot-toast";

const AgentManagement = () => {
  const agentConnectString = localStorage.getItem("agent_connect");
  const agent_connect = agentConnectString
    ? JSON.parse(agentConnectString)
    : null; // Déclarez agent_connect avec un type qui accepte null au départ
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [categorie, setCategorie] = useState("");
  const [agentToEdit, setAgentToEdit] = useState<AgentUpdateData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [agentInput, setAgentInput] = useState<AgentData>({
    nom: "",
    prenoms: "",
    email: "",
    telephone: "",
    annee_de_naissance: "",
  });

  // console.log(agent_connect);

  //  utilisatation de useQuery
  const { isLoading, isError, data } = useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });

  // pour ajouter et modifier une agent

  const mutation = useMutation({
    mutationFn: agentToEdit ? updateAgent : addAgent,
    onSuccess: () => {
      // Invalider le cache de la requête 'todos' pour forcer une refetch
      queryClient.invalidateQueries({ queryKey: ["agent"] });
    },
  });
  // console.log(registrationResult);

  // pour supprimer un agent
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      // Invalider le cache de la requête 'todos' pour forcer une refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      // Optionnellement, vous pouvez également invalider une requête spécifique au todo supprimé
      // queryClient.invalidateQueries({ queryKey: ['todo', todo.id] });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentInput({
      ...agentInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    let dataToSubmit;
    // console.log("agent", agentInput);
    if (agentToEdit) {
      dataToSubmit = {
        ...agentInput,
        categorie: categorie,
        agent_id: agentToEdit.agent_id, // Ajouter l'agent_id pour la mise à jour
      };
    } else {
      dataToSubmit = {
        ...agentInput,
        categorie: categorie,
        // L'agent_id n'est pas nécessaire lors de la création
      };
    }
    if (agent_connect.role === "ADMINISTRATEUR") {
      // console.log("error", mutation.co);
      mutation.mutate(dataToSubmit);
      if (mutation.isSuccess) {
        resetForm();
      }
    } else {
      toast.error("Vous n'êtes pas autorisé");
    }
  };

  const handleEditAgent = (agent: Agent) => {
    setAgentToEdit(agent);
    setAgentInput({
      nom: agent.nom,
      prenoms: agent.prenoms,
      annee_de_naissance: agent.annee_de_naissance,
      telephone: agent.telephone,
      email: agent.email,
    });
    setCategorie(agent.categorie);
    setOpen(true);
  };

  const handleDeleteAgent = (agent: Agent) => {
    setAgentToDelete(agent);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAgent = () => {
    if (agentToDelete) {
      deleteMutation.mutate(agentToDelete.agent_id);
    }
    setTimeout(() => {
      setIsDeleteModalOpen(false);
    }, 2000);
  };

  const cancelDeleteAgent = () => {
    setIsDeleteModalOpen(false);
    setAgentToDelete(null);
  };

  const resetForm = () => {
    setAgentInput({
      nom: "",
      prenoms: "",
      annee_de_naissance: "",
      telephone: "",
      email: "",
    });
    setCategorie("");
    setAgentToEdit(null);
  };

  const handleCloseModal = () => {
    setOpen(false);
    resetForm();
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
        <ConnectionErrorPage />
      </div>
    );
  }

  if (!data) {
    return <div>Aucun agent trouvé.</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-500" />
          Gestion des Agents
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-purple-500 flex items-center hover:bg-purple-600 text-white text-sm px-4 py-2 rounded-md"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Ajouter un agent</span>
        </button>
      </div>

      <div className="rounded-md border max-w-[970px] overflow-x-scroll">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numero
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prénoms
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Naissance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data !== null && data.length > 0 ? (
              data.map((agent, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      A{agent.agent_id.slice(-2).toLocaleUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {agent.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {agent.prenoms}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {agent.annee_de_naissance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {agent.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {agent.telephone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {agent.categorie}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleEditAgent(agent)}
                      className="text-blue-500 hover:text-blue-600"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAgent(agent)}
                      className="text-red-500 hover:text-red-600"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-4">
                  Aucun agent trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {agentToEdit ? "Modifier un agent" : "Ajouter un agent"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <form className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="nom"
                  className="text-right block text-sm font-medium text-gray-700"
                >
                  Nom
                </label>
                <input
                  id="nom"
                  name="nom"
                  value={agentInput.nom}
                  onChange={handleInputChange}
                  className="col-span-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nom de l'agent"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="prenoms"
                  className="text-right block text-sm font-medium text-gray-700"
                >
                  Prénoms
                </label>
                <input
                  id="prenoms"
                  name="prenoms"
                  value={agentInput.prenoms}
                  onChange={handleInputChange}
                  className="col-span-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Prénoms de l'agent"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="annee_de_naissance"
                  className="text-right block text-sm font-medium text-gray-700"
                >
                  Année de naissance
                </label>
                <input
                  type="date"
                  name="annee_de_naissance"
                  id="annee_de_naissance"
                  value={agentInput.annee_de_naissance}
                  onChange={handleInputChange}
                  className="col-span-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="email"
                  className="text-right block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={agentInput.email}
                  onChange={handleInputChange}
                  className="col-span-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Email de l'agent"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="telephone"
                  className="text-right block text-sm font-medium text-gray-700"
                >
                  Téléphone
                </label>
                <div className="col-span-3 mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    +225
                  </span>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={agentInput.telephone}
                    onChange={handleInputChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Numéro de téléphone"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="categorie"
                  className="text-right block text-sm font-medium text-gray-700"
                >
                  Catégorie
                </label>
                <select
                  id="categorie"
                  name="categorie"
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  className="col-span-3 mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Selectionner une categorie" disabled>
                    Sélectionner une catégorie
                  </option>
                  <option value="TRANSACTION">TRANSACTION</option>
                  <option value="CREDIT">CREDIT</option>
                  <option value="CONSEIL">CONSEIL</option>
                  <option value="SERVICE_CLIENT">SERVICE CLIENT</option>
                  <option value="CONFORMITE">CONFORMITE</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-200 flex items-center hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  <span>Annuler</span>
                </button>

                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                  onClick={handleRegister}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
            {mutation.isSuccess && (
              <p className="bg-teal-800 text-center rounded-md text-white p-2 mt-2">
                Ajouté avec succès
              </p>
            )}
            {mutation.isError && (
              <p className="bg-red-800 text-center rounded-md text-white p-2 mt-2">
                {mutation.error.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold mt-2">Supprimer l'agent</h2>
              <button
                onClick={cancelDeleteAgent}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-700 mb-4">
              Êtes-vous sûr de vouloir supprimer l'agent {agentToDelete?.nom}?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDeleteAgent}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteAgent}
                className="bg-red-500 flex items-center hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>
                  {deleteMutation.isPending ? "Suppression..." : "supprimer"}
                </span>
              </button>
            </div>

            {deleteMutation.isSuccess && (
              <p className="bg-teal-800 text-center rounded-md text-white p-2 mt-2">
                Supprimé avec succès
              </p>
            )}
            {deleteMutation.isError && (
              <p className="bg-red-800 text-center rounded-md text-white p-2 mt-2">
                {deleteMutation.error.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentManagement;
