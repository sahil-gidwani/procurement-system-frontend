import React from "react";
import { useNavigate } from "react-router-dom";

const FormHeader = ({
  icon: Icon,
  title,
  subTitle = "",
  linkText = "",
  navigateTo = "/",
}) => {
  const navigate = useNavigate();

  return (
    <div className="pb-12 text-center">
      <Icon size={60} className="text-custom2 mx-auto" />
      <h1 className="text-3xl font-bold mt-2 mb-3">{title}</h1>
      <p className="text-gray-500 font-semibold">
        {subTitle}{" "}
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

export default FormHeader;
