import React from "react";
import { useNavigate } from "react-router-dom";

const FormExtra = ({ label = "", linkText, navigateTo }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full text-right">
      <p className="font-semibold text-gray-500">
        {label}{" "}
        <span
          className="text-custom2 hover:cursor-pointer"
          onClick={() => navigate(navigateTo)}
        >
          {linkText}
        </span>
      </p>
    </div>
  );
};

export default FormExtra;
