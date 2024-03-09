import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/auth/authSlice";

export default function NavBar() {
  const [navbar, setNavbar] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <nav className="w-full bg-custom1 shadow">
      <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
        <div>
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <a href="/">
              <h2 className="text-xl font-bold text-white">LOGO</h2>
            </a>
            <div className="md:hidden">
              <button
                className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
              navbar ? "block" : "hidden"
            }`}
          >
            <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              <li className="text-white hover:text-custom4">
                <a href="javascript:void(0)">Home</a>
              </li>
              <li className="text-white hover:text-custom4">
                <a href="javascript:void(0)">Blog</a>
              </li>
              <li className="text-white hover:text-custom4">
                <a href="javascript:void(0)">About US</a>
              </li>
              <li className="text-white hover:text-custom4">
                <a href="javascript:void(0)">Contact US</a>
              </li>
            </ul>
            <div className="mt-3 space-y-2 lg:hidden md:inline-block">
            {user ? (
            <div className="relative">
              <button
                className="inline-block w-full text-gray-800 bg-custom4 hover:bg-gray-100 rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.username}
                <svg
                  className="w-4 h-4 ml-2"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {showDropdown && (
                <div
                  id="dropdownList"
                  className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-full top-12 left-0"
                >
                  <ul className="py-2 text-sm text-gray-800">
                    <li>
                      <button
                        onClick={() => navigate("/profile")}
                        className="block px-4 py-2 hover:bg-gray-100 w-full"
                      >
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => dispatch(logout())}
                        className="block px-4 py-2 hover:bg-gray-100 w-full"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <a
                href="/login"
                className="inline-block w-full px-4 py-2 text-center text-gray-800 bg-custom4 rounded-md shadow hover:bg-gray-100"
              >
                Login
              </a>
              <a
                href="/register"
                className="inline-block w-full px-4 py-2 text-center text-gray-800 bg-white rounded-md shadow hover:bg-gray-100"
              >
                Sign Up
              </a>
              </>
          )}
            </div>
          </div>
        </div>
        <div className="hidden space-x-2 md:inline-block">
          {user ? (
            <div className="relative">
              <button
                className="text-gray-800 bg-custom4 hover:bg-gray-100 rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.username}
                <svg
                  className="w-4 h-4 ml-2"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {showDropdown && (
                <div
                  id="dropdownList"
                  className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-40 top-12 right-0"
                >
                  <ul className="py-2 text-sm text-gray-800">
                    <li>
                      <button
                        onClick={() => navigate("/profile")}
                        className="block px-4 py-2 hover:bg-gray-100 w-full"
                      >
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => dispatch(logout())}
                        className="block px-4 py-2 hover:bg-gray-100 w-full"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <a
                href="/login"
                className="px-4 py-2 text-gray-800 bg-custom3 rounded-md shadow hover:bg-gray-100"
              >
                Login
              </a>
              <a
                href="/register"
                className="px-4 py-2 text-gray-800 bg-white rounded-md shadow hover:bg-gray-100"
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
