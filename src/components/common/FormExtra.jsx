import React from "react";
import { NavLink } from "react-router-dom";

const FormExtra = ({ label = "", linkText, navigateTo }) => {
  return (
    <div className="w-full text-right">
      <p className="font-semibold text-gray-500">
        {label}{" "}
        <NavLink className="text-custom1" to={navigateTo}>
          {linkText}
        </NavLink>
      </p>
    </div>
  );
};

export default FormExtra;
