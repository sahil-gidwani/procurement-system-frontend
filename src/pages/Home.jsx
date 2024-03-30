import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/ProcurEase-logo-blue-tagline.png";

const Home = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <img src={Logo} alt="ProcurEase" className="w-96" />
      <div className="mt-8">
        <Link
          to="/accounts/login"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          to="/accounts/register"
          className="ml-4 rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
