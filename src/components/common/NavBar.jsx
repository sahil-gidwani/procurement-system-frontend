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
      <div className="mx-auto justify-between px-4 md:flex md:items-center md:px-8 lg:max-w-7xl">
        <div>
          <div className="flex items-center justify-between py-3 md:block md:py-5">
            <span onClick={() => navigate("/")}>
              <h2 className="text-xl font-bold text-white">LOGO</h2>
            </span>
            <div className="md:hidden">
              <button
                className="rounded-md p-2 text-gray-700 outline-none focus:border focus:border-gray-400"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
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
                    className="h-6 w-6 text-white"
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
            className={`mt-8 flex-1 justify-self-center pb-3 md:mt-0 md:block md:pb-0 ${
              navbar ? "block" : "hidden"
            }`}
          >
            <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              <li className="text-white hover:text-custom4">
                <span onClick={() => navigate("/")}>Home</span>
              </li>
              <li className="text-white hover:text-custom4">
                <span onClick={() => navigate("/")}>Blog</span>
              </li>
              <li className="text-white hover:text-custom4">
                <span onClick={() => navigate("/")}>About US</span>
              </li>
              <li className="text-white hover:text-custom4">
                <span onClick={() => navigate("/")}>Contact US</span>
              </li>
            </ul>
            <div className="mt-3 space-y-2 md:inline-block lg:hidden">
              {user ? (
                <div className="relative">
                  <button
                    className="inline-block w-full items-center rounded-lg bg-custom4 px-4 py-2.5 text-center text-sm text-gray-800 hover:bg-gray-100"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {user.username}
                    <svg
                      className="ml-2 h-4 w-4"
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
                      className="absolute left-0 top-12 z-10 w-full divide-y divide-gray-100 rounded-lg bg-white shadow-lg"
                    >
                      <ul className="py-2 text-sm text-gray-800">
                        <li>
                          <button
                            onClick={() => navigate("/accounts/profile/")}
                            className="block w-full px-4 py-2 hover:bg-gray-100"
                          >
                            Profile
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => dispatch(logout())}
                            className="block w-full px-4 py-2 hover:bg-gray-100"
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
                  <span
                    onClick={() => navigate("/accounts/login/")}
                    className="inline-block w-full rounded-md bg-custom4 px-4 py-2 text-center text-gray-800 shadow hover:bg-gray-100"
                  >
                    Login
                  </span>
                  <span
                    onClick={() => navigate("/accounts/register/")}
                    className="inline-block w-full rounded-md bg-white px-4 py-2 text-center text-gray-800 shadow hover:bg-gray-100"
                  >
                    Register
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="hidden space-x-2 md:inline-block">
          {user ? (
            <div className="relative">
              <button
                className="inline-flex items-center rounded-lg bg-custom4 px-4 py-2.5 text-center text-sm text-gray-800 hover:bg-gray-100"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.username}
                <svg
                  className="ml-2 h-4 w-4"
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
                  className="absolute right-0 top-12 z-10 w-40 divide-y divide-gray-100 rounded-lg bg-white shadow-lg"
                >
                  <ul className="py-2 text-sm text-gray-800">
                    <li>
                      <button
                        onClick={() => navigate("/accounts/profile/")}
                        className="block w-full px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => dispatch(logout())}
                        className="block w-full px-4 py-2 hover:bg-gray-100"
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
              <span
                onClick={() => navigate("/login")}
                className="rounded-md bg-custom3 px-4 py-2 text-gray-800 shadow hover:bg-gray-100"
              >
                Login
              </span>
              <span
                onClick={() => navigate("/register")}
                className="rounded-md bg-white px-4 py-2 text-gray-800 shadow hover:bg-gray-100"
              >
                Register
              </span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
