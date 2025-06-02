import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("agent_connect");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };
  // console.log(pathname);
  return (
    <div>
      {/* Sidebar */}
      <div className="bg-purple-600 text-white min-h-screen fixed left-0 w-[15%] flex flex-col p-6">
        <div className="mb-8 cursor-pointer" onClick={() => navigate("/")}>
          {/* Home Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0l2-2m-2-2v-1M12 9v1m0 3h-1"
            />
          </svg>
          <h1 className="text-xl font-semibold text-center">SMART AGENCE</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-3">
            <li>
              <Link
                to={""}
                className={`flex items-center space-x-3 p-2 rounded-md hover:bg-purple-700 ${
                  pathname === "/" ? "bg-purple-700" : ""
                }`}
              >
                {/* Dashboard Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to={"tickets"}
                className={`flex items-center space-x-3 p-2 rounded-md hover:bg-purple-700 ${
                  pathname === "/tickets" ? "bg-purple-700" : ""
                }`}
              >
                {/* Tickets Icon */}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-ticket-detailed"
                >
                  <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
                  <path d="M6 9v6" />
                  <path d="M18 9v6" />
                  <path d="M8 11h8" />
                  <path d="M8 13h8" />
                </svg>

                <span>Tickets</span>
              </Link>
            </li>
            <li>
              <Link
                to={"agents"}
                className={`flex items-center space-x-3 p-2 rounded-md hover:bg-purple-700 ${
                  pathname === "/agents" ? "bg-purple-700" : ""
                }`}
              >
                {/* User Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user-circle-2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                  <path d="M22 12h-4" />
                  <path d="M6 12H2" />
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                </svg>
                <span>Agents</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto" onClick={handleLogout}>
          <button className="flex items-center space-x-3 p-2 rounded-md hover:bg-purple-700">
            {/* Logout Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v-3a2 2 0 012-2H5a2 2 0 01-2 2v3m6 4v-7a2 2 0 012-2H5a2 0 01-2 2v7"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
