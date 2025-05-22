import { LucideDatabase } from "lucide-react";
import React from "react";

const NoDataPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="mx-auto w-32 h-32 text-gray-400 dark:text-gray-500">
          <LucideDatabase className="w-full h-full" />
        </div>
        <p className="mt-4 text-xl font-semibold text-gray-600 dark:text-gray-300">
          Aucune donnée disponible pour le moment
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Veuillez réessayer plus tard.
        </p>
      </div>
    </div>
  );
};

export default NoDataPage;
