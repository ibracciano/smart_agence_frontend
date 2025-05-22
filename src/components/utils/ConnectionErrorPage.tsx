import React from "react";

const ConnectionErrorPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-600">
          Problème de connexion
        </h1>
        <p className="text-2xl text-gray-700 mb-4">
          Impossible de se connecter au serveur.
        </p>
        <p className="text-gray-500">
          Veuillez vérifier votre connexion Internet et réessayer.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
};

export default ConnectionErrorPage;
