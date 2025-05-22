import React, { useState } from "react";
import { Package, MessageSquare, Headphones, Shield } from "lucide-react";
import type { Ticket } from "../types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTicket } from "../hooks/useFetch";
import { generateTicketNumber } from "../services/services";

interface ServiceOption {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const HomeUser = () => {
  const queryClient = useQueryClient();
  const serviceOptions: ServiceOption[] = [
    { name: "TRANSACTION", icon: Package },
    { name: "CONSEIL", icon: MessageSquare },
    { name: "SERVICE CLIENT", icon: Headphones },
    { name: "CONFORMITE", icon: Shield },
  ];

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleServiceSelection = (serviceName: string) => {
    setSelectedService(serviceName);
    setDescription("");
    setTicket(null);
    setError(null);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  //   creer un ticket
  const mutation = useMutation({
    mutationFn: addTicket,
    onSuccess: () => {
      // Invalider le cache de la requête 'todos' pour forcer une refetch
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
  });

  const handleSubmit = () => {
    if (!selectedService) {
      setError("Veuillez sélectionner un service.");
      return;
    }
    if (!description.trim()) {
      setError("Veuillez ajouter une description de votre demande.");
      return;
    }

    const newTicket: Ticket = {
      categorie_service_concernee: selectedService,
      description: description,
      numero_ticket: generateTicketNumber(selectedService),
    };
    mutation.mutate(newTicket);
    if (mutation.isSuccess) {
      setTicket(newTicket);
    }
  };

  const handleReset = () => {
    setSelectedService(null);
    setDescription("");
    setTicket(null);
    setError(null);

    // setTimeout(() => {
    //   window.location.reload();
    // }, 3000);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-6 sm:py-12">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Ouverture de Ticket de Service
          </h1>

          {ticket ? (
            <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              <h2 className="text-lg font-semibold mb-2">
                Votre Ticket a été créé !
              </h2>
              <p>
                Service: <span className="font-medium">{selectedService}</span>
              </p>
              <p>
                Description: <span className="font-medium">{description}</span>
              </p>
              <p>
                Numéro de Ticket:{" "}
                <span className="font-bold text-indigo-600">
                  {ticket?.numero_ticket}
                </span>
              </p>
              <button
                onClick={handleReset}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Ouvrir un nouveau ticket
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Choisissez un service :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {serviceOptions.map((service) => (
                    <button
                      key={service.name}
                      className={`bg-white border rounded-lg p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition duration-200 ${
                        selectedService === service.name
                          ? "border-indigo-500"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleServiceSelection(service.name)}
                    >
                      <service.icon className="h-8 w-8 text-indigo-500 mb-2" />
                      <span className="text-sm font-medium text-gray-700 text-center">
                        {service.name}
                      </span>
                    </button>
                  ))}
                </div>
                {error && !selectedService && (
                  <p className="text-red-500 text-xs italic mt-2">{error}</p>
                )}
              </div>

              {selectedService && (
                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Description de votre demande pour le service "
                    {selectedService}" :
                  </label>
                  <textarea
                    id="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows={3}
                    placeholder="Décrivez brièvement ce que vous souhaitez faire..."
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                  {error && selectedService && !description.trim() && (
                    <p className="text-red-500 text-xs italic">{error}</p>
                  )}
                </div>
              )}

              {selectedService && (
                <div className="flex items-center justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {mutation.isPending
                      ? "En cours"
                      : "Valider et obtenir le Ticket"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
