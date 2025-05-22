import React from "react";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="mx-auto w-32 h-32 text-red-500">
          <Lock className="w-full h-full" />
        </div>
        <p className="mt-4 text-xl font-semibold text-gray-700 ">
          Désolé, vous n'êtes pas autorisé.
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Veuillez vous connecter.
        </p>
        <button className="bg-gray-300 mt-5 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2">
          <Link to={"/connexion"}>Se connecter</Link>
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
