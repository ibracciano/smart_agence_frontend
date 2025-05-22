import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetchAgentConnect } from "../hooks/useFetch";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const mutationConnect = useMutation({
    mutationFn: fetchAgentConnect,
    onSuccess: () => {
      // Invalider le cache de la requête 'todos' pour forcer une refetch
      queryClient.invalidateQueries({ queryKey: ["connect"] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(email);
    if (email) {
      mutationConnect.mutate(email);
      if (mutationConnect.isSuccess) {
        localStorage.setItem(
          "agent_connect",
          JSON.stringify(mutationConnect.data)
        );
        setTimeout(() => {
          navigate("/administrateurs");
        }, 5000);
        // console.log(mutationConnect.data);
      }
    } else {
      toast.error("L'email est requis");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-200 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-purple-600 py-4 px-6 text-white text-center">
          <h2 className="text-xl font-semibold">Bienvenue !</h2>
          <p className="text-indigo-200 text-sm">
            Connectez-vous pour accéder à la gestion des tickets.
          </p>
        </div>
        <div className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nom
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={mutationConnect.isPending}
              >
                {mutationConnect.isPending ? "Vérification..." : "Se Connecter"}
              </button>
            </div>
          </form>
          {mutationConnect.isError && (
            <div className="mt-4 text-red-500 text-sm">
              {mutationConnect.error.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;
