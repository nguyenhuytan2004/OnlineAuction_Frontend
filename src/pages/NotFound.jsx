import { Link } from "react-router-dom";

import { ROUTES } from "../constants/routes";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex justify-center items-center flex-col">
      <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
      <p className="text-2xl text-gray-700 mb-8">Page Not Found</p>
      <Link
        to={ROUTES.HOME}
        className="px-6 py-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 hover:scale-110 transition-all duration-300"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
