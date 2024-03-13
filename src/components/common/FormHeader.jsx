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
      <Icon size={60} className="mx-auto text-custom2" />
      <h1 className="mb-3 mt-2 text-3xl font-bold">{title}</h1>
      <p className="font-semibold text-gray-500">
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
