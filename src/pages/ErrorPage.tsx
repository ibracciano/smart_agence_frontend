import React from "react";

const ErrorPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-2xl text-gray-700 mb-4">Page non trouvée</p>
        <p className="text-gray-500">
          La page que vous recherchez n'existe pas.
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
