import React, { useState } from "react";
import { PiDotsThreeBold } from "react-icons/pi";

const ActionsCell = ({ value, actions }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="flex items-center">
        <PiDotsThreeBold size={20} />
      </button>
      {showDropdown && (
        <div className="absolute right-0 top-8 z-10 w-48 divide-y divide-gray-100 rounded-md border border-gray-200 bg-white shadow-lg">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => action.action()}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionsCell;
