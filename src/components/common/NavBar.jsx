import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { logout } from "../../redux/auth/authSlice";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Logo from "../../assets/ProcurEase-logo-yellow.png";
import Toast from "../common/Toast";

export default function NavBar() {
  const [navbar, setNavbar] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const unauthenticated_menus = [{ name: "Home", link: "/" }];

  const admin_menus = [
    { name: "Home", link: "/" },
    { name: "Dashboard", link: "/dashboard/admin" },
  ];

  const procurement_officer_menus = [
    { name: "Home", link: "/" },
    { name: "Inventory", link: "/inventory/list" },
    { name: "Requisitions", link: "/purchase/requisition/list" },
    { name: "Orders", link: "/purchase/order/list" },
    { name: "Inventory Receipts", link: "/logistics/inventory-receipt/list" },
    { name: "Invoices", link: "/logistics/invoice/procurement-officer-list" },
    { name: "Dashboard", link: "/dashboard/procurement-officer" },
  ];

  const vendor_menus = [
    { name: "Home", link: "/" },
    { name: "Requisitions", link: "/purchase/requisition/vendor-list" },
    { name: "Bids", link: "/purchase/bid/list" },
    { name: "Orders", link: "/purchase/order/vendor-list" },
    {
      name: "Inventory Receipts",
      link: "/logistics/inventory-receipt/vendor-list",
    },
    { name: "Invoices", link: "/logistics/invoice/list" },
    { name: "Dashboard", link: "/dashboard/vendor" },
  ];

  const menus = user?.is_superuser
    ? admin_menus
    : user?.user_role === "procurement_officer"
      ? procurement_officer_menus
      : user?.user_role === "vendor"
        ? vendor_menus
        : unauthenticated_menus;

  const dropdownMenus = [
    { name: "Profile", link: "/accounts/profile" },
    { name: "Change Password", link: "/accounts/change-password" },
    { name: "Logout", onClick: () => handleLogout() },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        dispatch(logout());
        navigate("/");
        Toast.fire({
          icon: "success",
          title: "Logged out successfully!",
        });
      } catch (error) {
        console.error("Error logging out:", error);

        Toast.fire({
          icon: "error",
          title: "Error logging out!",
        });
      }
    }
  };

  return (
    <nav className="w-full bg-custom1 shadow">
      <div className="mx-auto justify-between px-4 md:flex md:items-center md:px-8 lg:max-w-7xl">
        <div>
          <div className="flex items-center justify-between py-1 md:block md:py-2">
            <NavLink to="/">
              <img src={Logo} alt="logo" className="h-16" />
            </NavLink>
            {/* Hamburger Icon */}
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
          {/* Menus Non Collapsed */}
          <div
            className={`mt-8 flex-1 justify-self-center pb-3 md:mt-0 md:block md:pb-0 ${
              navbar ? "block" : "hidden"
            }`}
          >
            <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {menus.map((menu, index) => (
                <li key={index}>
                  <NavLink
                    to={menu.link}
                    className={({ isActive }) =>
                      isActive
                        ? "text-custom4"
                        : "text-white hover:text-custom3"
                    }
                  >
                    {menu.name}
                  </NavLink>
                </li>
              ))}
            </ul>
            {/* Menus in Collapsed State */}
            <div className="mt-3 space-y-2 md:inline-block lg:hidden">
              {/* User Button */}
              {user ? (
                <div className="relative">
                  <button
                    className="inline-fle w-full items-center rounded-lg bg-custom4 px-4 py-2.5 text-center text-sm text-gray-800 hover:bg-gray-100"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <span className="flex w-full items-center justify-center">
                      {user.username}
                      {showDropdown ? (
                        <FaChevronUp className="ml-2 h-3 w-3" />
                      ) : (
                        <FaChevronDown className="ml-2 h-3 w-3" />
                      )}
                    </span>
                  </button>
                  {showDropdown && (
                    <div
                      id="dropdownList"
                      className="absolute left-0 top-12 z-10 w-full divide-y divide-gray-100 rounded-lg bg-white shadow-lg"
                    >
                      <ul className="py-2 text-sm text-gray-800">
                        {dropdownMenus.map((dropdownMenu, index) => (
                          <li key={index}>
                            <NavLink
                              to={dropdownMenu?.link}
                              onClick={dropdownMenu?.onClick}
                              className="block w-full px-4 py-2 hover:bg-gray-100"
                            >
                              {dropdownMenu.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                // Register and Login Buttons
                <div className="mt-12">
                  <NavLink
                    to="/accounts/login/"
                    className="inline-block w-full rounded-md bg-custom4 px-4 py-2 text-center text-white shadow hover:bg-custom3"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/accounts/register/"
                    className="mt-4 inline-block w-full rounded-md bg-custom2 px-4 py-2 text-center text-white shadow hover:bg-custom3"
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Menu in Non Collapsed State */}
        <div className="hidden space-x-2 md:inline-block">
          {/* User button */}
          {user ? (
            <div className="relative">
              <button
                className="inline-flex items-center rounded-lg bg-custom4 px-4 py-2.5 text-center text-sm text-gray-800 hover:bg-gray-100"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.username}
                {showDropdown ? (
                  <FaChevronUp className="my-auto ml-2 h-3 w-3" />
                ) : (
                  <FaChevronDown className="my-auto ml-2 h-3 w-3" />
                )}
              </button>
              {showDropdown && (
                <div
                  id="dropdownList"
                  className="absolute right-0 top-12 z-10 w-40 divide-y divide-gray-100 rounded-lg bg-white shadow-lg"
                >
                  <ul className="py-2 text-sm text-gray-800">
                    {dropdownMenus.map((dropdownMenu, index) => (
                      <li key={index}>
                        <NavLink
                          to={dropdownMenu?.link}
                          onClick={dropdownMenu?.onClick}
                          className="block w-full px-4 py-2 hover:bg-gray-100"
                        >
                          {dropdownMenu.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            // Register and Login Buttons
            <>
              <NavLink
                to="/accounts/login/"
                className="rounded-md bg-custom4 px-4 py-2 text-center text-white shadow hover:bg-custom3"
              >
                Login
              </NavLink>
              <NavLink
                to="/accounts/register/"
                className="rounded-md bg-custom2 px-4 py-2 text-center text-white shadow hover:bg-custom3"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
